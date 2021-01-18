const mongoose = require('mongoose');
    // , Schema = mongoose.Schema;
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const GameSchema = mongoose.Schema({
     igraci:[ { type: Schema.Types.ObjectId, ref: 'User' }],
     porukeIgre:[ { type: Schema.Types.ObjectId, ref: 'Chat' }],
    white:
    {
        type: String,
        required: true,
        default:"16"
    },
    //broj crnih i belih figura na pocetku je 16
    black: 
    {
        type:String,
        required: true,
        default:"16"
    },
    result:
    {
        type:String,
        required: false
        
    },
    numbersOfFigure:
    {
        type:String,
        required: true,
        default:"32"
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