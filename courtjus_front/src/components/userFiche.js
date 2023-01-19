import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import { useParams } from "react-router-dom";
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { USER_INIT } from '../constants/globals';
import { updateUser, insertUser } from '../actions/actions-types';

const UserView = (props) =>{

    const {userCJ, userMenu} = useSelector(state => state);
    const dispatch = useDispatch()

	const { postId } = useParams();
    const [userFiche, setUserFiche] = useState([]);
    const [userPass, setUserPass] = useState({verifPass:"",verifPass2:""});
 
    let userN=0;
    if (typeof(postId)==="undefined" || userCJ.uAdmin===false || userCJ.uNum<1) { userN=userCJ.uNum } else { userN=postId };

    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/users/${userN}`)
        .then(response => response.json())
        .then(res => {
            if (res===null) {setUserFiche(USER_INIT);} else {setUserFiche(res);}
        });
    }, []);

    useEffect(() => {
        setUserPass({verifPass:"",verifPass2:""});}
    , []);


    let adminSecu=true;
    if (userCJ.uAdmin ) { adminSecu=false }
    let persoSecu=true;
    if (userCJ.uAdmin || userCJ.uNum===userFiche.uNum ) { persoSecu=false }
    let prodSecu=true;
    if (userCJ.uAdmin || userCJ.uProducteur ) { prodSecu=false }
    let globalSecu=false;
    if (userCJ.uAdmin===false && userFiche.uNum<1 ) { globalSecu=true }
    if (userCJ.uNum<1) { globalSecu=true }

    
    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserFiche(oldUser => { return {...userFiche,[name]: value, uMsg : ""}; });
        event.preventDefault();
    };

    const handleDownCB = (event) => {
        const {name, value} = event.target;
        let newValue=false
        value==="false" ? newValue=true : newValue=false
        setUserFiche(oldUser => { return {...userFiche,[name]: newValue}; });
        event.preventDefault();
    };
    const handleUpCB = (event) => {
        // obligé de faire les modif en deux fois car la case à cochée ne s'actualisait (visuellement) qu'a l'action suivante !
        setUserFiche(oldUser => { return {...userFiche,uMsg : ""}; });
    };
    const handleChangeCB = (event) => {
        // fonction pour ne pas que reacte identifie une erreur
    };

    const handleChangePass = (event) => {
        const {name, value} = event.target;
        setUserPass(oldUser => { return {...userPass,[name]: value}; });
        setUserFiche(oldUser => { return {...userFiche, uMsg : ""}; });
        event.preventDefault();
    };

    function checkEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    
    const handleSubmit = (event) => {
        event.preventDefault();
        let errMsg="";
        if (userPass.verifPass.length<8) {
            errMsg="Le mot de passe doit avoir plus de 8 caracteres !";
        };
        if (userPass.verifPass!=userPass.verifPass2) {
            errMsg="Les deux mots de passe ne sont pas identiques !";
        };
        if (userFiche.uNom.length<3) {
            errMsg="Vous n'avez pas indiqué de nom !";
        };
        if (userFiche.uPrenom.length<3) {
            errMsg="Vous n'avez pas indiqué de prénom !";
        };
        if (!checkEmail(userFiche.uMail)) {
            errMsg="L'adresse mail n'est pas valide !";
        };
        if (errMsg) {
            setUserFiche(oldUser => { return {...userFiche,uMsg : errMsg}; });
        };
        fetch(`${URL_COURTJUS_BACK}/userverifexist/${userFiche.uMail}`)
        .then(response => response.json())
        .then(res => {
            if (res!=null) {
                if (res[0].nb>0 && res[0]._id.uNum!=userFiche.uNum) {
                    // si l'adresse existe déjà et que n'est pas la meme fiche utilisateur
                    errMsg="Adresse mail déjà existante !"
                    setUserFiche(oldUser => { return {...userFiche,uMsg : errMsg}; });
                } else {
                    if (errMsg) {
                        // enregistrement impossible
                        console.log("stop");
                    } else {
                        if (userFiche.uNum===0) {
                            // Ajout d'un utilisateur
                            dispatch(insertUser({userFiche}))
                            errMsg="Utilisateur Ajouté !"
                            setUserFiche(oldUser => { return {...userFiche,uMsg : errMsg}; });
 
                        } else {
                            // Modification d'un utilisateur
                            dispatch(updateUser({userFiche})) 
                            errMsg="Informations mises à jour !"
                            setUserFiche(oldUser => { return {...userFiche,uMsg : errMsg}; });
                        }
                    }
                }
            }
        });


    };



    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}
            {globalSecu===false &&
                <>
                    { userFiche.uMsg && <section className="section-prods-err"><p>{userFiche.uMsg}</p></section> }
                    <section className="section-prods section-prods-form">
                        <form method="POST" id="formContact" encType="multipart/form-data" disabled={persoSecu} onSubmit={handleSubmit}>
                             <img src={`/img/pictures/${userFiche.uPhotoProfil}`} alt="la photo du user" className="float-prods"/>
                            <article className="section-prods-fiche form-fiche">
                                <fieldset disabled={persoSecu}>
                                    <legend>infos contact <span className='span-light'>({userFiche.uNum})</span></legend>
                                    <p><input type="hidden" name="uNum" id="uNum" value={userFiche.uNum}/></p>
                                    <p><label htmlFor="uNom">Nom</label> <input className="input-default" type="text" name="uNom" id="uNom" value={userFiche.uNom} required onChange={handleChange} /></p>
                                    <p><label htmlFor="uPrenom">Prénom</label> <input className="input-default" type="text" name="uPrenom" id="uPrenom" value={userFiche.uPrenom} required onChange={handleChange} /></p>
                                    <p><label htmlFor="uMail">Mail</label> <input disabled={adminSecu} className="input-default" type="email" name="uMail" id="uMail" value={userFiche.uMail} required onChange={handleChange} /></p>
                                    <p><label htmlFor="uTel">Téléphone</label> <input className="input-default" type="text" name="uTel" id="uTel" value={userFiche.uTel} required onChange={handleChange} /></p>
                                </fieldset>
                                <a className="btn-detail" href="#" aria-label="Detail producteur" title="Detail producteur"><img src="/img/double_arrow_D.png"/></a>	

                            </article>
                            <article className="section-prods-infos form-fiche">
                                <fieldset disabled={persoSecu}>
                                    <legend>Securité</legend>
                                    <p>
                                        <label htmlFor="uPass">Mot de Passe</label> <input className="input-default" type="password" name="verifPass" id="verifPass" value={userPass.verifPass} required onChange={handleChangePass} /> 
                                        <label htmlFor="uPass2"> 2nde saisie</label> <input className="input-default" type="password" name="verifPass2" id="verifPass2" value={userPass.verifPass2} required onChange={handleChangePass} />
                                    </p>
                                </fieldset>
                                <fieldset disabled={adminSecu}>
                                    <legend>Type contact</legend>
                                    <p>        
                                        <label className="check" htmlFor="uActif"> Actif</label>
                                        <input type="checkbox" id="uActif" name="uActif" checked={userFiche.uActif} value={userFiche.uActif} onMouseDown={handleDownCB} onMouseUp={handleUpCB} onChange={handleChangeCB}/>
                                        <label className="check" htmlFor="uAdherent"> Adherent</label>
                                        <input type="checkbox" id="uAdherent" name="uAdherent" checked={userFiche.uAdherent} value={userFiche.uAdherent} onMouseDown={handleDownCB} onMouseUp={handleUpCB}  onChange={handleChangeCB}/>
                                        <label className="check" htmlFor="uCommission"> Commission</label>
                                        <input type="checkbox" id="uCommission" name="uCommission" checked={userFiche.uCommission}  value={userFiche.uCommission} onMouseDown={handleDownCB} onMouseUp={handleUpCB} onChange={handleChangeCB}/>
                                        <label className="check" htmlFor="uProducteur"> Producteur</label>
                                        <input type="checkbox" id="uProducteur" name="uProducteur" checked={userFiche.uProducteur}  value={userFiche.uProducteur} onMouseDown={handleDownCB} onMouseUp={handleUpCB} onChange={handleChangeCB} />
                                        <label className="check" htmlFor="uAdmin"> Admin</label>
                                        <input type="checkbox" id="uAdmin" name="uAdmin" checked={userFiche.uAdmin}  value={userFiche.uAdmin} onMouseDown={handleDownCB} onMouseUp={handleUpCB} onChange={handleChangeCB}/>
                                    </p>


                                </fieldset>
                                {persoSecu===false &&
                                <fieldset>
                                    <legend>Adresse</legend>
                                    <p><label htmlFor="uAdr_L1">Adresse</label> <input className="input-dbl" type="text" name="uAdr_L1" id="uAdr_L1" value={userFiche.uAdr_L1} onChange={handleChange} /></p>
                                    <p><label htmlFor="uAdr_L2">...</label> <input className="input-dbl" type="text" name="uAdr_L2" id="uAdr_L2" value={userFiche.uAdr_L2} onChange={handleChange} /></p>
                                    <p><label htmlFor="uAdr_L3">...</label> <input className="input-dbl" type="text" name="uAdr_L3" id="uAdr_L3" value={userFiche.uAdr_L3} onChange={handleChange} /></p>
                                    <p><label htmlFor="uAdr_CP">Code Postal</label> <input className="input-small" type="text" name="uAdr_CP" id="uAdr_CP" value={userFiche.uAdr_CP} onChange={handleChange} />
                                    <label htmlFor="uAdr_Ville"> Ville</label> <input className="input-default" type="text" name="uAdr_Ville" id="uAdr_Ville" value={userFiche.uAdr_Ville} onChange={handleChange} /></p>
                                </fieldset>
                                }
                                {prodSecu===false && 
                                <fieldset>
                                    <legend>infos comp. producteur</legend>
                                    <p><label htmlFor="uStructure">Entreprise</label> <input className="input-dbl" type="text" name="uStructure" id="uStructure" value={userFiche.uStructure} onChange={handleChange} /></p>
                                    <p><label htmlFor="uProduction">Productions</label> <input className="input-dbl" type="text" name="uProduction" id="uProduction" value={userFiche.uProduction} onChange={handleChange} /></p>
                                    <p><label htmlFor="uVente">lieu de Vente</label> <input className="input-dbl" type="text" name="uVente" id="uVente" value={userFiche.uVente} onChange={handleChange} /></p>
                                    <p><label htmlFor="uMailPro">Mail-Pro</label> <input className="input-dbl" type="email" name="uMailPro" id="uMailPro" value={userFiche.uMailPro} onChange={handleChange} /></p>
                                </fieldset>
                                }
                                <fieldset disabled={adminSecu}>
                                    <legend>Référents</legend>
                                    <p><label htmlFor="uReferents">Noms</label> <input className="input-dbl" type="text" name="uReferents" id="uReferents" value={userFiche.uReferents} onChange={handleChange} /></p>
                                </fieldset>
                                {/* <fieldset  disabled={persoSecu}>
                                    <legend>Photo carte de visite</legend>
                                    <p><input className="input-dbl" type="file" name="uPhotoProfil" id="uPhotoProfil" onChange={handleChange} /></p>
                                </fieldset> */}
                                <fieldset  disabled={persoSecu}>
                                    <legend>Présentation</legend>
                                    <p><textarea className="input-area" name="uInfosComp" id="uInfosComp" onChange={handleChange} value={userFiche.uInfosComp}></textarea></p>
                                </fieldset>
                                <fieldset disabled={persoSecu}>
                                    <legend>Sauvegarde</legend>
                                    <button id="fiche-sav">Enregistrer</button>
                                </fieldset>
                            </article>
                            <section className="nav-admin"><p className="section-prods-err">{userFiche.uMsg}</p></section>
                        </form>
                    </section>
                    <div className="main-down"></div>
                </>
            }
            { globalSecu &&
                <section className="section-prods"><p className="p-impact">Vous n'etes pas autorisé à acceder à ces informations</p></section>
            }
        </main>

    )
}

export default UserView;