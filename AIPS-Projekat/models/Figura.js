const mongoose = require('mongoose');

const FiguraSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    color:
    {
        type: String,
        required: true
    },
    slika:
    {
     type:String,
     required:false
    },
    pozicijaNaTabli:
    {
        type:String,
        required:false// kada je neka figura "pojedena" znaci nije na tabli
    }
    
});

const Figura = mongoose.model('Figura', FiguraSchema);

module.exports = Figura;