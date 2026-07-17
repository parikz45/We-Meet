const router = require("express").Router();
const User = require("../Models/User");
const bcryptjs = require("bcryptjs");

// Fields a user is allowed to change on their own profile.
const ALLOWED_UPDATES = [
    "username",
    "email",
    "profilePicture",
    "coverPicture",
    "desc",
    "city",
    "state",
    "relationship",
];

// update user
router.put("/:id", async (req, res) => {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json("You can only update your own account");
    }
    try {
        // Whitelist fields to prevent mass-assignment (e.g. isAdmin, password).
        const updates = {};
        for (const key of ALLOWED_UPDATES) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            updates.password = await bcryptjs.hash(req.body.password, salt);
        }

        await User.findByIdAndUpdate(req.params.id, { $set: updates });
        res.status(200).json("Account has been updated");
    } catch (err) {
        res.status(500).json(err);
    }
});


// delete user
router.delete("/:id", async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }

    } else {
        res.status(403).json("You can only delete your account")
    }
});

// get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get all users
router.get("/all",async(req,res)=>{
    try{
        const userList=await User.find().select("-password");
        res.status(200).json(userList);
    }catch(err){
        res.status(500).json(err);
    }
})

// Get friends
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId);
            })
        )
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err);
    }
})



// follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);
            if (!user.followers.includes(req.user.id)) {
                await user.updateOne({ $push: { followers: req.user.id } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been followed");
            }
            else {
                res.status(403).json("You already follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(400).json("You cannot follow yourself");
    }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);
            if (user.followers.includes(req.user.id)) {
                await user.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("User has been unfollowed");
            }
            else {
                res.status(403).json("You do not follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(400).json("You cannot unfollow yourself");
    }
});

module.exports = router;