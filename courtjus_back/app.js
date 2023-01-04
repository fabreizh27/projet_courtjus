import express from "express";
const app = express();
import { UsersList, ArticlesList } from "./data/structure.js";
import cors from "cors";
import bcrypt from 'bcrypt';

import { SITE_COURTJUS } from './src/constants/sources.js';


app.use(cors({ origin: false }));
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
  UsersList.find({uMail:postId},(err, user) => {
    if(err) return console.error(err)
    res.json(user);
  })
});

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


const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));