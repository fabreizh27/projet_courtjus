import express from "express";
const app = express();
import { UsersList, ArticlesList, PagesList, PagesElementsList } from "./data/structure.js";
import cors from "cors";
import bcrypt from 'bcrypt';

import { SITE_COURTJUS } from './src/constants/sources.js';


app.use(cors({ origin: true }));
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  console.log("infos page home");
  res.json(["Aucune donnée à la racine du projet"]);
});
 

app.get("/users", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  console.log("liste de tous les utilisateurs");  
  UsersList.find({},(err, users) => {
    if(err) return console.error(err)
    res.json(users);
  });
});

app.get("/users/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  console.log("utilisateur " + postId);
  UsersList.findOne({uNum:postId},(err, user) => {
    if(err) return console.error(err)
    res.json(user);
  })
});

app.post("/userconnect", (req, res) => {
  console.log("reception userConnect");  

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


// app.get("/updateUsertest", (req, res) => {
//   console.log("maj d'un utilisateur");  
//   bcrypt.hash("303668721", 5, function(err, hash){
//     UsersList.findOneAndUpdate({uNum:18}, {"uPass":hash}, () => {
//       res.json(hash);
//     })
//   })
// })


app.get("/articles", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  console.log("liste de tous les articles");  
  ArticlesList.find({},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  });
});

app.get("/articles/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  console.log("liste des articles du producteur " + postId);
  ArticlesList.find({aNumProducteur:postId},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  })
});


app.get("/articlesenventes", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  console.log("liste de tous les articles en ventes");  
  ArticlesList.find({aEnVente:true},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  });
});

app.get("/articlesenventes/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  console.log("liste des articles en vente du producteur " + postId);
  ArticlesList.find({aNumProducteur:postId, aEnVente:true},(err, articles) => {
    if(err) return console.error(err)
    res.json(articles);
  })
});

app.get("/travel", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  console.log("page Principale");  
  PagesList.find({pnum:1},(err, page) => {
    if(err) return console.error(err)
    res.json(page);
  });
});

app.get("/travel/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  console.log("Page " + postId);
  PagesList.find({pNum:postId},(err, page) => {
    if(err) return console.error(err)
    res.json(page);
  })
});

app.get("/travelelements/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  console.log("Page " + postId);
  PagesElementsList.find({ePage:postId},(err, pageElements) => {
    if(err) return console.error(err)
    res.json(pageElements);
  })
});

app.get("/producteurs", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  console.log("liste de tous les producteurs");  
  UsersList.find({uProducteur:true, uActif:true},(err, users) => {
    if(err) return console.error(err)
    res.json(users);
  }).sort([['uStructure', 1]]);
});

app.get("/producteurs/:postId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", SITE_COURTJUS);
  const { postId } = req.params;
  // const rech = new RegExp(postId)
  const rech = postId
  console.log("liste des producteurs " + rech);  
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
  console.log("utilisateur " + postId);
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));