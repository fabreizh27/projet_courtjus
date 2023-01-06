import React from 'react';
import { NavLink } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux"


const UserNav = (props) =>{
    const {userCJ} = useSelector(state => state);
    const userNum = userCJ.uNum;


    return(
        <>
        {userNum!=0 &&
            <section className="nav-admin">
                <NavLink to="#" aria-label="Me deconnecter" title="Me deconnecter"><img src="/img/user_off.png" /></NavLink>
                <NavLink to="#" aria-label="Modifier ma Fiche" title="Modifier ma Fiche">ma Fiche</NavLink>
                <NavLink to="#" aria-label="Voir mon Panier" title="Voir mon Panier">mon Panier</NavLink>
                <NavLink to="#" aria-label="Voir les Commandes" title="Voir les Commandes">Commandes</NavLink>
                <NavLink to="#" aria-label="Gérer les Articles à la vente" title="Gérer les Articles à la vente">Articles</NavLink>
                <NavLink to="#" aria-label="Gérer les Marchés" title="Gérer les Marchés">Marchés</NavLink>	
                <NavLink to="#" aria-label="Gérer les Membres" title="Gérer les Membres">Membres</NavLink>
            </section>
        }
        </>
    )
}

export default UserNav;