const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const User = require("./models/users");  
const Cars = require('./models/cars');
const Location = require('./models/location');

const rateLimitMiddleware = require('./Middleware/limiter.js');

const authcontroller = require('./controllers/authcontroller');
const authJwt = require("./Middleware/authJwt.js");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée : ', err));



// Routes

//Get

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/allCars', async (req, res) => {
    try {
        const allCars = await Cars.find();
        res.status(200).json(allCars);
      } catch (err) {
        res.status(500).send("Erreur lors de la récupération des voitures : " + err);
      }
});

app.get('/car/:id', async (req, res) => {
    try{
        const idCar = req.params.id;
        const car = await Cars.findById(idCar);
        res.status(200).json(car);
    } catch(err) {
        res.status(500).send("Erreur lors de la récupération de la voiture : " + err)
    }
})

app.get('/allUsers', [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try{
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    } catch(err){
        res.status(500).send("Erreur lors de la récupération des utilisateurs :" + err);
    }
})

app.get('/user/:id', [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try{
        const idUser = req.params.id;
        const user = await User.findById(idUser);
        res.status(200).json(user);
    } catch(err) {
        res.status(500).send("Erreur lors de la récupération de l'utilisateur :" + err)
    }
})

app.get('/allLocations', [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try{
        const allLocations = await Location.find();
        res.status(200).json(allLocations);
    } catch(err){
        res.status(500).send("Erreur lors de la récupération des locations :" + err);
    }
})

//Post

app.post('/createCars', [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try {
        const newCars = new Cars({
            photo: req.body.photo,
            description: req.body.description,
            price: req.body.price,
            nameCar: req.body.nameCar,
            IdOwner: req.body.IdOwner,
            mark: req.body.mark,
            model: req.body.model,
            fuel: req.body.fuel,
            gearBox: req.body.gearBox,
            doorsNumber: req.body.doorsNumber,
            universe: req.body.universe,
            franchise: req.body.franchise,
            city: req.body.city,
        });
        const savedCars = await newCars.save();
        res.status(201).json(savedCars);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création de la voiture : " + err);
    }
  });

  app.post('/createLocation', [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try {
        const newLocation = new Location({
            idCarLoc: req.body.idCarLoc,
            dateLoc: req.body.dateLoc,
            idUser: req.body.idUser,
        });
        const savedLocation = await newLocation.save();
        res.status(201).json(savedLocation);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création de la location : " + err);
    }
  });

//Put

app.put('/updateReservation/:id', [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try {
        const idCarLoc = req.params.id;
        const {startDate, endDate, idUser} = req.body;

        if(!idCarLoc || !startDate || !endDate || !idUser){
            return res.status(400).send("Erreur lors du changement de date : idCarLoc, startDate et endDate sont obligatoires");
        }

        const updatedDate = await Location.findOneAndUpdate(
            { idCarLoc: idCarLoc, idUser: idUser },
            { $set: {dateLoc: [startDate, endDate] } },
            { new: true }
        );
        
        if (!updatedDate) {
            return res.status(404).send('Location non trouvée.');
          }

        res.status(200).json(updatedDate);

    } catch (err) {
        res.status(500).send("Erreur lors du changement de date de location : " + err);
      }
})

//Delete

app.delete('/deleteCars', [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try {
        const {idUser, idCars} = req.body;

        if (!idUser || !idCars) {
            return res.status(400).send("Erreur lors de la suppression des voitures : idUser et idCars sont obligatoires");
        }

        const carsToDelete = await Cars.findById(idCars);
        const userStatut = await User.findById(idUser);


        if(carsToDelete.IdOwner !== idUser && !userStatut.isAdmin) {
            return res.status(403).send("Erreur lors de la suppression de la voiture : l'utilisateur n'est pas le propriétaire de la voiture");
        }

        let deleteCars;
        if(userStatut.isAdmin){
            deleteCars = await Cars.deleteOne({_id: { $in: idCars }});
        } else {
            deleteCars = await Cars.deleteOne({_id: { $in: idCars }, IdOwner: idUser});
        }

        if (!deleteCars) {
            return res.status(500).send("Erreur lors de la suppression de la voiture : impossible de supprimer la voiture");
        }

        res.status(200).json(deleteCars);
      } catch (err) {
        res.status(500).send("Erreur lors de la suppression de la voiture : " + err);
      }
})

app.delete("/deleteLocation", [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
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

app.delete("/deleteUser", [authJwt.verifyToken,authJwt.isExist, rateLimitMiddleware], async (req, res) => {
    try{
        const {idUser} = req.body;

        if(!idUser){
            return res.status(400).send("Erreur lors de la suppression de l'utilisateur : idUser est obligatoire");
        }

        const deleteUser = await User.deleteOne({_id: idUser});
        await Location.deleteMany({idUser});
        await Cars.deleteMany({IdOwner: idUser});

        if(!deleteUser){
            return res.status(500).send("Erreur lors de la suppression de l'utilisateur : impossible de supprimer l'utilisateur");
        }

        res.status(200).json(deleteUser);
    } catch(err){
        res.status(500).send("Erreur lors de la suppression de l'utilisateur :" + err)
    }
})

//Authentification

app.post("/api/auth/signup", authcontroller.signup);
app.post("/api/auth/signin", authcontroller.signin);
app.post("/api/auth/signout",authcontroller.signout);

app.listen(process.env.PORT, () => {
    console.log(`Serveur en écoute sur le port http://localhost:${process.env.PORT}`);
});