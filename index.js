const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const User = require("./models/users");  
const Cars = require('./models/cars');
const Location = require('./models/location');

const authcontroller = require('./controllers/authcontroller');
const authJwt = require("./Middleware/authJwt.js");

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
            return res.status(403).send("Erreur lors de la suppression de la voiture : l'utilisateur n'est pas le propriétaire de la voiture");
        }

        const deleteCars = await Cars.deleteMany({_id: { $in: idCars }, IdOwner: idUser});

        if (!deleteCars) {
            return res.status(500).send("Erreur lors de la suppression de la voiture : impossible de supprimer la voiture");
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

app.delete("/deleteUser", async (req, res) => {
    try{
        const {idUser} = req.body;

        if(!idUser){
            return res.status(400).send("Erreur lors de la suppression de l'utilisateur : idUser est obligatoire");
        }

        const deleteUser = await User.deleteOne({_id: idUser});

        if(!deleteUser){
            return res.status(500).send("Erreur lors de la suppression de l'utilisateur : impossible de supprimer l'utilisateur");
        }

        res.status(200).json(deleteUser);
    } catch(err){
        res.status(500).send("Erreur lors de la suppression de l'utilisateur :" + err)
    }
})

app.post("/api/auth/signup", authcontroller.signup);
app.post("/api/auth/signin", authcontroller.signin);
app.post("/api/auth/signout",authcontroller.signout);

app.listen(process.env.PORT, () => {
    console.log(`Serveur en écoute sur le port http://localhost:${process.env.PORT}`);
});