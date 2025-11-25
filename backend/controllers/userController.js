const User = require("../models/userSchema")
const bcrypt=require("bcrypt")
const {generateJWT} = require("../utils/generateToken")

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

    const hashPass= await bcrypt.hash(password,12)
  

  const newUser=await User.create({
    name,
    email,
    password: hashPass
  })
  const newUserObj=newUser.toObject()
  delete newUserObj.password


  let token=await generateJWT({
    email:newUserObj.email,
    id:newUserObj._id.toString()
  })
    return res.status(200).json({
      success:true,
      message:"User created successfully",
      user:newUserObj,
      token

    })
    
  } catch (error) {

    return res.status(400).json({
      success:false,
      message:"Please try again",
      error:error.message

    })
    
  }

}

async function login(req,res){
   const{email,password}=req.body
  try {
   
    
    
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
    if(!chekedforexitingUser){
      return res.status(400).json({
        success:false,
        message:"User not exists"
      })
    }

    let checkForPass=await bcrypt.compare(password,chekedforexitingUser.password)

    if(!checkForPass){
      return res.status(400).json({
        success:false,
        message:"Incorrect Password"
      })
    }


     
  
     let token=await generateJWT({
    email:chekedforexitingUser.email,
    id:chekedforexitingUser._id.toString()
  })

 
    return res.status(200).json({
      success:true,
      message:"logged in successfully",
      user:chekedforexitingUser,
      token

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
module.exports={createUser,getUser,getUserBYID,updateUser,deleteUserByID,login}
