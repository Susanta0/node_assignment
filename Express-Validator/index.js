const express = require("express");

const app = express();

app.use(express.json());

const { body, validationResult } = require("express-validator");

const userValidation= [
    body("role")
    .exists().withMessage("role is required")
    .isIn(["Admin"]).withMessage("role should be Admin"),

    body("phone")
    .exists().withMessage("phone number is required")
    .notEmpty().withMessage("phone number should not empty")
    .isMobilePhone().withMessage("phone number should be valid")
]


app.post("/api/user", userValidation, (req,res)=>{
    const err= validationResult(req)
    if(!err.isEmpty()){
        return res.status(400).json({message: err});
    }

    return res.status(200).json({message:"Data is Validated", data: req.body})
})


app.listen(8080, ()=>{
    console.log("Server is running on port 8080");
})