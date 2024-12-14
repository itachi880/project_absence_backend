const FormateurGroup = require("../../Models/FormateurGroup");
const { jwt_verify } = require("../../utils/jwt_auth")
const roles = require("../../utils/roles");
const { DaysInMonths } = require("../../utils/DaysInMonths");
const router = require("express").Router();

router.post("/assigne",async(req,res)=>{
  try{  
    const {token=false,group_id=false,sessions=false,formateur_id=false,date=false}=req.body;
    if(!token || !group_id || !sessions||!formateur_id || !date)return res.status(400).end("data incompleate");
    const [auth_error,auth_data]=await jwt_verify(token);
    if(auth_error) return res.status(401).end("token error");
    if(auth_data.role!=roles.general_supervisor) return res.status(401).end("you dont have access to this action");
   
        return res.json(await (new FormateurGroup({sessions,formateur:formateur_id ,id_group:group_id,date})).save())
    }catch(e){
        console.log(e)
        return res.status(500).end("error")
    }
})
module.exports=router;