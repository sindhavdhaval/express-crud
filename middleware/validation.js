const { Validator } = require('node-input-validator');

module.exports = function (Validation){
    return async function (req, res, next) {
        try{
            const validationObj={}

            if(Validation == "user validation")
                Validation = userValidation(req.user.type)   
            
            if(Validation == "Inventory update")
                Validation = inventoryUpdateValidation(req.user.type)

            for (const key of Validation) {
                validationObj[key] = "required";
            }
            
            const v = new Validator(req.body,validationObj);
            const matched = await v.check();

            if (!matched) {
                return res.status(400).json({succeess:false, message:"Validation error.",statusCode:400,data:v.errors});
            }

            next()
        }catch(err)
        {
            console.log("-----Validations Middleware err ----",err)
            return res.status(401).json({succeess:false, data:[], message: 'Please check Validation code',statusCode:400});
        }
    }
}

function userValidation(userType){
    if(userType == 'customer')
    {
        return ["companyName","companyAddress","shippingMethod","termsCode","taxExemptStatus","Status"]
    }
    return [] 
}

function inventoryUpdateValidation(userType){
    let a = [
        "EPA","LotCodingMethodology","Formulation","ChemicalType","WorstSignalWord","VentilationRequirements","InhalationHazard",
        "EyeHazard","SkinHazard","BatcherPPE","FillerPPE","DownstreamPPE","SpillControlMethod",
        "DOTHazmat","UN","Class","Group","ExplosiveClass","MeltingPoint","FlashPoint","Foaming",
        "FreezePoint","AcceptableContamination","Cleanoutmethod","EstimatedWasteGenerated","AIrange",
        "SGrange","PHrange","Appearance","Odor","Fillsize","FillTolerance","CampaignSize","AnnualVolume",
        "Ancillarylinework","Ancillarypalletwork","NONSTANDARDQC","CapTorque","HeatSealing","QtyPackage",
        "QtyCase","CasesPallet","PalletsTruck","PalletWrapSettings","PalletLabeling","Stackable","PalletStraps","inventoryId"
    ]
    
    if(userType == 'customer')
    {
        return a
    }
    a.push("Line") 
    return a
}