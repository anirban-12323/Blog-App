const jwt=require("jsonwebtoken")
 async function generateJWT(payload){
  let token=await jwt.sign(payload,"jwtbohutjaydakhatarnakscerethei")
  return token

}

async function verifyJWT(token){
  try {
     let isValid=await jwt.verify(token,"jwtbohutjaydakhatarnakscerethei")
  return  true

    
  } catch (error) {
   return false;
    
  }

 
}
module.exports ={generateJWT,verifyJWT}