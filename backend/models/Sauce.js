const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
//const sauceValidation = require('../middleware/sauceValidation');


const sauceSchema = mongoose.Schema({           //fonction schema du package mongoose auquel on va passer un objet dictant les différents champs dont notre schema aura besoin
    userId: { type: String, required: true },            //pas besoin de mettre un champ pour l'id car automatiquement généré par Mongoose
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },          //on configure avec des objets toutes ces clés
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },  
    usersDisliked: { type: [String] },
});

sauceSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('Sauce', sauceSchema);  //exporte ce schema en tant que modele mongoose appelé "Thing", le rendant disponible a notre app Express
                                                        //methode model transforme ce modele en modele utilisable