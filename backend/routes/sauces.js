//routing qui sera importé dans app pour l'API / Mettre des noms logiques comme "createThing" ou "deleteThing" pour savoir rapidement la fonction implémenté a la route

const express = require('express'); //importe express pour utiliser sa methode router
const router = express.Router();    //methode permetant de créer des routers séparés pour chaque route de l'app, on y enregistre ensuite des routes individuelles
const auth = require('../middleware/auth'); //importe middleware pour le passer comme argument aux routes a protéger
const multer = require('../middleware/multer-config'); //importe la config multer et a ajouter entre middleware auth et la gestion de la route car il faut que le token soit recup avant.
const sauceCtrl = require('../controllers/sauces'); // importe le controller stuff = logique metier pour les routes




router.post('/', auth, multer, sauceCtrl.createSauce);    //appelle la fonction createSauce dans les controllers et s'applique à cette route  //mettre le middleware auth avant les gestionnaires de route pour qu'il soit appelé avant.

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.get('/'/* + ''*/, auth, sauceCtrl.getAllSauces);

router.post('/:id/like', auth, sauceCtrl.likeStatus);



module.exports = router;    //premet d'exporter le router pour l'importer (require) dans l'app 