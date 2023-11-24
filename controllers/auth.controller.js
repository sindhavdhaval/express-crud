const {commonsuccess,commonerror} = require("../config/comon")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userServices  = require("../services/user.services")
const { sendMail } = require("../services/sendEmail")
const { authMessage } = require("../config/message")
var randomstring = require("randomstring");
const emailSubjectContanst = require("../config/emailSubjectConstant")
const config = require("../config/config.json")
const templateUrlContant = require("../config/templateUrlConstant")
const fromEmailConstant = require("../config/fromEmailConstant")


exports.signup = async(req,res)=>{
    try{
        const { email , password } = req.body
        const user = await userServices.UserFindByemail(email)
        
        if(!user) 
          return res.status(401).json(await commonerror({},authMessage.emailnotexist,401))

        if(!bcrypt.compareSync(password, user.password)) 
          return res.status(400).json(await commonerror({},authMessage.wrongpassword,400))
        

        var token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email:user.email,
            companyId:user.companyId,
            type:user.type
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 86400, // expires in 24 hour
          }
        )

        const result = {
          token,
          id: user.id,
          name: user.name,
          email:user.email,
          companyId:user.companyId,
          type:user.type
        }

        return res.status(200).json(await commonsuccess(result,authMessage.loginsuccessfully,200))

    }catch(err){
        console.log('login err', err)
        return res.status(400).json(await commonerror(err,"Something went wrong",400));
    }
}

exports.changePassword = async(req,res)=>{
  try {
    const user = await userServices.UserFindByemail(req.user.email)

    if(!bcrypt.compareSync(req.body.oldPassword, user.password))
      return res.status(400).json(await commonerror({},authMessage.invalidPCredentials,400))

    if(bcrypt.compareSync(req.body.password, user.password))
      return res.status(400).json(await commonerror({},authMessage.oldpasswordsame,400))
    
    await userServices.updateUser(
      { password:bcrypt.hashSync(req.body.password)}, 
      { id: req.user.id }
      )

    return res.status(200).json(await commonsuccess({},authMessage.passwordsuccessfully,200))
  } catch (err) {
    console.log('changepassword err', err)
    return res.status(400).json(await commonerror(err,"Something went wrong",400));
  }
}

exports.forgotPassword = async(req,res)=>{
  try{
    const user = await userServices.UserFindByemail(req.body.email)

    if(!user)
      return res.status(401).json(await commonerror({},authMessage.emailnotexist,401))
 
    const link = (process.env.NODE_ENV) ? `${config[process.env.NODE_ENV].link}/${user.token}` : `${config.production.link}/${user.token}`
    
    await sendMail(
      req.body.email, 
      link , 
      emailSubjectContanst.forgotpasswordSubject,
      templateUrlContant.forgotPasswordPath,
      fromEmailConstant.solutionsstores
    )

    return res.status(200).json(await commonsuccess({},authMessage.mailsent,200))

  }catch(err){
    console.log('forgetPassword err', err)
    return res.status(400).json(await commonerror(err,"Something went wrong",400));
  }
}

exports.linkExpired = async(req,res)=>{
  try{
    if(!await userServices.findOneUser({ token: req.body.token}))
      return res.status(400).json(await commonerror({},authMessage.invalidForgotPassToken,400))
    
    return res.status(200).json(await commonsuccess({},authMessage.validForgotPassToken,200))
  }catch(err){
    console.log('linkExpired err', err)
    return res.status(400).json(await commonerror(err,"Something went wrong",400));
  }
}

exports.resetPassword = async(req,res)=>{
  try{
    const userPasswordUpdate = await userServices.updateUser(
      { 
        password:bcrypt.hashSync(req.body.password),
        token:randomstring.generate()
      },
      { token: req.body.token } 
    )
    
   if(userPasswordUpdate > 0)
      return res.status(200).json(await commonsuccess({},authMessage.passwordsuccessfully,200))
    
    return res.status(400).json(await commonerror({},authMessage.invalidForgotPassToken,400))
  }
  catch(err)
  {
    console.log('resetPassword err', err)
    return res.status(400).json(await commonerror(err,"Something went wrong",400));
  }
}
