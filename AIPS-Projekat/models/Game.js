const mongoose = require('mongoose');
    // , Schema = mongoose.Schema;
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const GameSchema = mongoose.Schema({
    // users: { type: Schema.Types.ObjectId, ref: 'User' },
    //
    white:
    {
        type: String,
        required: true
    },
    //broj crnih igraca u toku igre, u pocetku 16
    black: 
    {
        type:String,
        required: true
    },
    result:
    {
        type:String,
        required: false
        
    },
    igrac1:
    {
         type: Schema.Types.ObjectId, ref: 'User' 
        
    },
    igrac2:
    {
         type: Schema.Types.ObjectId, ref: 'User' 
       
    },
    numbersOfFigure:
    {
        type:String,
        required: true
    },
    kraj:
    {
        type:Boolean,
        required:true
    }
    
});

// mongoose.model('Game', GameSchema);

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;