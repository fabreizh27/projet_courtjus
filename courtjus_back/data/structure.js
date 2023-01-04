import mongoose from "mongoose";
import { BASE_COURTJUS } from '../src/constants/sources.js';

mongoose.set('strictQuery', true);
mongoose.connect(BASE_COURTJUS);
mongoose.connection.on("error", () => {
    console.log("Erreur lors de la connexion à la base de données");
})
mongoose.connection.on("open", () => {
    console.log("Connexion à la base de données établie");
})

let usersSchema = mongoose.Schema({
    uNum: Number,
    uNom: String,
    uPrenom: String,
    uMail: String,
    uPass: String,
    uTel: String,
    uInfosComp: String,
    uStructure: String,
    uProduction: String,
    uAdr_CP: String,
    uAdr_Ville: String,
    uReferents: String,
    uPhotoProfil: String,
    uPhotos: [],
    uActif: Boolean,
    uAdherent: Boolean,
    uCommission: Boolean,
    uProducteur: Boolean,
    uAdmin: Boolean,
    uDateCreat: Date,
    uDateLastConnect: Date,
  });
  export let UsersList = mongoose.model("cjusers", usersSchema);
  
  let articlesSchema = mongoose.Schema({
    aNum: Number,
    aNumProducteur: Number,
    aLibelle: String,
    aMesure: String,
    aUnitNb: Number,
    aUnitPrice: Number,
    aCalculable: Boolean,
    aPrecision: String,
    aEnVente: Boolean,
    aComment: String
  });
  export let ArticlesList = mongoose.model("cjarticles", articlesSchema);

