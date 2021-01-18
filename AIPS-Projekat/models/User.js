const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    date:
    {
        type: Date,
        default: Date.now
    },
    slikaKorisnika:
    {
        type: String,
        required: false
    },
    lastConnection: 
    { 
        type: Date,
        default: Date.now 
    },
    figure:[{ type: Schema.Types.ObjectId, ref: 'Figura' }]
    
});

const User = mongoose.model('User', UserSchema);

module.exports = User;