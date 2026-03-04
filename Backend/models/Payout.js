const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({

 vendor_id:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Vendor",
  required:true
 },

 amount:{
  type:Number,
  required:true
 },

 mode:{
  type:String,
  enum:["UPI","IMPS","NEFT"]
 },

 note:String,

 status:{
  type:String,
  enum:["Draft","Submitted","Approved","Rejected"],
  default:"Draft"
 },

 decision_reason:String

},{
 timestamps:true
});

module.exports = mongoose.model("Payout",payoutSchema);