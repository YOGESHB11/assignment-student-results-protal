const jwt = require("jsonwebtoken")

const authentication = async function(req,res,next){
  try{
      let bearerToken = req.headers["authorization"]
    if(typeof bearerToken == "undefined"){
        return  res.status(400).send({status:false, message:"bearer token is missing"}) 
    }
    bearerToken=bearerToken.split(" ")[1]
    const decode = jwt.verify(
        bearerToken,
        "secret-key",
        function(err,result){
            if(err) return res.status(401).send({status : false , message : err})
            else{
                req.userId = result.userId
                next()
            }
        }
    )
    console.log(req.userId)
}catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}
module.exports={
    authentication
}

