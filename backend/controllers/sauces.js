//logique métier, exportedes methodes pour les attribuer aux routes / Mettre des noms logiques comme "createThing" ou "deleteThing" pour savoir rapidement la fonction implémenté a la route

const Sauce = require('../models/Sauce');   //importation model schema mongoose !!!??? PK 2 POINTS PR CHOPPER LE FICHIER C'ETAIT QUE UN QUAND CETTE CONST ETAIT DANS APP.JS
const fs = require('fs');                   //pacjage fs de node : donne acces aux fonctions qui permettent de modifier le systeme de fichiers y compris aux fonctions permetatnt de supprimer les fichiers


/* exports.createThing = (req, res, next) => {      //requetes arrivant par cette routes ont dans le corps de la requete toutes les infos pour le nouveau thing qui va etre ajouté
    delete req.body._id;                        //supr de l'id éronné envoyé par le frontend pour prendre celui génété par mongoose ensuite ?
    const thing = new Thing({                 //creation instance du modele Thing et on lui passe les infos requise du corps de requete analysé
      ...req.body                              //on a accés au corps de la requete grace a express.json dans fichier app//operateur "..." utilisé pour copier tt les elms de req.body
    });
    thing.save()                                                               //enrigistre mon Thing dans la BdD, renvoies une promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !' })) //si on ne renvoie pas de reponse, la requete va planté coté user, (pour creation de ressource, code 201) 
    .catch((error) =>res.status(400).json({ error })); 
  };  */


  exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        //userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
    .then(() =>  res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error =>  res.status(400).json({ error }));
 };

    

 exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      // On supprime l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      // On modifie les données et on ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
    // Si la modification ne contient pas de nouvelle image
    sauceObject = {
      ...req.body
    }
  )
  Sauce.updateOne(
      // On applique les paramètre de sauceObject
      {
        _id: req.params.id
      }, {
        ...sauceObject,
        _id: req.params.id
      }
    )
    .then(() => res.status(200).json({
      message: 'Sauce modifiée !'
    }))
    .catch((error) => res.status(400).json({
      error
    }))
}




// Permet de supprimer la sauce

exports.deleteSauce = (req, res, next) => {
// Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
Sauce.findOne({
    _id: req.params.id
  })
  .then(sauce => {
    // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
    const filename = sauce.imageUrl.split('/images/')[1];
    // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
    fs.unlink(`images/${filename}`, () => {
      // On supprime le document correspondant de la base de données
      Sauce.deleteOne({
          _id: req.params.id
        })
        .then(() => res.status(200).json({
          message: 'Sauce supprimée !'
        }))
        .catch(error => res.status(400).json({
          error
        }));
    });
  })
  .catch(error => res.status(500).json({
    error
  }));
};


  
 exports.getOneSauce = (req, res, next) => {     //afficher un seul sauce, segment dynamique car front envoie l'id de l'objet, pour le chopper dans la route utilisé on utilise ":id" qui dis a express que route dynamique 
    Sauce.findOne({                           //et j'y aurais accés ici car param de route dynamique, model mongoose utilisé pour interagir avec BdD. On passe au findOne un objet pour que l'id soit le meme que dans les params de requete
      _id: req.params.id
    })                                  // on retourne la reponse 200 avec thing dedans si il existe
    .then(sauce => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
  };     
        
          
       


 exports.getAllSauces = (req, res, next) => {     //GET requete envoyé au serveur et demandant une reponse, renvoyer tous les sauces
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))            //methode find() dans model mongoose pour renvoyer tableau avec tt les sauces dans la BdD
    .catch(error => res.status(400).json({ error }));   
  };            //code 200 = requete reussi, on recup le tableau des sauce renvoyé par la base et on renvoies un code 200 (=requete reussi) avec le tableau au user
      
    
  


// Permet de "liker"ou "dislaker" une sauce

exports.likeStatus = (req, res, next) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like
  // On prend le userID
  let userId = req.body.userId
  // On prend l'id de la sauce
  let sauceId = req.params.id

  if (like === 1) { // Si il s'agit d'un like
    Sauce.updateOne({
        _id: sauceId
      }, {
        // On push l'utilisateur et on incrémente le compteur de 1
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        }, // On incrémente de 1
      })
      .then(() => res.status(200).json({
        message: 'j\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === -1) {
    Sauce.updateOne( // S'il s'agit d'un dislike
        {
          _id: sauceId
        }, {
          $push: {
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          }, // On incrémente de 1
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
}




  

  

