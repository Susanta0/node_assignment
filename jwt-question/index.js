const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());


const blackListToken= new Set()

app.post("/login", (req, res)=>{
    const { email, password } = req.body;
    if (email === "user@example.com" && password === "password") {
        const token = jwt.sign({ email }, "masai", { expiresIn: '1h' });
        return res.status(200).json({ token });
    }

    return res.status(401).json({ message: "Invalid credentials" });

})

app.post("/logout", (req, res)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    blackListToken.add(token);
    return res.status(200).json({ message: "Logged out successfully", blackListToken: blackListToken });
})


const authMiddleware=(req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (blackListToken.has(token)) {
        return res.status(401).json({ message: "Token is blacklisted" });
    }

    jwt.verify(token, "masai", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}


app.get("/dashboard", authMiddleware, (req, res)=>{
    return res.status(200).json({ message: "Welcome to the dashboard", user: req.user });
})



app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
})