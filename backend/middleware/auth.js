//middleware qui va vérifier les infos d'auth envoyées par le client(logiciel capable d'envoyer des requêtes HTTP à un serveur web et d'afficher les résultats).

// Si user est bien connecté, transmet les infos de co aux différentes methodes qui vont gérer les requetes.
//En prenant le token envoyé par le client, verifiant sa validité.
//permettra au différentes routes d'en exploiter les infos (tel que le userId)


const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {                                                                //tout insérer dans bloc try...catch car nombreux problèmes peuvent se produire
       const token = req.headers.authorization.split(' ')[1];           //extrait token du header Authorization de la requête entrante (console : network>stuff) contient également mot-clé 'Bearer'. Donc use fonction split pour tout récup après l'espace dans le header. Erreurs générées ici s'afficheront dans le bloc catch.
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');   //fonction verify du pâckage jwt pour décoder token. Verifie sa validité (sur une requete entrante par exemple)
       const userId = decodedToken.userId;                              //!!!!!?????extraire ID user du token et le rajoute à objet Request pr que différentes routes puissent l’exploiter.(grace au express.json ?)
       if (req.body.userId && req.body.userId !== userId) {
           throw 'userId non valide';
       } else {                                                          //tout fonctionne et notre utilisateur est authentifié. Nous passons à l'exécution à l'aide de la fonction next().
	       next();
       }
   } catch(error) {
       res.status(401).json({ error });
   }
};