import React from 'react'

function Notfound() {
    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            fontFamily: "Arial, sans-serif",
            textAlign: "center"
        }}>
            <h1 style={{
                fontSize: "5rem",
                margin: 0,
                color: "#ff4d4f"
            }}>
                404
            </h1>
            <p style={{
                fontSize: "1.5rem",
                color: "#555"
            }}>
                Oops! The page you're looking for doesn't exist.
            </p>
        </div>
    );
}

export default Notfound;
