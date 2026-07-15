# JWT — Interview Prep (grounded in We-Meet)

A study guide for explaining JSON Web Tokens **and** how they're used in this project. Each answer includes the general concept plus the specific We-Meet implementation, so you can speak to both theory and your code.

---

## 1. Fundamentals

### Q: What is a JWT?
A **JSON Web Token** is a compact, URL-safe, self-contained token used to securely transmit claims between parties. It's commonly used for **stateless authentication**: the server issues it after login, and the client sends it back on every request to prove who it is.

### Q: What are the three parts of a JWT?
`header.payload.signature` — three Base64URL-encoded parts joined by dots:
- **Header** — token type (`JWT`) and signing algorithm (e.g. `HS256`).
- **Payload** — the claims (data). In We-Meet: `{ id: user._id, isAdmin: user.isAdmin, iat, exp }`.
- **Signature** — `HMACSHA256(base64(header) + "." + base64(payload), secret)`. It verifies the token wasn't tampered with.

### Q: Is a JWT encrypted?
**No.** By default it's **signed, not encrypted.** The payload is only Base64-encoded, so anyone can decode and read it (try it on jwt.io). That's why **you never put sensitive data** (passwords, etc.) in the payload. In We-Meet the payload only holds the user id and an admin flag — non-secret identifiers.

### Q: What stops someone from editing the payload?
The **signature**. If an attacker changes the payload, the signature no longer matches, and `jwt.verify()` fails — because they don't have the server's secret (`ACCESS_TOKEN_SECRET`) to re-sign it.

---

## 2. Why JWT / trade-offs

### Q: JWT vs server-side sessions?
- **Sessions:** server stores session state (in memory / Redis / DB); client holds only a session id cookie. Stateful — the server must look up the session each request.
- **JWT:** the token itself carries the claims; the server just verifies the signature. **Stateless** — no server-side store, which scales horizontally easily (any instance can verify).
- **Cost of JWT:** you can't easily invalidate a token before it expires (see revocation below).

### Q: Why did this project use JWT?
The API (Render), frontend (Vercel), and socket (Railway) are separate services. A stateless token lets any of them verify a request independently by sharing one secret — no shared session store needed.

---

## 3. This project's implementation

### Q: Walk me through the auth flow in We-Meet.
1. **Login/Register** (`api/routes/auth.js`): verify credentials (bcrypt compares the password against the stored hash), then sign a token:
   ```js
   jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
   ```
   Return the user object **with the password stripped**, plus the token.
2. **Client stores it** (`AuthContext` → `localStorage`).
3. **Every request** attaches it via an Axios interceptor (`setupAxios.js`):
   ```js
   config.headers.Authorization = `Bearer ${token}`;
   ```
4. **Server verifies it** on all non-auth routes via `verifyToken` middleware (`api/middleware/verifyToken.js`): it reads the `Authorization` header, runs `jwt.verify`, and sets `req.user = payload`.
5. **Handlers use `req.user.id`** as the acting user — never a `userId` from the body.
6. **Socket** verifies the same token on the handshake (`socket/index.js`, `io.use(...)`).

### Q: Show the middleware.
```js
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json("You are not authenticated");
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json("Token is not valid");
    req.user = payload;   // { id, isAdmin, iat, exp }
    next();
  });
};
```
`401` = no token (not authenticated). `403` = token present but invalid/expired (authenticated attempt, forbidden).

### Q: Why derive the user id from the token instead of the request body? (⭐ key point)
Because trusting the body is an **authorization bypass**. Originally routes did things like:
```js
if (req.body.userId === post.userId) { /* allow delete */ }
```
Anyone could send **any** `userId` in the JSON body and delete/update **other people's** data. After the change, the id comes from the verified token (`req.user.id`), which the client can't forge without the secret. This is the single most important fix JWT enabled here.

### Q: How does the socket use JWT?
The client passes the token in the handshake:
```js
io(url, { auth: { token } });
```
The server gates every connection:
```js
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = payload;
    next();
  });
});
```
So `socket.user.id` is trusted, and a client can't claim to be someone else.

---

