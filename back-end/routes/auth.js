/* eslint-disable no-undef */
const express = require('express');
const User = require('../models/User');
require("dotenv").config();

const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")

//ROUTE 1: create a user using: POST "api/auth/createuser".no login required

router.post('/createuser', [

    check('name', 'Enter valid name').isLength({ min: 3 }),
    check('email', 'Enter valid email').isEmail(),
    check('password', 'password must be 5 characters').isLength({ min: 5 })

], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    //Check whether user with their email exists already

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "sorry user with this email already exists" })
        }
        //secure password by bcryptjs salt

        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt)

        //create new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        // return token

        const data = {
            user: {
                id: user.id
            }
        }
        const JWT_SECRET = process.env.JWT_SECRET
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, message: "SignUp successfully", authtoken })
    }
    //catch the errors
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occurred")

    }
})

//ROUTE 2: Authenticate a user using: POST "api/auth/login".no login required

router.post('/login', [

    check('email', 'Enter valid email').isEmail(),
    check('password', 'password must be 5 characters').exists(),

], async (req, res) => {

    // if there is error ,return bad request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let success = false;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const JWT_SECRET = process.env.JWT_SECRET
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, message: "logged in successfully", authtoken })
    }
    catch (error) {

        console.error(error.message);
        res.status(500).send("internal server errors occurred")
    }

})

//ROUTE 3: Get loggedin  user Details using: POST "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {

        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server errors occurred")
    }
})


module.exports = router