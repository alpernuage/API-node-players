const express = require('express'); //Import du module servant à construire l'application web
const cors = require('cors'); //Import du module servant à gérer l'accès à l'API par des clients
const mongoose = require('mongoose'); //Import du module servant à établir une connection avec la base de données MongoDB
//Connexion avec la base de données :
mongoose.connect("mongodb+srv://userMongo:userMongo@cluster0-3zjdp.mongodb.net/basket_db?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); //Création d'une connexion avec la BDD MongoDB
const db = mongoose.connection; //Récupération dans une variable d'un objet correspondant à la connection
db.on('error', console.error.bind(console, 'connection error:')); //Affichage en console d'un message d'erreur si la connection a échoué
db.once('open', function () {
    console.log("API Connected to database"); //Affichage en console d'un message de succès si la connection a réussi
});
const corsOptions = {
    origin: '*'
}
const app = express(); //Initialisation du module Express.js
app.use(cors(corsOptions));
app.listen(3000); //On lance l'écoute de l'API sur le port 3000

// Récupération de la classe Schema de mongoose
const Schema = mongoose.Schema;

// Création du schéma correspondant aux documents contenus dans la collection "players”
const PlayerSchema = new Schema({
    team: String,
    jerseyNumber: Number,
    previousTeams: String,
    age: Number,
    birthPlace: String,
    country: String,
});

// Création du modèle permettant de communiquer avec la collection "players"
const Player = mongoose.model('players', PlayerSchema);

//On traite le cas des requêtes HTTP avec la méthode GET sur la route http://localhost:3000/players
app.get('/players', function (req, res) {
    Player.find(function (err, documents) {
        //On retourne une erreur s’il y a eu un problème lors de l’opération
        if (err) {
            res.statusMessage = "Error with database during request";
            return res.status(500).end(); //En cas d'erreur lors de requête sur la BDD, on répond avec une erreur 500
        }
        //On retourne les documents correspondants à la requête en BDD
        return res.send(documents);
    });
});

app.get('/players/:id', function (req, res) {
    let id = req.params.id;

    Player.findById(id, function (err, documents) {

        if (!documents) {
            res.statusMessage = "Player not found";
            return res.status(404).end();
        }

        //On retourne une erreur s’il y a eu un problème lors de l’opération
        if (err) {
            res.statusMessage = "Error with database during request";
            return res.status(500).end(); //En cas d'erreur lors de requête sur la BDD, on répond avec une erreur 500
        }

        //On retourne les documents correspondants à la requête en BDD
        return res.send(documents);
    });
});