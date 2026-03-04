const Payout = require("../models/Payout.js");
const Audit = require("../models/PayoutAudit.js");


exports.createPayout = async(req,res)=>{

 const {vendor_id,amount,mode,note} = req.body;

 if(amount <= 0){
  return res.status(400).json({message:"Amount must be greater than 0"});
 }

 const payout = await Payout.create({
  vendor_id,
  amount,
  mode,
  note
 });

 await Audit.create({
  payout_id:payout._id,
  action:"CREATED",
  performed_by:req.user.id
 });

 res.json(payout);
};


exports.getPayouts = async(req,res)=>{

 const {status,vendor} = req.query;

 let filter = {};

 if(status){
  filter.status = status;
 }

 if(vendor){
  filter.vendor_id = vendor;
 }

 const payouts = await Payout.find(filter)
  .populate("vendor_id");

 res.json(payouts);
};


// exports.getPayouts = async(req,res)=>{

//  const {status,vendor} = req.query;

//  let filter = {};

//  if(status){
//   filter.status = status;
//  }

//  if(vendor){
//   filter.vendor_id = vendor;
//  }

//  const payouts = await Payout.find(filter)
//   .populate("vendor_id");

//  res.json(payouts);
// };


exports.getPayoutById = async (req, res) => {

 const payout = await Payout.findById(req.params.id)
  .populate("vendor_id");

 if(!payout){
  return res.status(404).json({
   message: "Payout not found"
  });
 }

 const audit = await Audit.find({
  payout_id: req.params.id
 }).populate("performed_by");

 res.json({
  payout,
  audit
 });

};

exports.submitPayout = async(req,res)=>{

 const payout = await Payout.findById(req.params.id);

 if(payout.status !== "Draft"){
  return res.status(400).json({
   message:"Only Draft can be submitted"
  });
 }

 payout.status="Submitted";

 await payout.save();

 await Audit.create({
  payout_id:payout._id,
  action:"SUBMITTED",
  performed_by:req.user.id
 });

 res.json(payout);
};



// exports.submitPayout = async(req,res)=>{

//  const payout = await Payout.findById(req.params.id);

//  if(payout.status !== "Draft"){
//   return res.status(400).json({
//    message:"Only Draft can be submitted"
//   });
//  }

//  payout.status="Submitted";

//  await payout.save();

//  await Audit.create({
//   payout_id:payout._id,
//   action:"SUBMITTED",
//   performed_by:req.user.id
//  });

//  res.json(payout);
// };


exports.approvePayout = async(req,res)=>{

 const payout = await Payout.findById(req.params.id);

 if(payout.status !== "Submitted"){
  return res.status(400).json({
   message:"Only Submitted payout can be approved"
  });
 }

 payout.status="Approved";

 await payout.save();

 await Audit.create({
  payout_id:payout._id,
  action:"APPROVED",
  performed_by:req.user.id
 });

 res.json(payout);
};

exports.rejectPayout = async(req,res)=>{

 const {reason} = req.body;

 if(!reason){
  return res.status(400).json({
   message:"Rejection reason required"
  });
 }

 const payout = await Payout.findById(req.params.id);

 if(payout.status !== "Submitted"){
  return res.status(400).json({
   message:"Only Submitted payout can be rejected"
  });
 }

 payout.status="Rejected";
 payout.decision_reason = reason;

 await payout.save();

 await Audit.create({
  payout_id:payout._id,
  action:"REJECTED",
  performed_by:req.user.id
 });

 res.json(payout);
};
