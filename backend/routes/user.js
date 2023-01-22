const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const verifyMail = require('../middleware/verifyMail');

// limiter le nombre de requête que peut faire un client/ des boucles de requetes pour faire planter/ forcer des mots de passe
const raterLimit = require("express-rate-limit");
// définition de la limitation de requete
const limiter = raterLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5, // 5 requête par adresse IP toutes les 10 minutes
  });

router.post('/signup', verifyMail, verifyPassword, userCtrl.signup);   //uniquement le segment final de la route indiqué, le reste de l'adresse est déclaré dans l'app express
router.post('/login', limiter, userCtrl.login);

module.exports = router;