import React from 'react';
import { NavLink } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux"


const Footer = (props) =>{

    return(

        <footer>
		    <img className="logo-footer" src="/img/court_jus_transparent.png" alt="Court-Jus" />
			<p>Association pour une consommation critique et solidaire</p>
			<p><NavLink href="mailto:court.jus.asso@gmail.com" aria-label="contact" title="contact">Nous-contacter</NavLink></p>
		    <img className="logo-footer" src="/img/court_jus_logo.png" alt="Court-Jus" />
		</footer>

    )
}

export default Footer;