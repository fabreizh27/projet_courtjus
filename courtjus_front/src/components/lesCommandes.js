import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import { useParams } from "react-router-dom";
import {useEffect, useState} from 'react';
import {useSelector} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { BIASSE_INIT } from '../constants/globals';


const LesCommandes = (props) =>{
    const {userCJ, userMenu} = useSelector(state => state);
    const userNum = userCJ.uNum;
    const userAdherent = userCJ.uAdherent;
    const userProducteur = userCJ.uProducteur;
    const userCommission = userCJ.uCommission;
    const userAdmin = userCJ.uAdmin;

    const [biasse, setBiasse] = useState([]);
    const [producteurs, setProducteurs] = useState([]);
    const [adherents, setadherents] = useState([]);
    const [cdesLignes, setCdesLignes] = useState([]);
    const [cdesFiltres, setCdesFiltres] = useState([]);
    const [dataView, setDataView] = useState({ niv0:[], niv1:[], niv2:[] ,data:[] });
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

    const { postId } = useParams();

    useEffect (() => {
        const newFiltre = {
            filtreBiasse:0,          
            filtreOrdre:0,          
            filtreStyle:0,          
            filtreMonoAdherent:0,   
            filtreMonoProducteur:0,  
            filtreTxtAdherents:"",   
            filtreTxtProducteur:"",  
            filtreTxtArticle:""      
        }
        if (postId===undefined) {
            newFiltre.filtreMonoAdherent=userNum
        } else {
            const postIdArray= postId.split('_')
            if (postIdArray.length!==8) {
                newFiltre.filtreMonoAdherent=userNum
            } else {
                newFiltre.filtreBiasse=Number(postIdArray[0]);
                newFiltre.filtreOrdre=Number(postIdArray[1]);
                newFiltre.filtreStyle=Number(postIdArray[2]);
                newFiltre.filtreMonoAdherent=Number(postIdArray[3]);
                newFiltre.filtreMonoProducteur=Number(postIdArray[4]);
                newFiltre.filtreTxtAdherents=postIdArray[5];
                newFiltre.filtreTxtProducteur=postIdArray[6];
                newFiltre.filtreTxtArticle=postIdArray[7];
                if (!userAdmin && !userCommission && !userProducteur) {newFiltre.filtreMonoAdherent=userNum} // ne voir que son propre panier si uniquement adherent
                if (!userAdmin && !userCommission && userProducteur) {newFiltre.filtreMonoProducteur=userNum} // ne voir que les commandes qui lui sont destinées si uniquement producteur            
            }
        }
        // recuperation de la biasse active
        fetch(`${URL_COURTJUS_BACK}/biasseactive`)
          .then(response => response.json())
          .then(res => {
            if (res===null) {
                const newBiasse=BIASSE_INIT;
                newBiasse.cmdOpen=false
                setBiasse(newBiasse);
            } else {
                newFiltre.filtreBiasse=res.bNum;
                const dateNow=new Date();
                const dateB = new Date(res.bDate.substring(0,10));
                const dateBCI = new Date(res.bDateCdeIni.substring(0,10));
                const dateBCE = new Date(res.bDateCdeEnd.substring(0,10));
                if (dateBCI<=dateNow && dateBCE>=dateNow) {res.cmdOpen=true} else {res.cmdOpen=false};
                res.bDate=dateB.toLocaleDateString();
                res.bDateCdeIni=dateBCI.toLocaleDateString();
                res.bDateCdeEnd=dateBCE.toLocaleDateString();
                setBiasse(res);
                // recuperation des commandes de la biasses
                fetch(`${URL_COURTJUS_BACK}/cdeslignesbiasse/${res.bNum}`)
                .then(response => response.json())
                .then(resC => {
                    setCdesLignes(resC);
                    const cdesUsers = [];
                    if (newFiltre.filtreMonoAdherent>0) {
                        cdesUsers.push(newFiltre.filtreMonoAdherent)
                    } else {
                        resC.forEach(cde => {
                            const found = cdesUsers.find(user => user === cde.cUser);
                            if (!found) { cdesUsers.push(cde.cUser)};
                        });
                    }
                    // recuperation des adherents ayant pre-commandé
                    fetch(`${URL_COURTJUS_BACK}/usersin/${cdesUsers}`)
                    .then(response => response.json())
                    .then(resA => {
                         setadherents(resA);
                        // recuperation des participants
                        let participants = [0]
                        if (newFiltre.filtreMonoProducteur>0) {
                            participants.push(newFiltre.filtreMonoProducteur);
                        } else {
                            participants=res.bParticipants;
                        }    
                        fetch(`${URL_COURTJUS_BACK}/usersin/${participants}`)
                        .then(response => response.json())
                        .then(resP => {
                            setProducteurs(resP);
                            setFiltre(newFiltre)
                            resultWrith(resP,resA,resC)
                            
                        });
                    });
                });
           }
          });
    }, []);

    useEffect (() => {
        const prods = [...producteurs];
        const adhers = [...adherents];
        const articls = [...cdesLignes];

        // filtre des producteurs
        for (let i = 0; i < prods.length; i++) {
            const prodNum = prods[i].uNum;
            prods[i].supp=false
            const prodTxt = prods[i].uNom.toLowerCase() + prods[i].uPrenom.toLowerCase() + prods[i].uStructure.toLowerCase() + prods[i].uProduction.toLowerCase();
            if (filtre.filtreMonoProducteur>0 && prodNum!==filtre.filtreMonoProducteur) {
                prods[i].supp=true
            }  
            if (!prodTxt.includes(filtre.filtreTxtProducteur) && filtre.filtreTxtProducteur.length>0) {
                prods[i].supp=true
            }  
        }
        const prodsFind = prods.filter(prod => prod.supp===false);

        // filtre des adherents
        for (let i = 0; i < adhers.length; i++) {
            const adherNum = adhers[i].uNum;
            adhers[i].supp=false
            const adherTxt = adhers[i].uNom.toLowerCase() + adhers[i].uPrenom.toLowerCase() + adhers[i].uStructure.toLowerCase();
            if (filtre.filtreMonoAdherent>0 && adherNum!==filtre.filtreMonoAdherent) {
                adhers[i].supp=true
            }  
            if (!adherTxt.includes(filtre.filtreTxtAdherents) && filtre.filtreTxtAdherents.length>0) {
                adhers[i].supp=true
            }  
        }
        const adhersFind = adhers.filter(adher => adher.supp===false);

        // filtre des lignes de commandes
        for (let i = 0; i < articls.length; i++) {
            articls[i].supp=false
            const articlTxt = articls[i].cArticleLib.toLowerCase() + articls[i].cCommentaire.toLowerCase();
            if (!articlTxt.includes(filtre.filtreTxtArticle) && filtre.filtreTxtArticle.length>0) {
                articls[i].supp=true
            }  
        }
        const articlsFind = articls.filter(articl => articl.supp===false);

        resultWrith(prodsFind,adhersFind,articlsFind)

    }, [filtre]);

    

    function resultWrith(prods,adhers,cdes) {

        for (let c = 0; c < cdes.length; c++) {
            const prodNum= cdes[c].cProducteur;
            const adherNum= cdes[c].cUser;
            cdes[c].cProducteurName="";
            for (let p = 0; p < prods.length; p++) {
                if (prods[p].uNum===prodNum) {
                    cdes[c].cProducteurName=prods[p].uStructure + " (" +prods[p].uMailPro + ")";
                };
            };
            cdes[c].cUserName="";
            for (let a = 0; a < adhers.length; a++) {
                if (adhers[a].uNum===adherNum) {
                    cdes[c].cUserName=adhers[a].uNom + " " + adhers[a].uPrenom + " (" +adhers[a].uMail + ")";
                };
            };
            if (cdes[c].cProducteurName==="" || cdes[c].cUserName==="") {cdes[c].supp=true} else {cdes[c].supp=false};
        }
        const cdesFind = cdes.filter(cde => cde.supp===false);

        
        let niv1Num = 0;
        let niv1Lib = "";
        let niv2Num = 0;
        let niv2Lib = "";
        let niv3Num = 0;
        let niv3Lib = "";
        let niv3Val = 0;
        const cdesArray = [];

        for (let c = 0; c < cdesFind.length; c++) {

            if (filtre.filtreMonoAdherent>0) {
                 niv1Num = cdesFind[c].cUser;
                 niv1Lib = cdesFind[c].cUserName;
                 niv2Num = cdesFind[c].cProducteur;
                 niv2Lib = cdesFind[c].cProducteurName;
                 niv3Num = cdesFind[c].cArticle;
                 niv3Lib = cdesFind[c].cArticleLib;
            } else {
                 niv1Num = cdesFind[c].cProducteur;
                 niv1Lib = cdesFind[c].cProducteurName;
                if (filtre.filtreOrdre===0) {
                     niv2Num = cdesFind[c].cUser;
                     niv2Lib = cdesFind[c].cUserName;
                     niv3Num = cdesFind[c].cArticle;
                     niv3Lib = cdesFind[c].cArticleLib;    
                } else {
                     niv2Num = cdesFind[c].cArticle;
                     niv2Lib = cdesFind[c].cArticleLib;    
                     niv3Num = cdesFind[c].cUser;
                     niv3Lib = cdesFind[c].cUserName;
                }
            }
            niv3Val = cdesFind[c].cNombre
            cdesArray.push({
                niv1Num : niv1Num,
                niv1Lib : niv1Lib,
                niv2Num : niv2Num,
                niv2Lib : niv2Lib,
                niv3Num : niv3Num,
                niv3Lib : niv3Lib,
                niv3Val : niv3Val
            })
        };

        cdesArray.sort(function (a, b) {
            return a.niv3Num - b.niv3Num;
          });
        cdesArray.sort(function (a, b) {
        return a.niv2Num - b.niv2Num;
        });
        cdesArray.sort(function (a, b) {
        return a.niv1Num - b.niv1Num;
        });

        for (let c = cdesFind.length-1; c >0; c--) {
            if (cdesArray[c].niv1Lib === cdesArray[c-1].niv1Lib && cdesArray[c].niv2Lib === cdesArray[c-1].niv2Lib && cdesArray[c].niv3Lib === cdesArray[c-1].niv3Lib) {cdesArray[c].niv2Lib=""};
            if (cdesArray[c].niv1Lib === cdesArray[c-1].niv1Lib && cdesArray[c].niv2Lib === cdesArray[c-1].niv2Lib) {cdesArray[c].niv2Lib=""};
            if (cdesArray[c].niv1Lib === cdesArray[c-1].niv1Lib) {cdesArray[c].niv1Lib=""};
        };

        setCdesFiltres(cdesArray);

    };
    
    const handleChangeAD = (event) => {
        event.preventDefault();
        const {value} = event.target;
        setFiltre(oldFiltre => { return {...filtre,filtreTxtAdherents: value}; });
    };

    const handleChangePR = (event) => {
        event.preventDefault();
        const {value} = event.target;
        setFiltre(oldFiltre => { return {...filtre,filtreTxtProducteur: value}; });
    };

    const handleChangeAR = (event) => {
        event.preventDefault();
        const {value} = event.target;
        setFiltre(oldFiltre => { return {...filtre,filtreTxtArticle: value}; });
    };

    const handleSwitchAA = (event) => {
        event.preventDefault();
        if (filtre.filtreOrdre===0) {
            setFiltre(oldFiltre => { return {...filtre,filtreOrdre: 1}; });
        } else {
            setFiltre(oldFiltre => { return {...filtre,filtreOrdre: 0}; });
        };
    };
    
    const handleSwitchLT = (event) => {
        event.preventDefault();
        if (filtre.filtreStyle===0) {
            setFiltre(oldFiltre => { return {...filtre,filtreStyle: 1}; });
        } else {
            setFiltre(oldFiltre => { return {...filtre,filtreStyle: 0}; });
        };
    };
    
    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}
            <section className="nav-admin">
				<form method="POST" id="formFiltre" className='form-filtre'>
                    {filtre.filtreMonoAdherent===0 && <img src={`/img/btnAA_${filtre.filtreOrdre}.png`} alt="Ordre de regroupement" onClick={handleSwitchAA} />}
                    {/* <img src={`/img/btnLT_${filtre.filtreStyle}.png`} alt="style d'affichage" onClick={handleSwitchLT} /> */}
				</form>	
            </section>
            <section className="nav-admin">
				<form method="POST" id="formFiltre" className='form-filtre'>
                    <label htmlFor="filtreAD"><img src="/img/filtreAD.png" alt="Rechercher clients / adhérents" /></label>
					<input type="text" name="filtreAD" id="filtreAD" placeholder='? clients / adhérents' value={filtre.filtreTxtAdherents} onChange={handleChangeAD} /> 
                    <label htmlFor="filtrePR"><img src="/img/filtrePR.png" alt="Rechercher producteurs" /></label>
					<input type="text" name="filtrePR" id="filtrePR" placeholder='? producteurs' value={filtre.filtreTxtProducteur} onChange={handleChangePR} /> 
                    <label htmlFor="filtreAR"><img src="/img/filtreAR.png" alt="Rechercher articles" /></label>
					<input type="text" name="filtreAR" id="filtreAR" placeholder='? articles' value={filtre.filtreTxtArticle} onChange={handleChangeAR} /> 
				</form>	
            </section>
            <section className='main-title'><p>Commandes pour le {biasse.bDate} - {biasse.bLibelle} {biasse.cmdOpen}<span className="section-prods-err">{!biasse.cmdOpen && ` ( Commandes fermées ) `}</span>
             <span className="p-impact">{` commandes entre le ${biasse.bDateCdeIni} et le ${biasse.bDateCdeEnd}`}</span> </p>
            </section>
            { userCJ.uNum>0 && 
            <section className="section-cdes">
                {cdesFiltres.map((q, i) =>
                        <article key={i}>
                            {q.niv1Lib.length>0 && <p className='cdes-p-niv-1'>{q.niv1Num}-{q.niv1Lib}</p>}
                            {q.niv2Lib.length>0 && <p className='cdes-p-niv-2'>{q.niv2Num}-{q.niv2Lib}</p>}
                            {q.niv3Lib.length>0 && <p className='cdes-p-niv-3'>{q.niv3Num}-{q.niv3Lib} :  <span className='cdes-span-niv-3'>{q.niv3Val}</span></p>}
                        </article>
                )}
            </section>
            }
            { userCJ.uNum<1 && <section className="section-prods-err"><p>Veuillez vous authentifier !</p></section> }
            <div className="main-down"></div>

        </main>

    )
}

export default LesCommandes;