import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { NavLink } from "react-router-dom";
import { USER_INIT, ARTICLE_INIT,BIASSE_INIT } from '../constants/globals';
import { updateCdesLignes } from '../actions/actions-types';


const JeCommande = (props) =>{
    const {userCJ, userMenu} = useSelector(state => state);
    const dispatch = useDispatch()
    const [producteurs, setProducteurs] = useState([]);
    const [fiche, setFiche] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [articles, setArticles] = useState([]);
    const [cdesLignes, setCdesLignes] = useState([]);
    const [filtre, setFiltre] = useState([]);
    const [biasse, setBiasse] = useState([]);

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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  

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
                        article.cProducteur=Number(name)
                        article.cUser=found.cUser
                        article.cArticle=found.cArticle
                        article.cNombre=found.cNombre
                        article.cCommentaire=found.cCommentaire
                        article.CArticleLib=found.CArticleLib
                    } else {
                        article.cid={}
                        article.cBiasse=biasse.bNum
                        article.cProducteur=Number(name)
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
        if (!errMsg) {
            // Ajout modification d'une ligne de commande
            dispatch(updateCdesLignes({actArticle}))
            errMsg="Pré-commande actualisée !"
            const articlesChange=[...articles];
            articlesChange[findIndex(id)].aMsg=errMsg;
            setArticles(articlesChange);
            setTimeout(() => {
                fetch(`${URL_COURTJUS_BACK}/cdeslignes/${userCJ.uNum}_${biasse.bNum}`)
                .then(response => response.json())
                .then(resC => {
                    setCdesLignes(resC);
                });                
            }, 2000);

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
            {producteurs.map((q, i) =>
			    <section className="section-prods section-small" key={i}>
                    <NavLink aria-label="voir les articles" title="voir les articles" onClick={handleView}><img  name={`${q.uNum}`} className="btn-articles" src="img/list.png" alt="Voir les articles" /></NavLink> 
                    <article className="section-prods-fiche">
                        <h2>{q.uStructure} <span className="span-light">({q.uNum})</span>  <span className="p-impact">{q.uProduction}</span></h2>
                        
                        <h3>{q.uPrenom} {q.uNom}</h3>
                        <p>{q.uMailPro && q.uMailPro}{q.uMailPro==="" && q.uMail} - {q.uTel}</p>
                        <div className="btn-detail">
                            
                        </div>	
                    </article>
                </section>
            )}
            {fiche && 
                <div className='zone-fiche-fixed'>
                    <article>
                    <h2><NavLink aria-label="masquer les articles" title="masquer les articles"  onClick={handleHide}><img className="btn-articles" src="img/history.png" alt="retour à la liste"/></NavLink> 
                    {selectedProduct.uStructure} <span className="span-light">({selectedProduct.uNum})</span>  <span className="p-impact">{selectedProduct.uProduction}</span></h2>
                        
                        <h3>{selectedProduct.uPrenom} {selectedProduct.uNom}</h3>
                        <p>{selectedProduct.uMailPro && selectedProduct.uMailPro}{selectedProduct.uMailPro==="" && selectedProduct.uMail} - {selectedProduct.uTel} - {selectedProduct.uAdr_CP} {selectedProduct.uAdr_Ville}</p>
                        <div className="btn-detail">
                            
                        </div>	
                    </article>
					<article className="section-prods-infos form-fiche">
                        <fieldset>
                            <legend>Produits à la vente</legend>
                            {articles.map((q, i) =>
                            <form method="POST" id={`form_${i}`} key={i} disabled={secuUpdate} onSubmit={handleSubmit}>
								<div className={`form-zone form-zone-${secuUpdate && 'disabled' }`}>
									<p className='form-fiche-info'>
                                    { q.aMsg && <section className="section-prods-err"><p>{q.aMsg}</p></section> }
                                        <span className='span-light'>({i}-{q.aNumProducteur}-{q.aNum})-{secuUpdate}-</span>
                                        {q.aLibelle}
                                        {q.aUnitNb>1 && `en lot de : ${q.aUnitNb}`} {(q.aMesure!=="Unité" && q.aMesure!=="unité") && q.aMesure}   au prix de {q.aUnitPrice} €
                                    </p>
                                    <p className='form-fiche-info'>    
                                        {q.aPrecision}
									</p>
                                    <p className='form-fiche-info'>    
                                        {q.aComment}
									</p>
                                    <p>    
                                        <label htmlFor="cNombre"> Nombre : </label> 
                                        <input className="input-small" type="number" maxLength="5" name="cNombre" id={`cNombre_${i}`} required value={q.cNombre} onChange={handleChangeArticle} disabled={secuUpdate} />
                                        <label htmlFor="cCommentaire"> Infos Comp. : </label> 
                                        <input className="input-dbl" type="text" name="cCommentaire" id={`cCommentaire_${i}`} value={q.cCommentaire} onChange={handleChangeArticle} disabled={secuUpdate} />
                                        {!secuUpdate && <button id={`sav_${i}`} disabled={secuUpdate}>Enregistrer</button> }
                                    </p>
								</div>
            				</form>
                            )}
						</fieldset>
					</article>
                </div>
            }
            <div className="main-down"></div>

        </main>

    )
}

export default JeCommande;