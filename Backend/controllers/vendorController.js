const Vendor = require("../models/Vendor");


// GET VENDORS
exports.getVendors = async (req,res)=>{

 try{

  const vendors = await Vendor.find();

  res.json(vendors);

 }catch(error){

  res.status(500).json({
   message:"Error fetching vendors"
  });

 }

};



// CREATE VENDOR
exports.createVendor = async (req,res)=>{

 try{

  const {name,upi_id,bank_account,ifsc} = req.body;

  if(!name){
   return res.status(400).json({
    message:"Vendor name is required"
   });
  }

  const vendor = await Vendor.create({
   name,
   upi_id,
   bank_account,
   ifsc
  });

  res.json(vendor);

 }catch(error){

  res.status(500).json({
   message:"Error creating vendor"
  });

 }

};