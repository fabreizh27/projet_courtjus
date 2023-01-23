import React from 'react';
import {useEffect, useState} from 'react';
import { URL_COURTJUS_BACK } from '../constants/sources.js';


const BiassesProducteurs = (props) =>{


    const [producteurs, setProducteurs] = useState([]);


    useEffect(() => {
        const list = [];
        fetch(`${URL_COURTJUS_BACK}/producteurs`)
          .then(response => response.json())
          .then(res => {
            res.forEach(producteur => {
                const found = props.bParticipants.find(element => element === producteur.uNum);
                if (found) {list.push(producteur.uStructure)}

            });

            setProducteurs(list);
          });
      }, []);


    return(

		<p>{producteurs.map((q, i) =><span className='biasse-list-particip' key={i}>{q}</span>)}</p>

    )
}

export default BiassesProducteurs;