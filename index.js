const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const User = require('./models/users');
const Cars = require('./models/cars');
const Location = require('./models/location');

dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée : ', err));


// Routes

// GET
app.get('/allCars', async (req, res) => {
    try {
        const allCars = await Cars.find();
        res.status(200).json(allCars);
      } catch (err) {
        res.status(500).send("Erreur lors de la récupération des voitures : " + err);
      }
});

app.get('/allLocations', async (req, res) => {
    try {
        const allLocation = await Location.find();
        res.status(200).json(allLocation);
      } catch (err) {
        res.status(500).send("Erreur lors de la récupération des locations : " + err);
      }
})

// POST
app.delete('/deleteCars', async (req, res) => {
    try {
        const {idUser, idCars} = req.body;

        if (!idUser || !idCars) {
            return res.status(400).send("Erreur lors de la suppression de la voiture : idUser et idCars sont obligatoires");
        }

        const carsToDelete = await Cars.findById(idCars);

        if(carsToDelete.IdOwner !== idUser) {
            return res.status(403).send("Erreur lors de la suppression de la voiture : l'utilisateur n'est pas le propriétaire des voitures");
        }

        const deleteCars = await Cars.deleteOne({_id: { $in: idCars }, IdOwner: idUser});

        if (!deleteCars) {
            return res.status(500).send("Erreur lors de la suppression de la voiture : impossible de supprimer les voitures");
        }

        res.status(200).json(deleteCars);
      } catch (err) {
        res.status(500).send("Erreur lors de la suppression de la voiture : " + err);
      }
})

app.delete("/deleteLocation", async (req, res) => {
    try{
        const {idCarLoc, dateLoc, idUser} = req.body;

        if(!idCarLoc || !dateLoc || !idUser){
            return res.status(400).send("Erreur lors de la suppression de la location : idCarLoc, dateLoc et idUser sont obligatoires");
        }

        const deleteLocation = await Location.deleteOne({idCarLoc, dateLoc, idUser});

        if(!deleteLocation){
            return res.status(500).send("Erreur lors de la suppression de la location : impossible de supprimer la location");
        }

        res.status(200).json(deleteLocation);
    } catch(err){
        res.status(500).send("Erreur lors de la suppression de la location : " + err)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Serveur en écoute sur le port http://localhost:${process.env.PORT}`);
});