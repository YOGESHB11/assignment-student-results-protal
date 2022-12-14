const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const validator = require("../validators/validator")
const jwt = require("jsonwebtoken")

const register = async function (req, res) {
    try {
        const data = req.body
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Pls provide user details" })
        }
        let { name, email, password } = data
        let mandatoryFields = ["name", "email", "password"]
        for (let key of mandatoryFields) {
            if (!validator.isValid(req.body[key])) {
                return res.status(400).send({ status: false, message: `value of ${key} must be present ` })
            }
        }
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Please provide a name" })
        }
        data.name = name.trim()
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid EmailId" })
        }
        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.status(409).send({ status: false, msg: "User with this emailId already exists" })
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password must contain an uppercase,a lowercase , a special character and should be of length between 8-15" })
        }

        bcrypt.hash(password, 10).then(async (result) => {
            console.log(result)
            data.password = result
            const newUser = await userModel.create(data)
            res.status(201).send({ status: true, message: "Registered successfully", data: newUser })
        }).catch((err) => console.log(err))

        return
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const login = async function (req, res) {
    try {
        const data = req.body
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Pls provide user details" })
        }
        let { email, password } = data
        let mandatoryFields = ["email", "password"]
        for (let key of mandatoryFields) {
            if (!validator.isValid(req.body[key])) {
                return res.status(400).send({ status: false, message: `value of ${key} must be present ` })
            }
        }
        
        const user = await userModel.findOne({ email: email })
        if (!user) {
            res.status(400).send({ status: false, message: "Invalid Credentials" })
        }
        bcrypt.compare(password, user.password, function (err, result) {

            if (result) {
                let token = jwt.sign(
                    {
                        userId: user._id.toString()
                    },
                    "secret-key"
                );
                res.setHeader("Authorization", token)
                res.status(200).send({ status: true, msg: "login successful", data: { token: token, userId: user._id } });
            }
            else {
                return res.status(401).send({ status: false, message: "Invalid credentials" })
            }
        })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { register, login }