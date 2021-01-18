const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    playerName:
    {
        type: String,
        required: true
    },
    playerId:{
        type:String,
        required:true
    },
    message:
    {
        type: String,
        required: true
    }
    
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;