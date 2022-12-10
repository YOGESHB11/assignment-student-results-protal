const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const studentController = require("../controllers/studentontroller")
const mid = require("../middlewares/auth")


router.post("/user/register", userController.register)

router.post("/user/login", userController.login)

router.post("/student/create", mid.authentication, studentController.createStudent)

router.get("/student/fetch", studentController.getStudent)

router.put("/student/edit/:studentId", mid.authentication, studentController.editStudent)

router.delete("/student/delete/:studentId", mid.authentication, studentController.deleteStudent)

module.exports = router