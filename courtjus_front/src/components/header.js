import React from 'react';
import { NavLink } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import { viewMenu, hideMenu } from '../actions/actions-types';


const Header = (props) =>{

	const dispatch = useDispatch();
	const {userMenu} = useSelector(state => state);


	const clickOn = (event) => {
        dispatch(viewMenu());
    };

	const clickOff = (event) => {
		dispatch(hideMenu());
	};

    return(


		<header>
			<NavLink to="./" aria-label="Accueil" title="Court-Jus - Accueil"><img id="logo-max" src="/img/court_jus_transparent.png" alt="Court-Jus" /><img id="logo-min" src="/img/court_jus_logo.png" alt="Court-Jus" /></NavLink>
            <nav>
				{!userMenu && <NavLink className="btn-admin" aria-label="admin" onClick={clickOn} title="admin"><img src="/img/manage.png" alt="menu utilisateur"/></NavLink>}
				{userMenu && <NavLink className="btn-admin" aria-label="admin" onClick={clickOff} title="admin"><img src="/img/manage_user.png" alt="masquer le menu utilisateur"/></NavLink>}
    		    <NavLink to="./travel/1" aria-label="Qui sommes nous" title="Qui sommes nous">Qui sommes nous</NavLink>
    		    <NavLink to="./producteurs" aria-label="Nos Producteurs" title="Nos Producteurs">Nos Producteurs</NavLink>
    		    <NavLink to="./biasses" aria-label="Les Biasses - Les Marchés" title="Les Biasses - Les Marchés">Les Biasses - Les Marchés</NavLink>
            </nav>
		</header>

    )
}

export default Header;