## 4. Storage & transport

### Q: Where is the token stored on the client, and what's the risk?
In **`localStorage`**. Risk: it's readable by JavaScript, so a **XSS** vulnerability could steal it. Mitigation: prevent XSS (React escapes output by default), keep token lifetime bounded.

### Q: localStorage vs httpOnly cookie?
- **localStorage + Bearer header:** simple, works cross-origin, immune to CSRF — but exposed to XSS.
- **httpOnly cookie:** not readable by JS (safer against XSS) — but needs CSRF protection and, cross-site (Vercel↔Render), requires `SameSite=None; Secure`, which is fragile.
- **This project chose the Bearer/localStorage approach** specifically because the frontend and backend are on different domains, making cross-site cookies painful.

### Q: How is the token sent?
As an HTTP header: `Authorization: Bearer <token>`, added centrally by an Axios request interceptor so no individual call has to remember it.

---

## 5. Expiry, refresh, revocation

### Q: How long is the token valid here?
**7 days** (`expiresIn: "7d"`). When it expires, `jwt.verify` throws, the API returns 401/403, and the client's response interceptor clears `localStorage` and redirects to login.

### Q: Access token vs refresh token — and what does this project use?
- **Access token:** short-lived, sent on every request.
- **Refresh token:** long-lived, stored more securely, used only to mint new access tokens without re-login.
- **We-Meet uses a single 7-day access token** for simplicity (a `REFRESH_TOKEN_SECRET` exists in env but isn't wired up). A production hardening would be a short access token (e.g. 15 min) + refresh token.

### Q: Can you invalidate a JWT before it expires? (logout / ban)
Not directly — that's the main downside of stateless JWT. Options:
- **Short expiry + refresh tokens** (limit the damage window).
- **A server-side blocklist/denylist** of revoked token ids (`jti`) — reintroduces some state.
- **Rotate the secret** (invalidates *all* tokens — nuclear option).
In We-Meet, "logout" simply deletes the token from `localStorage` client-side; the token would still be valid until expiry if someone had copied it.

---

## 6. Security pitfalls (common follow-ups)

### Q: What's the `alg: none` attack?
An attacker sets the header algorithm to `none`, producing an unsigned token. A naive verifier that trusts the header would accept it. The `jsonwebtoken` library defends against this — you should verify with an expected algorithm and never accept `none`.

### Q: How important is the secret?
Critical. Anyone with `ACCESS_TOKEN_SECRET` can forge valid tokens for **any** user. It must be long and random, stored only in environment variables, and **never committed to git**. (In this project the secret was previously committed in `.env` — it's now gitignored, and the recommendation is to rotate it.)

### Q: HS256 vs RS256?
- **HS256 (symmetric):** one shared secret signs and verifies. Simple; fine when the same party (or trusted services sharing the secret) does both. **We-Meet uses HS256** — the API and socket share the secret.
- **RS256 (asymmetric):** private key signs, public key verifies. Better when many independent services only need to *verify* without being able to *sign*.

### Q: Why still hash passwords if you have JWT?
JWT is about **session/identity after login**; it has nothing to do with how credentials are stored. Passwords are hashed with **bcrypt** (salted, slow) so that even a DB breach doesn't expose plaintext passwords. They're two separate concerns.

### Q: What else hardens auth in this project?
- **Rate limiting** (`express-rate-limit`) on login/register/forgot-password to slow brute force.
- **Password never returned** in any response.
- **Field-whitelisted** user updates (can't set `isAdmin` via the update body).

---

## 7. Rapid-fire

- **What does `iat`/`exp` mean?** Issued-at / expiry timestamps (auto-added by `expiresIn`).
- **Is a JWT confidential?** No — signed, not encrypted. Don't store secrets in it.
- **Where's the signature verified?** Server-side, using the secret, in `verifyToken` (and the socket `io.use`).
- **What happens on an invalid token?** `403`; client clears session and redirects to login.
- **What happens with no token?** `401`.
- **Can the client read the payload?** Yes (Base64 decode) — that's expected.
- **Stateless meaning?** Server keeps no session store; the token carries the claims.
