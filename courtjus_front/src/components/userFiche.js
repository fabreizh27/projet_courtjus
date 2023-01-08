import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import { useParams } from "react-router-dom";
import {useEffect, useState} from 'react';
import {useSelector} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { USER_INIT } from '../constants/globals';

const UserView = (props) =>{

    const {userCJ} = useSelector(state => state);
	const { postId } = useParams();
    const [userFiche, setUserFiche] = useState([]);
	const {userMenu} = useSelector(state => state);

    let userN=0;
    if (typeof(postId)==="undefined" || userCJ.uAdmin===false || userCJ.uNum<1) { userN=userCJ.uNum } else { userN=postId };
    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/users/${userN}`)
        .then(response => response.json())
        .then(res => {
            if (res===null) {setUserFiche(USER_INIT);} else {setUserFiche(res);}
        });
    }, []);

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
        console.log(userFiche);
    };

    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}
            {globalSecu===false &&
                <><section className="section-prods section-prods-form">
                <form method="POST" id="formContact" encType="multipart/form-data" disabled={persoSecu}>
                    <img src="/img/pictures/IMG_3154.jpg" alt="la photo du user" className="float-prods"/>
                    <article className="section-prods-fiche form-fiche">
                        <fieldset disabled={persoSecu}>
                            <legend>infos contact</legend>
                            <p><input type="hidden" name="uNum" id="uNum" value={userFiche.uNum}/></p>
                            <p><label htmlFor="uNom">Nom</label> <input className="input-default" type="text" name="uNom" id="uNom" value={userFiche.uNom} required onChange={handleChange} /></p>
                            <p><label htmlFor="uPrenom">Prénom</label> <input className="input-default" type="text" name="uPrenom" id="uPrenom" value={userFiche.uPrenom} required onChange={handleChange} /></p>
                            <p><label htmlFor="uMail">Mail</label> <input className="input-default" type="email" name="uMail" id="uMail" value={userFiche.uMail} required onChange={handleChange} /></p>
                            <p><label htmlFor="uTel">Téléphone</label> <input className="input-default" type="text" name="uTel" id="uTel" value={userFiche.uTel} required onChange={handleChange} /></p>
                        </fieldset>
                        <a className="btn-detail" href="#" aria-label="Detail producteur" title="Detail producteur"><img src="/img/double_arrow_D.png"/></a>	

                    </article>
                    <article className="section-prods-infos form-fiche">
                        <fieldset disabled={persoSecu}>
                            <legend>Securité</legend>
                            <p>
                                <label htmlFor="uPass">Mot de Passe</label> <input className="input-default" type="password" name="uPass" id="uPass" required onChange={handleChange} /> 
                                <label htmlFor="uPass2">2nde saisie</label> <input className="input-default" type="password" name="uPass2" id="uPass2" required onChange={handleChange} />
                            </p>
                        </fieldset>
                        <fieldset disabled={adminSecu}>
                            <legend>Type contact</legend>
                            <p>
                                <label className="check" htmlFor="uActif"><input type="checkbox" id="uActif" name="uActif" checked={userFiche.uActif} onChange={handleChange}/> Actif</label>
                                <label className="check" htmlFor="uAdherent"><input type="checkbox" id="uAdherent" name="uAdherent" checked={userFiche.uAdherent} onChange={handleChange} /> Adherent</label>
                                <label className="check" htmlFor="uCommission"><input type="checkbox" id="uCommission" name="uCommission" checked={userFiche.uCommission} onChange={handleChange} /> Commission</label>
                                <label className="check" htmlFor="uProducteur"><input type="checkbox" id="uProducteur" name="uProducteur" checked={userFiche.uProducteur} onChange={handleChange} /> Producteur</label>
                                <label className="check" htmlFor="uAdmin"><input type="checkbox" id="uAdmin" name="uAdmin" onChange={handleChange}/> Admin</label>
                            </p>


                        </fieldset>
                        {persoSecu===false &&
                        <fieldset>
                            <legend>Adresse</legend>
                            <p><label htmlFor="uAdr_L1">Adresse</label> <input className="input-dbl" type="text" name="uAdr_L1" id="uAdr_L1" value={userFiche.uAdr_L1} onChange={handleChange} /></p>
                            <p><label htmlFor="uAdr_L2">...</label> <input className="input-dbl" type="text" name="uAdr_L2" id="uAdr_L2" value={userFiche.uAdr_L2} onChange={handleChange} /></p>
                            <p><label htmlFor="uAdr_L3">...</label> <input className="input-dbl" type="text" name="uAdr_L3" id="uAdr_L3" value={userFiche.uAdr_L3} onChange={handleChange} /></p>
                            <p><label htmlFor="uAdr_CP">Code Postal</label> <input className="input-small" type="text" name="uAdr_CP" id="uAdr_CP" value={userFiche.uAdr_CP} onChange={handleChange} />
                            <label htmlFor="uAdr_Ville">Ville</label> <input className="input-default" type="text" name="uAdr_Ville" id="uAdr_Ville" value={userFiche.uAdr_Ville} onChange={handleChange} /></p>
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
                        <fieldset  disabled={persoSecu}>
                            <legend>Photo carte de visite</legend>
                            <p><input className="input-dbl" type="file" name="uPhotoProfil" id="uPhotoProfil" onChange={handleChange} /></p>
                        </fieldset>
                        <fieldset  disabled={persoSecu}>
                            <legend>Présentation</legend>
                            <p><textarea className="input-area" name="uInfosComp" id="uInfosComp" onChange={handleChange} value={userFiche.uInfosComp}></textarea></p>
                        </fieldset>
                        <fieldset disabled={persoSecu}>
                            <legend>Sauvegarde</legend>
                            <button id="fiche-sav">Enregistrer</button>
                        </fieldset>
                    </article>
                </form>
            </section>
            <div className="main-down"></div></>
        }
        { globalSecu &&
            <section className="section-prods"><p className="p-impact">Vous n'etes pas autorisé à acceder à ces informations</p></section>
        }
        </main>

    )
}

export default UserView;