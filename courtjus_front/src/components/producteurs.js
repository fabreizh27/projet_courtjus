import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import {useEffect, useState} from 'react';
import {useSelector} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { NavLink } from "react-router-dom";

const Producteurs = (props) =>{

    const [producteurs, setProducteurs] = useState([]);
    const [filtre, setFiltre] = useState([]);
	const {userMenu} = useSelector(state => state);

    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/producteurs`)
          .then(response => response.json())
          .then(res => {
            setProducteurs(res);
          });
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
            <section className='main-title'><p>Les producteurs</p></section>
            <section className="nav-admin">
                <p><NavLink to="/articles" aria-label="voir les Articles à la vente" title="voir les Articles à la vente"><img src="/img/grass.png" alt="voir les Articles à la vente" /><img src="/img/nutrition.png" alt="Voir les Articles à la vente" /><img src="/img/liquor.png" alt="Voir les Articles à la vente" /><img src="/img/spa.png" alt="Voir les Articles à la vente" /></NavLink></p>
            </section>
            {producteurs.map((q, i) =>
			    <section className="section-prods" key={i}>
                    <img src={`/img/pictures/${q.uPhotoProfil}`} alt="la photo du 1er article" className="float-prods" />
                    <article className="section-prods-fiche">
                        <h2>{q.uStructure}</h2>
                        <p className="p-impact"><span className="span-light">({q.uNum})</span>  {q.uProduction}</p>
                        <h3>{q.uPrenom} {q.uNom}</h3>
                        <p>{q.uMailPro && q.uMailPro}{q.uMailPro==="" && q.uMail}</p>
                        <p>{q.uTel}</p>
                        <p>{q.uAdr_CP} {q.uAdr_Ville}</p>
                        <div className="btn-detail">
                            <NavLink  aria-label="voir plus" title="voir plus"><img src="img/double_arrow_DG.png" alt="voir plus" /></NavLink>
                        </div>	
                    </article>
                    <article className="section-prods-infos">
                        <p>{q.uInfosComp}</p>
                    </article>
                </section>
            )}
            <div className="main-down"></div>

        </main>

    )
}

export default Producteurs;