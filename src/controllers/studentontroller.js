const studentModel = require("../models/studentModel")
const validator = require("../validators/validator")


const createStudent = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Pls provide user details" })
        }
        let { studentName, subject, marks } = data
        let mandatoryFields = ["studentName", "subject", "marks"]
        for (let key of mandatoryFields) {
            if (!validator.isValid(req.body[key])) {
                return res.status(400).send({ status: false, message: `value of ${key} must be present ` })
            }
        }
        if (!validator.isLetters(studentName)) {
            return res.status(400).send({ status: false, message: "Provide a valid name" })
        }
        if (!validator.isValidSubject(subject)) {
            return res.status(400).send({ status: false, message: "subjects can only be maths,english,physics,chemistry or computers only" })
        }
        if (typeof marks != "number") {
            return res.status(400).send({ status: false, message: "Marks can only be numbers" })
        }
        data.userId = req.userId
        console.log(data)
        let findStudent = await studentModel.findOne({ $and: [{ userId: data.userId, studentName: data.studentName, subject: data.subject, isDeleted: false }] })
        if (findStudent) {
            console.log(findStudent)
            data.marks += findStudent.marks
            let update = await studentModel.findByIdAndUpdate({ _id: findStudent._id }, data, { new: true })
            return res.status(200).send({ status: true, messgage: "student details updated", data: update })
        } else {
            let create = await studentModel.create(data)
            return res.status(200).send({ status: true, messgage: "student details created", data: create })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const getStudent = async function (req, res) {
    try {
        let data = req.query
        let { studentName, subject } = data
        let availParams = ["studentName", "subject"]
        for (let key in data) {
            if (!availParams.includes(key)) {
                return res.status(400).send({ status: false, message: `Query params can only be-${availParams.join(",")}` })
            }
        }

        for (let key in data) {
            if (!validator.isValid(data[key])) {
                return res.status(400).send({ status: false, message: `${key} can't be empty` })
            }
        }
        if (studentName) {
            studentName = studentName.trim()
            if (!validator.isLetters(studentName)) {
                return res.status(400).send({ status: false, message: "product name can only contains letters" })
            }
            data.studentName = { $regex: studentName, $options: "i" }
        }
        if (subject) {
            subject = subject.trim()
            if (!validator.isValidSubject(subject)) {
                return res.status(400).send({ status: false, message: "subjects can only be maths,english,physics,chemistry or computers only" })
            }
        }
        data.isDeleted = false
        let result = await studentModel.find(data)
        if (!result) {
            return res.status(404).send({ status: false, message: "No document found" })
        }
        let count = result.length
        return res.status(200).send({ status: true, count: count, data: result })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const editStudent = async function (req, res) {
    try {
        let studentId = req.params.studentId
        let data = req.body
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Pls provide details for updation" })
        }
        let { studentName, subject, marks } = data

        if (!studentId) {
            return res.status(400).send({ status: false, msg: "Provide studentId" })
        }
        if (!validator.isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, msg: "Invalid studentID" })
        }
        let findUser = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "Student document not found" })
        }

        if (req.userId != findUser.userId.toString()) {
            return res.status(403).send({ status: false, msg: "Unauthorized access!!" })
        }
        if (studentName) {
            if (!validator.isLetters(studentName)) {
                return res.status(400).send({ status: false, message: "Provide a valid name" })
            }
        }
        if (subject) {
            if (!validator.isValidSubject(subject)) {
                return res.status(400).send({ status: false, message: "subjects can only be maths,english,physics,chemistry or computers only" })
            }
        }
        if (marks) {
            if (typeof marks != "number") {
                return res.status(400).send({ status: false, message: "Marks can only be numbers" })
            }
        }
        let edit = await studentModel.findByIdAndUpdate(studentId, data, { new: true })
        return res.status(201).send({ status: true, msg: "Document editted succeddfully", data: edit })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteStudent = async function (req, res) {
    try {
        let studentId = req.params.studentId
        if (!studentId) {
            return res.status(400).send({ status: false, msg: "Provide studentId" })
        }
        if (!validator.isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, msg: "Invalid studentID" })
        }
        let findUser = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (!findUser) {
            return res.status(404).send({ status: false, message: "Document not found" })
        }
        if (req.userId != findUser.userId.toString()) {
            return res.status(403).send({ status: false, msg: "Unauthorized access!!" })
        }
        await studentModel.findByIdAndUpdate(studentId, { isDeleted: true }, { new: true })
        return res.status(200).send({ status: true, msg: "Document deleted successfully" })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {
    createStudent,
    getStudent,
    editStudent,
    deleteStudent
}