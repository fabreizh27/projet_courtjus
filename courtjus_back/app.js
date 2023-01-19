import express from "express";
const app = express();
import { UsersList, ArticlesList, PagesList, PagesElementsList, BiassesList } from "./data/structure.js";
import cors from "cors";
import bcrypt from 'bcrypt';

import { SITE_COURTJUS } from './src/constants/sources.js';


app.use(cors({ origin: true }));
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("infos page home");
  res.json(["Aucune donnée à la racine du projet"]);
});
 
// -------------------------------------------
// ------   GESTION DES UTILISATEURS   -------
// -------------------------------------------

app.get("/users", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("liste de tous les utilisateurs");  
  UsersList.find({},(err, users) => {
    if(err) return console.error(err)
    res.json(users);
  }).sort([['uNom', 1],['uPrenom', 1]]);
});

app.get("/users/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("utilisateur " + postId);
  UsersList.findOne({uNum:postId},(err, user) => {
    if(err) return console.error(err)
    res.json(user);
  })
});

app.get("/usersfiltre/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  const rech = postId
  // console.log("liste des utilisateurs " + rech);  
  UsersList.find({
    $or : [
      {"uStructure":{ $regex :rech,$options:"i"}},
      {"uProduction":{ $regex :rech,$options:"i"}},
      {"uNom":{ $regex :rech,$options:"i"}},
      {"uPrenom":{ $regex :rech,$options:"i"}}
    ]
  },(err, users) => {
    if(err) return console.error(err)
    res.json(users);
  }).sort([['uNom', 1],['uPrenom', 1]]);
});

app.get("/userverifexist/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("verif mail existe : " + postId);
  const result0 = [{"_id":{"uNum":0},"nb":0}]
  UsersList.aggregate([
            { $match : {uMail:postId}} 
          , { $group: { _id: { uNum : "$uNum"}, nb: { $count : {}} }}
          , { $project : {"_id.uNum":1, nb:1 }}  
      ],(err, user) => {
    if(err) return console.error(err)
    user.length<1 ? res.json(result0) : res.json(user);
  })
});

app.get("/usernumlast", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("dernier numero");  
  const result0 =[{"uNum":0}]
  UsersList.find({}, { uNum: 1, _id: 0},(err, user) => {
    if(err) return console.error(err)
    user.length<1 ? res.json(result0) : res.json(user);
  }).sort([['uNum', -1]]).limit(1);
});



app.post("/userconnect", (req, res) => {
  // console.log("reception userConnect");  
  let retour = null
  let userPassWord = ""
  UsersList.find({uMail:req.body.email},(err, user) => {
      if(err) return console.error(err)
      user.length>0 ? userPassWord=user[0].uPass : userPassWord=""
      bcrypt.compare(req.body.mdp, userPassWord, function(err, result){
          if (result) {
            const ladate=new Date()
            retour = user
            UsersList.findOneAndUpdate({email:req.body.email}, {"uDateLastConnect":ladate}, () => {
         })
         }
         res.json(retour); 
      })
    })
});

app.post("/insertUser", (req, res) => {
  // console.log("creation d'un utilisateur");  
  const userFiche=req.body
  UsersList.find({}, { uNum: 1, _id: 0},(err, user) => {
    if(err) return console.error(err)
    let lastNum =0
    user.length<1 ? lastNum =0 : lastNum =user[0].uNum;
    bcrypt.hash(userFiche.uPass, 5, function(err, hash){
      const ladate=new Date;
      let newUser = new UsersList(
            {
              "uNum": lastNum+1,
              "uNom": userFiche.uNom,
              "uPrenom": userFiche.uPrenom,
              "uMail": userFiche.uMail,
              "uMailPro": userFiche.uMailPro,
              "uPass": hash,
              "uTel": userFiche.uTel,
              "uInfosComp": userFiche.uInfosComp,
              "uStructure": userFiche.uStructure,
              "uProduction": userFiche.uProduction,
              "uVente": userFiche.uVente,
              "uAdr_L1": userFiche.uAdr_L1,
              "uAdr_L2": userFiche.uAdr_L2,
              "uAdr_L3": userFiche.uAdr_L3,
              "uAdr_CP": userFiche.uAdr_CP,
              "uAdr_Ville": userFiche.uAdr_Ville,
              "uReferents": userFiche.uReferents,
              "uPhotoProfil": "profil.png",
              "uPhotos": "",
              "uActif": userFiche.uActif,
              "uAdherent": userFiche.uAdherent,
              "uCommission": userFiche.uCommission,
              "uProducteur": userFiche.uProducteur,
              "uAdmin": userFiche.uAdmin,
              "uDateCreat": new Date()
            }
          )
      newUser.save();
    })
  }).sort([['uNum', -1]]).limit(1)
})

