let jwt = require("jsonwebtoken");

const isAuth= async(req,res,next)=>{
    const token = req.cookies.token||req.body.token||req.header("Authentication")&&req.header("Authentication").replace("Bearer","")

    if(!token){
        return res.status(403).send("token is missing");
    }

    try {
        let decode = await jwt.verify(token,"secret")
        req.user=decode;
        console.log(decode);
    } catch (error) {
        return res.status(401).send("invalid token")

        
    }
    return next();
}

module.exports=isAuth;