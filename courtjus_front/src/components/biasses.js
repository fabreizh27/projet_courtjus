import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import BiassesProducteurs from './biassesProducteurs'
import {useEffect, useState} from 'react';
import {useSelector} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { NavLink } from "react-router-dom";

const Biasses = (props) =>{

    const {userCJ, userMenu} = useSelector(state => state);
    const [biasses, setBiasses] = useState([]);


    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/biasses`)
          .then(response => response.json())
          .then(res => {
            setBiasses(res);
          });
      }, []);
  


    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}
             
                <section className='main-title'>
                     <p>Marchés / Biasses</p>
                </section>
                {biasses.map((q, i) =>
                    <section className={`section-prods section-prods-form ${q.bActif && 'section-prods-actif' }`} key={i}>
                        <img src="/img/farmer_market.png" alt="Biasse" className="float-prods"/>
                        <article className="section-prods-fiche">
                           {userCJ.uAdmin &&<div className="btn-detail">
                                <NavLink to={`/biasses/${q.bNum}`} aria-label="Modifier la fiche" title="modifier la fiche"><img src="/img/edit_R.png"  alt="Modifier la Biasse" /></NavLink>	
                            </div>	}
                            <h2> {q.bLibelle}.</h2>
                            <p className="p-impact"> Le {q.bDate.substring(8,10)}/{q.bDate.substring(5,7)}/{q.bDate.substring(0,4)}</p>
                            <h3>Commande entre 
                                le <span className='p-impact'>{q.bDateCdeIni.substring(8,10)}/{q.bDateCdeIni.substring(5,7)}/{q.bDateCdeIni.substring(0,4)} </span>
                                 et le <span className='p-impact'>{q.bDateCdeEnd.substring(8,10)}/{q.bDateCdeEnd.substring(5,7)}/{q.bDateCdeEnd.substring(0,4)}</span>
                            </h3>
                        </article>
                        <article className="section-prods-infos">
                            <p>{q.bComment}</p>
                        </article>
                        <article className="section-prods-infos">
                            <BiassesProducteurs bParticipants={q.bParticipants} />
                        </article>
                    </section>
                )}
                {userCJ.uAdmin && <section className="section-prods  section-prods-form">
                <NavLink to={`/biasses/0`} aria-label="Ajouter un marché / une biasse" title="Ajouter un marché / une biasse"><img src="/img/farmer_market.png"  alt="Biasse" className="float-prods"/></NavLink>
                    <article className="section-prods-fiche ">
                        <p>
                            <NavLink to={`/biasses/0`} aria-label="Ajouter un marché / une biasse" title="Ajouter un marché / une biasse"><img src="/img/storefront_add.png"  alt="Ajouter une biasse" /></NavLink>
                        </p>
                    </article>
                </section>}
                <div className="main-down"></div>

        </main>

    )
}

export default Biasses;