app.post("/updateUser", (req, res) => {
  // console.log("modification d'un utilisateur");  
  const userFiche=req.body
  bcrypt.hash(userFiche.pass, 5, function(err, hash){
    UsersList.findOneAndUpdate({uNum:userFiche.uNum}, {
      "uNom": userFiche.uNom,
      "uPrenom": userFiche.uPrenom,
      "uMail": userFiche.uMail,
      "uMailPro": userFiche.uMailPro,
      "uPass": hash,
      "uTel": userFiche.uTel,
      "uInfosComp": userFiche.uInfosComp,
      "uStructure": userFiche.uStructure,
      "uProduction": userFiche.uProduction,
      "uVente": userFiche.uVente,
      "uAdr_L1": userFiche.uAdr_L1,
      "uAdr_L2": userFiche.uAdr_L2,
      "uAdr_L3": userFiche.uAdr_L3,
      "uAdr_CP": userFiche.uAdr_CP,
      "uAdr_Ville": userFiche.uAdr_Ville,
      "uReferents": userFiche.uReferents,
      "uPhotoProfil": "profil.png",
      "uPhotos": "",
      "uActif": userFiche.uActif,
      "uAdherent": userFiche.uAdherent,
      "uCommission": userFiche.uCommission,
      "uProducteur": userFiche.uProducteur,
      "uAdmin": userFiche.uAdmin
    }, (err, userM) => {
      if(err) return console.error(err)
    })
  })
});


app.get("/producteurs", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("liste de tous les producteurs");  
  UsersList.find({uProducteur:true, uActif:true},(err, users) => {
    if(err) return console.error(err)
    res.json(users);
  }).sort([['uStructure', 1]]);
});

app.get("/producteurs/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  const rech = postId
  // console.log("liste des producteurs " + rech);  
  UsersList.find({
    uProducteur:true, 
    uActif:true,
    $or : [
      {"uStructure":{ $regex :rech,$options:"i"}},
      {"uProduction":{ $regex :rech,$options:"i"}},
      {"uNom":{ $regex :rech,$options:"i"}},
      {"uPrenom":{ $regex :rech,$options:"i"}}
    ]
  },(err, users) => {
    if(err) return console.error(err)
    res.json(users);
  }).sort([['uStructure', 1]]);
});


app.get("/producteur/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("utilisateur " + postId);
  UsersList.findOne({
    uProducteur:true, uActif:true,
    $or : [
      {uMail:postId},
      {uNum:postId},
    ]
  },(err, user) => {
    if(err) return console.error(err)
    res.json(user);
  })
});

// -------------------------------------------
// ------   GESTION DES ARTICLES   -------
// -------------------------------------------

app.get("/articles", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("liste de tous les articles");  
  ArticlesList.find({},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  });
});

app.get("/articles/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("liste des articles du producteur " + postId);
  ArticlesList.find({aNumProducteur:postId},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  })
});


app.get("/articlesenventes", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("liste de tous les articles en ventes");  
  ArticlesList.find({aEnVente:true},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  });
});

app.get("/articlesenventes/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("liste des articles en vente du producteur " + postId);
  ArticlesList.find({aNumProducteur:postId, aEnVente:true},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  })
});

// -------------------------------------------
// ------   GESTION DES PAGES   -------
// -------------------------------------------


app.get("/travel", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("page Principale");  
  PagesList.find({pnum:1},(err, page) => {
    if(err) return console.error(err)
    res.json(page);
  });
});

app.get("/travel/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("Page " + postId);
  PagesList.find({pNum:postId},(err, page) => {
    if(err) return console.error(err)
    res.json(page);
  })
});

app.get("/travelelements/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("Page " + postId);
  PagesElementsList.find({ePage:postId},(err, pageElements) => {
    if(err) return console.error(err)
    res.json(pageElements);
  })
});


// -------------------------------------------
// ------   GESTION DES BIASSES / MARCHES   -------
// -------------------------------------------

app.get("/biasses", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  // console.log("liste de toutes les biasses");  
  BiassesList.find({},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  }).sort([['bDate', -1]]);
});

app.get("/biasse/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // console.log("la biasse " + postId);
  BiassesList.findOne({bNum:postId},(err, biasse) => {
    if(err) return console.error(err)
    res.json(biasse);
  })
});

app.post("/insertBiasse", (req, res) => {
  // console.log("creation d'une biasse d'un marché");  
  const biasseFiche=req.body
  BiassesList.find({}, { bNum: 1, _id: 0},(err, biasse) => {
    if(err) return console.error(err)
    let lastNum =0
    biasse.length<1 ? lastNum =0 : lastNum =biasse[0].uNum;
      let newBiasse = new BiassesList(
            {
              "bNum": lastNum+1,
              "bLibelle": biasseFiche.bLibelle,
              "bComment": biasseFiche.bComment,
              "bDate": biasseFiche.bDate,
              "bDateCdeIni": biasseFiche.bDateCdeIni,
              "bDateCdeEnd": biasseFiche.bDateCdeEnd,
              "bParticipants":biasseFiche.bParticipants
            }
          )
      newBiasse.save();
  }).sort([['bNum', -1]]).limit(1)
})

app.post("/updateBiasse", (req, res) => {
  // console.log("modification d'une biasse d'un marché");  
  const biasseFiche=req.body
    BiassesList.findOneAndUpdate({bNum:biasseFiche.bNum}, {
      "bLibelle": biasseFiche.bLibelle,
      "bComment": biasseFiche.bComment,
      "bDate": biasseFiche.bDate,
      "bDateCdeIni": biasseFiche.bDateCdeIni,
      "bDateCdeEnd": biasseFiche.bDateCdeEnd,
      "bParticipants":biasseFiche.bParticipants
    }, (err, biasseM) => {
      if(err) return console.error(err)
    })
});

app.post("/deleteBiasse", (req, res) => {
  // console.log("suppression d'une biasse d'un marché");  
  const biasseFiche=req.body
  bcrypt.hash(biasseFiche.pass, 5, function(err, hash){
    BiassesList.deleteOne({uNum:biasseFiche.uNum
    }, (err, biasseD) => {
      if(err) return console.error(err)
    })
  })
});




const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));