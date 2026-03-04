const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({

 payout_id:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Payout"
 },

 action:String,

 performed_by:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 }

},{
 timestamps:true
});

module.exports = mongoose.model("PayoutAudit",auditSchema);