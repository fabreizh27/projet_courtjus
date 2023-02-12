import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { NavLink } from "react-router-dom";
import { USER_INIT, ARTICLE_INIT } from '../constants/globals';
import { insertArticle, updateArticle } from '../actions/actions-types';


const Articles = (props) =>{
    const {userCJ, userMenu} = useSelector(state => state);
    const dispatch = useDispatch();
    const [producteurs, setProducteurs] = useState([]);
    const [fiche, setFiche] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [articles, setArticles] = useState([]);
    const [filtre, setFiltre] = useState([]);

    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/producteurs`)
          .then(response => response.json())
          .then(res => {
            setProducteurs(res);
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
        .then(res => {
        setProducteurs(res);
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
    
    const handleNewArticle = (event) => {
        event.preventDefault();
        const {id} = event.target;
        const articlesChange=[...articles];
        const newArticle = ARTICLE_INIT;
        newArticle.aNumProducteur=findIndex(id);
        newArticle.aMsg="";
        articlesChange.push(newArticle);
        setArticles(articlesChange);
    };
    
    let secuUpdate = true;
    if ((selectedProduct.uNum===userCJ.uNum && userCJ.uProducteur) || userCJ.uAdmin) {secuUpdate=false};

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
            fetch(`${URL_COURTJUS_BACK}/articles/${res.uNum}`)
            .then(response => response.json())
            .then(resA => {
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
        if (actArticle.aLibelle.length<6) {
            errMsg="Le libellé de l'article est trop court (6 car) !";
        };
        if (actArticle.aMesure.length<2) {
            errMsg="Le libellé de l'article est trop court (2 car) !";
        };
        if (isNaN(actArticle.aUnitNb)) {
            errMsg="le nombre par lot n'est pas valide";
        };
        if (isNaN(actArticle.aUnitPrice)) {
            errMsg="le prix n'est pas valide";
        };
        if (errMsg) {
            const articlesChange=[...articles];
            articlesChange[findIndex(id)].aMsg=errMsg;
            setArticles(articlesChange); 
        };
        if (!errMsg) {
            if (actArticle.aNum===0) {
                // Ajout d'un article
                dispatch(insertArticle({actArticle}));
                errMsg="Article Ajoutée !";
                setTimeout(() => {
                    fetch(`${URL_COURTJUS_BACK}/articles/${selectedProduct.uNum}`)
                    .then(response => response.json())
                    .then(resA => {
                      setArticles(resA);
                    });
                }, 2000); 
            } else {
                // Modification d'un article
                dispatch(updateArticle({actArticle})) ;
                errMsg="Informations mises à jour !";
            }
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
            <form method="POST" id="formFiltre">
                    <label htmlFor="filtre"><img src="img/search.png" alt="Rechercher" className='img-filtre-mono' /></label>
					<input type="text" name="filtre" id="filtre" value={filtre} onChange={handleChange} /> 
				</form>	
            </section>
            <section className='main-title'><p>Les producteurs - leurs articles</p></section>
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
									<p>
                                    { q.aMsg && <section className="section-prods-err"><p>{q.aMsg}</p></section> }
                                        <span className='span-light'>({i}-{q.aNumProducteur}-{q.aNum})-{secuUpdate}-</span>
                                        <input type="hidden" name="aIndex" id={`aIndex_${i}`} value={i} disabled={secuUpdate}/>
                                        <input type="hidden" name="aNumProducteur" id={`aNumProducteur_${i}`} value={q.aNumProducteur} disabled={secuUpdate}/>
                                        <input type="hidden" name="aNum" id={`aNum_${i}`} value={q.aNum} disabled={secuUpdate}/>
                                        <label htmlFor="aLibelle-00"> Libellé : </label> 
                                        <input className="input-max" type="text" name="aLibelle" id={`aLibelle_${i}`} required value={q.aLibelle} onChange={handleChangeArticle} disabled={secuUpdate} />
                                    </p>
                                    <p>    
                                        <label htmlFor="aUnitNb-00"> en lot de : </label> 
                                        <input className="input-small" type="number" maxLength="5" name="aUnitNb" id={`aUnitNb_${i}`} required value={q.aUnitNb} onChange={handleChangeArticle}  disabled={secuUpdate}/>
                                        <label htmlFor="aMesure-00"> unité de mesure : </label> 
                                        <input className="input-small" type="text" maxLength="6" name="aMesure" id={`aMesure_${i}`} required value={q.aMesure} onChange={handleChangeArticle} disabled={secuUpdate} />
                                        <label htmlFor="aUnitPrice-00"> prix : </label> 
                                        <input className="input-small" type="number" maxLength="5" name="aUnitPrice" id={`aUnitPrice_${i}`} required value={q.aUnitPrice} onChange={handleChangeArticle} disabled={secuUpdate} />
                                    </p>
                                    <p>    
                                        <label htmlFor="aPrecision-00"> Précision : </label> 
                                        <input className="input-max" type="text" name="aPrecision" id={`aPrecision_${i}`} value={q.aPrecision} onChange={handleChangeArticle} disabled={secuUpdate} />
									</p>
                                    <p>    
                                        <label htmlFor="aComment-00"> Commentaires : </label> 
                                        <input className="input-max" type="text" name="aComment" id={`aComment_${i}`} value={q.aComment} onChange={handleChangeArticle} disabled={secuUpdate} />
									</p>
                                    {!secuUpdate &&
                                        <p><button id={`sav_${i}`} disabled={secuUpdate}>Enregistrer</button></p>
                                    }
								</div>
            				</form>
                            )}
                            {!secuUpdate &&
								<div className="form-zone">
                                    <form method="POST" id={`form_New`} >
                                        <p><button id={`new_${selectedProduct.uNum}`} onClick={handleNewArticle}>Ajouter un nouvel Article</button></p>
                                    </form>
								</div>
                            }
						</fieldset>
					</article>
                </div>
            }
            <div className="main-down"></div>

        </main>

    )
}

export default Articles;