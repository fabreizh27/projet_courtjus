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
    uMailPro: String,
    uPass: String,
    uTel: String,
    uInfosComp: String,
    uStructure: String,
    uProduction: String,
    uVente: String,
    uAdr_L1: String,
    uAdr_L2: String,
    uAdr_L3: String,
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

  let biassesSchema = mongoose.Schema({
    bNum: Number,
    bLibelle: String,
    bComment: String,
    bDate: Date,
    bDateCdeIni: Date,
    bDateCdeEnd: Date,
    bParticipants:[], 
    bActif:Boolean
  });
  export let BiassesList = mongoose.model("cjbiasses", biassesSchema);

  let pagesSchema = mongoose.Schema({
    pNum: Number,
    pParent: Number,
    pOrdre: Number,
    pActif: Boolean,
    pType: String,
    pNom: String,
    pTitre: String,
    pExplication: String,
    pDateCreat: Date,
    pDateMaj: Date
  });
  export let PagesList = mongoose.model("cjpages", pagesSchema);

  let pagesElementsSchema = mongoose.Schema({
    eNum: Number,
    ePage: Number,
    eOrdre: Number,
    eType: String,
    eTitre: String,
    ePhoto: String,
    eText: String
  });
  export let PagesElementsList = mongoose.model("cjpageselements", pagesElementsSchema);

  