import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import { useParams } from "react-router-dom";
import {useEffect, useState} from 'react';
import {useSelector} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';

const Travel = (props) =>{

	const { postId } = useParams();
	const {userMenu} = useSelector(state => state);

    const [page, setPage] = useState([]);
    const [elements, setElements] = useState([]);

    let pageNum=0;
    typeof(postId)==="undefined" ? pageNum=1 : pageNum=postId;
	useEffect(() => {
      fetch(`${URL_COURTJUS_BACK}/travel/${pageNum}`)
        .then(response => response.json())
        .then(res => {
            if (res.length>0) {
                setPage(res[0]);
            } else {
                fetch(`${URL_COURTJUS_BACK}/travel/1`)
                .then(response => response.json())
                .then(res => {
                    setPage(res[0]);
                });
            }
        });
    }, []);

    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/travelelements/${pageNum}`)
          .then(response => response.json())
          .then(res => {
            setElements(res);
            console.log(res)
          });
      }, []);
  



    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}

		    <h1>{page.pTitre}</h1>
            {elements.map((q, i) =>
                <article key={i}>
                    <h2>{q.eTitre}</h2>
                    <img src={`/img/pictures/${q.ePhoto}`} alt="la photo du 1er article" className={`float-${q.eType}`} />
                    <p>{q.eText}</p>
                    <div className="stop"></div>
                </article>
            )}
        </main>

    )
}

export default Travel;