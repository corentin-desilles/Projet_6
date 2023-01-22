//multer, un package de gestion de fichiers entrants dans les requêtes HTTP.
//implémenter des téléchargements de fichiers (ici pour que les utilisateurs puissent télécharger des images d'articles à vendre)

const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({        //config chemin et nom de fichier pr les fichiers entrants  //passer la const à multer(voir derniere ligne) comme config pour lui indiquer où enregistrer ces fichiers entrants
  destination: (req, file, callback) => {   //fonction destination :
    callback(null, 'images');               //indique à multer d'enregistrer les fichiers dans le dossier "images" 
  },
  filename: (req, file, callback) => {                      //fonction filename :
    const name = file.originalname.split(' ').join('_');    //indique à multer de use nom d'origine, remplacer espaces par "_" ajouter timestamp "Date.now()" comme nom de fichier
    const extension = MIME_TYPES[file.mimetype];            //utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
    //name = name.replace("." + extension, "_"); //!!!AJOUT
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); //???? pk storage : storage
//exporte l'élément multer configuré, lui passe constante storage et lui indique qu'on gérera uniquement les download de fichiers image.
//methode single de multer créé middleware qui capture les fichiers d'un certain type (passé en argument) et les enregistre au systeme de fichiers du serveur à l'aide du storage configuré.