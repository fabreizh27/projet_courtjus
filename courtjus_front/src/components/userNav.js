import React from 'react';
import { NavLink } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux"
import { deconnectUser } from '../actions/actions-types';


const UserNav = (props) =>{
    const {userCJ} = useSelector(state => state);
    const userNum = userCJ.uNum;
    const userAdherent = userCJ.uAdherent;
    const userProducteur = userCJ.uProducteur;
    const userCommission = userCJ.uCommission;
    const userAdmin = userCJ.uAdmin;
    let secuCommandes = false;
    if (userProducteur || userCommission || userAdmin) {secuCommandes=true};
    let secuArticles = false;
    if (userProducteur || userAdmin) {secuArticles=true};
    
	const dispatch = useDispatch();

	const deconnect = (event) => {
        dispatch(deconnectUser());
    };


    return(
        <>
        {userNum!=0 &&
            <section className="nav-admin">
                {userAdherent &&<NavLink to="#" aria-label="Me deconnecter" onClick={deconnect} title="Me deconnecter"><img src="/img/user_off.png" alt="Me deconnecter" /></NavLink>}
                {userAdherent &&<NavLink to="/userfiche" aria-label="Modifier ma Fiche" title="Modifier ma Fiche"><img src="/img/manage_user.png" alt="Modifier ma Fiche" /></NavLink>}
                {userAdherent &&<NavLink to="/jecommande" aria-label="Pré-Commander" title="Pré-Commander"><img src="/img/add_shopping.png" alt="Pré-Commander" /></NavLink>}
                {userAdherent &&<NavLink to="#" aria-label="Voir mon Panier" title="Voir mon Panier"><img src="/img/shopping_list.png" alt="Voir mon Panier" /></NavLink>}
                {secuCommandes &&<NavLink to="#" aria-label="Voir les Commandes" title="Voir les Commandes"><img src="/img/shopping_check.png" alt="Voir les commandes"/><img src="/img/list.png" alt="Voir les Commandes" /></NavLink>}
                {secuArticles &&<NavLink to="/articles" aria-label="Gérer les Articles à la vente" title="Gérer les Articles à la vente"><img src="/img/grass.png" alt="Gérer les Articles à la vente" /><img src="/img/nutrition.png" alt="Gérer les Articles à la vente" /><img src="/img/liquor.png" alt="Gérer les Articles à la vente" /><img src="/img/spa.png" alt="Gérer les Articles à la vente" /></NavLink>}
                {userAdmin &&<NavLink to="/biasses" aria-label="Gérer les Marchés" title="Gérer les Marchés"><img src="/img/storefront.png" alt="Gérer les Marchés" /><img src="/img/storefront.png" alt="Gérer les Marchés" /></NavLink>}	
                {userAdmin &&<NavLink to="/adherents" aria-label="Gérer les Membres" title="Gérer les Membres"><img src="/img/users.png" alt="gerer les membres"/><img src="/img/users.png" alt="Gérer les Membres" /></NavLink>}
            </section>
        }
        </>
    )
}

export default UserNav;