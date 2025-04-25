const mongoose=require("mongoose")

const noteModel=new mongoose.Schema({
    noteName:{type:String}
});
module.exports= mongoose.models.note || mongoose.model('note',noteModel);