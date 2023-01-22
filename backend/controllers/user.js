//logique métier, exportedes methodes pour les attribuer aux routes / Mettre des noms logiques comme "createThing" ou "deleteThing" pour savoir rapidement la fonction implémenté a la route

const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); //importe methode token, permet de se co une seule fois a leur compte, au moment de se co, recoit un token et le renverront automatiquement a chaque requete par la suite. Back end peu verifier que la requete est authentifié



exports.signup = (req, res, next) => {                  //fonction signup
    bcrypt.hash(req.body.password, 10)                  //crypte le mdp
        .then(hash => {
            const user = new User({                     //créé un nouveau User (model mongoose) avec ce mdp crypté et l'adresse mail passée dans le corps de la requete
                email : req.body.email,
                password: hash
            });
            user.save()                                 //enregistre cet utilisateur dans la BdD
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};



exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })     //model mongoose pour verifier que email entré correspond a user existant dans BdD
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)    //fonction bcrypt compare mdp entré par user avec le hash enregistré dans la BdD
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({      //si tout correspond, renvoie res 200 contenant ID du user et un token au frontend
                        userId: user._id,
                        token: jwt.sign(            //fonction sign de jsonwebtoken pour chiffrer un nouveau token.
                            { userId: user._id },   //Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
                            'RANDOM_TOKEN_SECRET',  //chaine secrete de developpement pr crypter token (remplacer par chaine aleatoire longue). sert de clé pour le dechiffrement du token donc doit etre difficle a devnier.
                            { expiresIn: '24h'}     //valide 24h, apres user doit se reco
                        )         
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };