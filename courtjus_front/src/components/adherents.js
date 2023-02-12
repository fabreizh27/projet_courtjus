import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import {useEffect, useState} from 'react';
import {useSelector} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { NavLink } from "react-router-dom";

const Adherents = (props) =>{

    const {userCJ, userMenu} = useSelector(state => state);
    const [adherents, setAdherents] = useState([]);
    const [filtre, setFiltre] = useState([]);

    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/users`)
          .then(response => response.json())
          .then(res => {
            setAdherents(res);
          });
      }, []);
  
      const handleChange = (event) => {
        event.preventDefault();
        const {value} = event.target;
        setFiltre(value);
        let url=""
        value.length<1 ? url=`${URL_COURTJUS_BACK}/users` : url=`${URL_COURTJUS_BACK}/usersfiltre/${value}`;
        fetch(url)
            .then(response => response.json())
            .then(res => {
            setAdherents(res);
        });
      };


    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}
            {userCJ.uAdmin && <>
                <section className="nav-admin">
				<form method="POST" id="formFiltre" className='form-filtre'>
                    <label htmlFor="filtre"><img src="img/search.png" alt="Rechercher" /></label>
					<input type="text" name="filtre" id="filtre" value={filtre} onChange={handleChange} /> 
				</form>	
                </section>
                <section className='main-title'><p><NavLink to={`/userfiche/0`} aria-label="Ajouter un utilisateur" title="Ajouter un utilisateur"><img src="/img/user_add_b.png" alt="Ajouter"/></NavLink> Adherents</p></section>
                {adherents.map((q, i) =>
                    <section className="section-prods" key={i}>
                        <img src={`/img/pictures/${q.uPhotoProfil}`} alt="la photo du 1er article" className="float-prods" />
                        <article className="section-prods-fiche">
                            <h2>{q.uStructure}.</h2>
                            <p className="p-impact"><span className="span-light">({q.uNum})</span>  {q.uProduction}</p>
                            <h3>{q.uPrenom} {q.uNom}</h3>
                            <p>{q.uMailPro && q.uMailPro}{q.uMailPro==="" && q.uMail}</p>
                            <p>{q.uTel}.</p>
                            <p>{q.uAdr_CP} {q.uAdr_Ville}.</p>
                            <div className="btn-detail">
                                {(userCJ.uAdmin || userCJ.uNum===q.uNum) &&<NavLink to={`/userfiche/${q.uNum}`} aria-label="Modifier la fiche" title="modifier la fiche"><img src="/img/edit_R.png" alt="Voir plus"/></NavLink>}	
                                <NavLink  aria-label="Voir plus" title="Voir plus"><img src="img/double_arrow_DG.png" alt="voir plus" /></NavLink>
                            </div>	
                        </article>
                        <article className="section-prods-infos">
                            <p>{q.uInfosComp}</p>
                        </article>
                    </section>
                )}

                <section className="section-prods">
                    <img src={`/img/pictures/profil.png`} alt="la photo de l article article" className="float-prods" />
                    <article className="section-prods-fiche">
                        <h2>&nbsp;</h2>
                        <p className="p-impact">&nbsp;</p>
                        <NavLink to={`/userfiche/0`} className="btn-main" aria-label="Ajouter une fiche" title="Ajouter une fiche"><img src="/img/user_add_b.png" alt="Ajouter" />Ajouter un utilisateur</NavLink>
                        
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>.</p>
                        <div className="btn-detail">
                            <NavLink to={`/userfiche/0`} aria-label="Ajouter une fiche" title="Ajouter une fiche"><img src="/img/edit_R.png" alt="Ajouter" /></NavLink>	
                            <NavLink  aria-label="Voir plus" title="Voir plus"><img src="img/double_arrow_DG.png" alt="voir la suite" /></NavLink>
                        </div>	
                    </article>
                    <article className="section-prods-infos">
                        <p>...</p>
                    </article>
                </section>
            </>}
            {userCJ.uAdmin===false && <section className="section-prods"><p className="p-impact">Vous n'etes pas autorisé à acceder à ces informations</p></section>}
            <div className="main-down"></div>
        </main>

    )
}

export default Adherents;