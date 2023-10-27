require("dotenv").config();
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const secretKey = process.env.JWT_SECRET; 
const expiresIn = "1h"; 
const User = [{
    email: "test@gmail.com",
    password: "123456789"
}];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:3000"
    })
);

function generateToken() {
    return new Promise((resolve, reject) => {
        jwt.sign(User[0], secretKey, { expiresIn }, (err, token) => {
            if (err) {
                reject("Token Not Generated");
            } else {
                resolve(token);
            }
        });
    });
}




// Middleware to verify the token
function verifyTokenHere(req, res, next) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    
    console.log(authToken);
    const tokenToVerify = authToken.replace("Bearer ", "");
    jwt.verify(tokenToVerify, secretKey, (err, data) => {
        if (err) {
            res.send({
                status: false,
                message: "Token Expire"
            })
        } else {
            res.send({
                status: true,
                message: data,
            })
        }
    });

    next();
   
}



app.post("/login", async (req, res) => {
    const inputUser = req.body;
    console.log(inputUser);
    try {

        const user = await User.find(existingUser => existingUser.email === inputUser.email && existingUser.password === inputUser.password)
        console.log(user);
        if (!user) {
            res.send({
                message: "User Not Found!!!"
            })
            return;
        } else {
            const token = await generateToken();
            res.json({ token });
        }

    } catch (err) {
        res.status(500).json({
            error: err,
            message: "Not Generated"
        });
    }
});




app.get("/login", verifyTokenHere, (req, res) => {

    

})






app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
