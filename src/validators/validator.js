const mongoose = require("mongoose")

const isValidPassword = function (value) {
    if (
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(value)
    )
      return true;
    return false;
  };

  const isValidEmail = function (value) {
    if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value)) return true;
    return false;
  };

  function isValid(data){
    if(typeof data == undefined || data == null) return false
    if(typeof data == "string" && data.trim().length==0) return false
    return true
}

function isLetters(data){
    if(typeof data=="string" && data.trim().length!==0 && (/^[a-z A-Z]+$/.test(data))) return true
    return false
}

const isValidSubject = function (title) {
    return ["maths","computers", "physics", "chemistry","english"].includes(title);
  };

  function isValidObjectId (data){
    return mongoose.Types.ObjectId.isValid(data)
}
  module.exports = { 
    isValidEmail,
    isValidPassword,
    isValid,
    isValidSubject,
    isLetters,
    isValidObjectId
}