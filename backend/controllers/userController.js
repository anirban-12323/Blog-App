const User = require("../models/userSchema")

async function  createUser(req,res){
  const{name,email,password}=req.body
  try {
   
    
    if(!name){
      return res.status(400).json({
        success:false,
        message:"Please enter name"
      })
    }
     if(!password){
      return res.status(400).json({
        success:false,
        message:"Please enter password"
      })
    }
     if(!email){
      return res.status(400).json({
        success:false,
        message:"Please enter email"
      })
    }

    const chekedforexitingUser= await User.findOne({email})
    if(chekedforexitingUser){
      return res.status(400).json({
        success:false,
        message:"User already registered with this email"
      })
    }

  const newUser=await User.create({
    name,
    email,
    password
  })
    return res.status(200).json({
      success:true,
      message:"User created successfully",
      newUser
    })
    
  } catch (error) {

    return res.status(400).json({
      success:false,
      message:"Please try again",
      error:error.message

    })
    
  }

}

async function getUser(req,res){
  try {


    const users= await User.find({})

    
    return res.status(200).json({
      success:true,
      message:"user fetch successfully",
      users
    })
    
  } catch (error) {
     return res.status(400).json({
      success:false,
      message:"error occur during user fetching"

    })
    
  }
}



async function getUserBYID(req,res){
  

  

  try {
      const id=req.params.id
    const user= await User.findById({_id:id})
 

  
    
    if(!user){
      return res.status(400).json({
      success:false,
      message:"user not found",
      
    })

    }
    return res.status(200).json({
      success:true,
      message:"user fetch successfully",
      user
    })
    
  } catch (error) {
     return res.status(400).json({
      success:false,
      message:"error occur during user fetching"

    })
    
  }

}


async function updateUser(req,res){
  
  try {
   const id=req.params.id
   const{name,password,email}=req.body

   const UpdateUser= await User.findByIdAndUpdate(id,{name,password,email},{new:true})
   
   if(!UpdateUser){
      return res.status(400).json({
      success:false,
      message:"user not found",
      
    })

    }
    return res.status(200).json({
      success:true,
      message:"user updated successfully",
     UpdateUser
    })
    
    
    
  } catch (error) {
    return res.status(400).json({
      success:false,
      error:error.message,
      message:"error during user update"

    })
    
    
  }
}

async function deleteUserByID(req,res){
 

   try {
    const id=req.params.id
   const{name,password,email}=req.body

   const deletedUser= await User.findByIdAndUpdate(id)
   
   if(!deletedUser){
      return res.status(400).json({
      success:false,
      message:"user not found",
      
    })

    }
    return res.status(200).json({
      success:true,
      message:"user deleted successfully",
     deletedUser
    })
     
    
   } catch (error) {
    return res.status(400).json({
      success:false,
      message:"Faceing error during deleting the user"
    })
    
   }
}
module.exports={createUser,getUser,getUserBYID,updateUser,deleteUserByID}
