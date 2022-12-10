const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        enum: ["maths", "computers", "physics", "chemistry", "english"]
    },
    marks: {
        type: Number,
        required: true
    },
    userId: {
        type: objectId,
        ref: "user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model("student", studentSchema)