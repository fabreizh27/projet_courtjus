import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { NavLink } from "react-router-dom";
import { USER_INIT, ARTICLE_INIT,BIASSE_INIT, CDE_INIT } from '../constants/globals';
import { updateCdesLignes } from '../actions/actions-types';


const LesCommandes = (props) =>{
    const {userCJ, userMenu} = useSelector(state => state);
    const dispatch = useDispatch()
    const [biasse, setBiasse] = useState([]);
    const [producteurs, setProducteurs] = useState([]);
    const [adherents, setadherents] = useState([]);
    const [cdesLignes, setCdesLignes] = useState([]);
    const [filtre, setFiltre] = useState({
        filtreBiasse:0,          // la biasse de reference (si 0 : celle active)
        filtreOrdre:0,           // 0 : par adherents ou 1 : par articles
        filtreStyle:0,           // 0 : en mode liste ou 1 : en mode tableau
        filtreMonoAdherent:0,    // 0 : tous les utilisateurs ou le num de l'utilisateur filtré
        filtreMonoProducteur:0,  // 0 : tous les producteurs ou le num du producteur filtré
        filtreTxtAdherents:"",   // filtre sur le nom prenom de l'adherents
        filtreTxtProducteur:"",  // filtre sur le nom, prenom, nom de l'entreprise et mots clés du producteur
        filtreTxtArticle:""      // filtre sur les infos de l'article commandé
    });

    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/biasseactive`)
          .then(response => response.json())
          .then(res => {
            if (res===null) {
                const newBiasse=BIASSE_INIT;
                newBiasse.cmdOpen=false
                setBiasse(newBiasse);
            } else {
                const dateNow=new Date();
                const dateB = new Date(res.bDate.substring(0,10));
                const dateBCI = new Date(res.bDateCdeIni.substring(0,10));
                const dateBCE = new Date(res.bDateCdeEnd.substring(0,10));
                if (dateBCI<=dateNow && dateBCE>=dateNow) {res.cmdOpen=true} else {res.cmdOpen=false};
                res.bDate=dateB.toLocaleDateString();
                res.bDateCdeIni=dateBCI.toLocaleDateString();
                res.bDateCdeEnd=dateBCE.toLocaleDateString();
                setBiasse(res);
                fetch(`${URL_COURTJUS_BACK}/cdeslignes/${userCJ.uNum}_${res.bNum}`)
                .then(response => response.json())
                .then(resC => {
                    setCdesLignes(resC);
                });
                fetch(`${URL_COURTJUS_BACK}/producteurs`)
                .then(response => response.json())
                .then(resP => {
                  const producteurs=[]
                  const participants=res.bParticipants
                  resP.forEach(unit => {
                    const found = participants.find(element => element === unit.uNum);
                    if (found) {
                        producteurs.push(unit)
                    }
                  });
                  setProducteurs(producteurs);
                });
      
            }
          });
    }, []);
  

    useEffect(() => {
        const articles=[];
        articles.push(ARTICLE_INIT);
        setArticles(articles);
    }, []);

    useEffect(() => {
        setFiche(false);
    }, []);

    useEffect(() => {
        setSelectedProduct(USER_INIT);
    }, []);

  
    const handleChange = (event) => {
    event.preventDefault();
    const {value} = event.target;
    setFiltre(value);
    fetch(`${URL_COURTJUS_BACK}/producteurs/${value}`)
        .then(response => response.json())
        .then(resP => {
            const producteurs=[]
            const participants=biasse.bParticipants
            resP.forEach(unit => {
              const found = participants.find(element => element === unit.uNum);
              if (found) {
                  producteurs.push(unit)
              }
            });
            setProducteurs(producteurs);
        });
    };
  
    function findIndex(idStr){
        const idArray = idStr.split('_');
        return Number(idArray[1]);
    };

    const handleChangeArticle = (event) => {
        event.preventDefault();
        const {id, name, value} = event.target;
        const articlesChange=[...articles];
        articlesChange[findIndex(id)][name]=value;
        articlesChange[findIndex(id)].aMsg="";
        setArticles(articlesChange);       
    };
    
    let secuUpdate = true;
    if ((userCJ.uNum>0 && biasse.cmdOpen)) {secuUpdate=false};

    const handleView = (event) => {
        const {name} = event.target;
        
        fetch(`${URL_COURTJUS_BACK}/users/${name}`)
        .then(response => response.json())
        .then(res => {
            if (res===null) {
                setSelectedProduct(USER_INIT);
            } else {
                setSelectedProduct(res);
            }
            fetch(`${URL_COURTJUS_BACK}/articlesenventes/${res.uNum}`)
            .then(response => response.json())
            .then(resA => {
                resA.forEach(article => {
                    const found = cdesLignes.find(element => element.cArticle === article.aNum);
                    if (found) {
                        article.cid=found._id
                        article.cBiasse=found.cBiasse
                        article.cProducteur=found.cProducteur
                        article.cUser=found.cUser
                        article.cArticle=found.cArticle
                        article.cNombre=found.cNombre
                        article.cCommentaire=found.cCommentaire
                        article.CArticleLib=found.CArticleLib
                    } else {
                        article.cid={}
                        article.cBiasse=biasse.bNum
                        article.cProducteur=selectedProduct.uNum
                        article.cUser=userCJ.uNum
                        article.cArticle=article.aNum
                        article.cNombre=0
                        article.cCommentaire=""
                        article.CArticleLib=""
                    }
    
                });
                setArticles(resA);
            });
          });
        setFiche(true);
        };
    
    const handleHide = (event) => {
        setFiche(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const {id} = event.target;
        const actArticle =articles[findIndex(id)]
        let errMsg="";
        if (isNaN(actArticle.cNombre)) {
            errMsg="le nombre n'est pas valide";
        };
        if (errMsg) {
            const articlesChange=[...articles];
            articlesChange[findIndex(id)].aMsg=errMsg;
            setArticles(articlesChange); 
        };
        if (errMsg) {
            // enregistrement impossible
            console.log("stop");
        } else {
            // Ajout modification d'une ligne de commande
            dispatch(updateCdesLignes({actArticle}))
            errMsg="Pré-commande actualisée !"
            const articlesChange=[...articles];
            articlesChange[findIndex(id)].aMsg=errMsg;
            setArticles(articlesChange);
        }
    };

    
    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}
            <section className="nav-admin">
				<form method="POST" id="formFiltre" className='form-filtre'>
                    <label htmlFor="filtre"><img src="img/search.png" alt="Rechercher" /></label>
					<input type="text" name="filtre" id="filtre" value={filtre} onChange={handleChange} /> 
				</form>	
            </section>
            <section className='main-title'><p>Commandez pour le {biasse.bDate} - {biasse.bLibelle} {biasse.cmdOpen}<span className="section-prods-err">{!biasse.cmdOpen && ` ( Commandes fermées ) `}</span>
             <span className="p-impact">{` commandes entre le ${biasse.bDateCdeIni} et le ${biasse.bDateCdeEnd}`}</span> </p>
            </section>
            { userCJ.uNum<1 && <section className="section-prods-err"><p>Veuillez vous authentifier !</p></section> }
            <div className="main-down"></div>

        </main>

    )
}

export default LesCommandes;