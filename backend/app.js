
const express = require('express');
const app = express(); //appelle la methode express, créé une app express
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
require('dotenv').config();

const mongoose = require('mongoose'); 

mongoose.connect(process.env.DB_URI,   //connecter la base de donnée mongoDB ,utilisation dotenv
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');   //importation pr acceder au path de notre serveur => images


  
app.use((req, res, next) => {       //cors(interaction navig/serveur), pas de route/adresse indiqué en premier param pour que le middleware s'applique a toutes les routes
    res.setHeader('Access-Control-Allow-Origin', '*'); //autorise accés à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //permet d'envoyer des requêtes avec les méthodes mentionnées
    next();
});


app.use(express.json()); //reconnaitre requetes objets arrivantes comme objets json. intercepte toute requete contenant du json et nous mette a dispo ce contenu sur l'objet requete dans req.body / methode body.parser existe aussi

app.use(mongoSanitize()); // securité, a expliquer

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // A EXPLIQUER



app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app; //exporte l'app pour qu'on puisse y accéder depuis les autres fichiers, notament serveur 