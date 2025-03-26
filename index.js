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

app.get('/allCars', async (req, res) => {
    try {
        const allCars = await Cars.find();
        res.status(200).json(allCars);
      } catch (err) {
        res.status(500).send("Erreur lors de la récupération des voitures : " + err);
      }
});

app.delete('/deleteCars', async (req, res) => {
    try {
        const {idUser, idCars} = req.body;

        if (!idUser || !idCars) {
            return res.status(400).send("Erreur lors de la suppression des voitures : idUser et idCars sont obligatoires");
        }

        const carsToDelete = await Cars.findById(idCars);
        console.log(idCars)
        console.log(carsToDelete)
        console.log(carsToDelete.IdOwner)
        console.log("-----")

        if(carsToDelete.IdOwner !== idUser) {
            console.log(idUser)
            console.log(carsToDelete.IdOwner)
            return res.status(403).send("Erreur lors de la suppression des voitures : l'utilisateur n'est pas le propriétaire des voitures");
        }

        const deleteCars = await Cars.deleteMany({_id: { $in: idCars }, IdOwner: idUser});

        if (!deleteCars) {
            return res.status(500).send("Erreur lors de la suppression des voitures : impossible de supprimer les voitures");
        }

        res.status(200).json(deleteCars);
      } catch (err) {
        res.status(500).send("Erreur lors de la suppression des voitures : " + err);
      }
})

app.listen(process.env.PORT, () => {
    console.log(`Serveur en écoute sur le port http://localhost:${process.env.PORT}`);
});