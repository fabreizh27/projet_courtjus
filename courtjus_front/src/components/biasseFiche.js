import React from 'react';
import UserNav from './userNav';
import UserConnect from './userConnect';
import { useParams } from "react-router-dom";
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux"
import { URL_COURTJUS_BACK } from '../constants/sources.js';
import { BIASSE_INIT } from '../constants/globals';
import { updateBiasse, insertBiasse } from '../actions/actions-types';
import Select from "react-select";

const BiasseView = (props) =>{

    const {userCJ, userMenu} = useSelector(state => state);
    const dispatch = useDispatch()

	const { postId } = useParams();
    const [biasseFiche, setBiasseFiche] = useState([]);
    const [producteurs, setProducteurs] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState();


    useEffect(() => {
        const list =[]
        fetch(`${URL_COURTJUS_BACK}/producteurs`)
          .then(response => response.json())
          .then(res => {
            res.forEach(element => {
                list.push({ value: element.uNum, label: element.uStructure })
            });
            setProducteurs(list);
          });
      }, []);

 
    useEffect(() => {
        fetch(`${URL_COURTJUS_BACK}/biasse/${postId}`)
        .then(response => response.json())
        .then(res => {
            if (res===null) {
                setBiasseFiche(BIASSE_INIT);
            } else {
                res.bDate=res.bDate.substring(0,10)
                res.bDateCdeIni=res.bDateCdeIni.substring(0,10)
                res.bDateCdeEnd=res.bDateCdeEnd.substring(0,10)
                setBiasseFiche(res);
                const list =[]
                fetch(`${URL_COURTJUS_BACK}/producteurs`)
                  .then(response => response.json())
                  .then(resP => {
                    resP.forEach(pElem => {
                        const found = res.bParticipants.find(element => element === pElem.uNum);
                        if (found) {list.push({ value: pElem.uNum, label: pElem.uStructure })}
                    });
                    setSelectedOptions(list);
                  });
        
            }
        });
    }, []);
    
    const handleChange = (event) => {
        const {name, value} = event.target;
        setBiasseFiche(oldFiche => { return {...biasseFiche,[name]: value, bMsg : ""}; });
        event.preventDefault();
    };

    const handleDownCB = (event) => {
        const {name, value} = event.target;
        let newValue=false
        value==="false" ? newValue=true : newValue=false
        setBiasseFiche(oldFiche => { return {...biasseFiche,[name]: newValue}; });
        event.preventDefault();
    };
    const handleUpCB = (event) => {
        // obligé de faire les modif en deux fois car la case à cochée ne s'actualisait (visuellement) qu'a l'action suivante !
        setBiasseFiche(oldFiche => { return {...biasseFiche,bMsg : ""}; });
    };
    const handleChangeCB = (event) => {
        // fonction pour ne pas que react identifie une erreur
    };

    function handleSelect(data) {
        setSelectedOptions(data);
        const list=[]
        data.forEach(element => {
            list.push(element.value)
        });
        setBiasseFiche(oldFiche => { return {...biasseFiche,bParticipants: list}; });
    };
    
    function checkDate(inputDate) {
        var re = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
        return re.test(inputDate);
    }

    
    const handleSubmit = (event) => {
        event.preventDefault();
        let errMsg="";
        if (biasseFiche.bLibelle.length<10) {
            errMsg="Le libellé de la Biasse est trop court (10 car) !";
        };
        if (!checkDate(biasseFiche.bDate)) {
            errMsg="La date de la biasse n'est pas valide !";
        };
        if (!checkDate(biasseFiche.bDateCdeIni)) {
            errMsg="La date de début des commandes n'est pas valide !";
        };
        if (!checkDate(biasseFiche.bDateCdeEnd)) {
            errMsg="La date de fin des commandes n'est pas valide !";
        };
        if (errMsg) {
            setBiasseFiche(oldUser => { return {...biasseFiche,bMsg : errMsg}; });
        };
        if (biasseFiche.bNum===0) {
            // Ajout d'un utilisateur
            dispatch(insertBiasse({biasseFiche}))
            errMsg="Biasse Ajoutée !"
            setBiasseFiche(oldUser => { return {...biasseFiche,bMsg : errMsg}; });

        } else {
            // Modification d'un utilisateur
            dispatch(updateBiasse({biasseFiche})) 
            errMsg="Informations mises à jour !"
            setBiasseFiche(oldUser => { return {...biasseFiche,bMsg : errMsg}; });
        }
    };



    return(
        <main>
            <div className="main-down"></div>
            {userMenu===true && <UserNav />}
            {userMenu===true && <UserConnect />}
            {userCJ.uAdmin &&
                <>
                    { biasseFiche.bMsg && <section className="section-prods-err"><p>{biasseFiche.bMsg}</p></section> }
                    <section className="section-prods section-prods-form">
                        <form method="POST" id="formBiasse" encType="multipart/form-data" disabled={!userCJ.uAdmin} onSubmit={handleSubmit}>
                            <img src="/img/farmer_market.png" alt="Biasse" className="float-prods"/>
                            <article className="section-prods-fiche form-fiche">
                                <fieldset disabled={!userCJ.uAdmin}>
                                    <legend>infos Biasse / marché <span className='span-light'>({biasseFiche.bNum})</span></legend>
                                    <p><input type="hidden" name="bNum" id="bNum" value={biasseFiche.bNum}/></p>
                                    <p><label htmlFor="bLibelle">Nom</label> <input className="input-default" type="text" name="bLibelle" id="bLibelle" value={biasseFiche.bLibelle} required onChange={handleChange} /></p>
                                    <p><label htmlFor="bDate">Date</label> <input className="input-default" type="date" name="bDate" id="bDate" value={biasseFiche.bDate} required onChange={handleChange} /></p>
                                    <p><label htmlFor="bDateCdeIni">Debut des Cdes</label> <input className="input-default" type="date" name="bDateCdeIni" id="bDateCdeIni" value={biasseFiche.bDateCdeIni} required onChange={handleChange} /></p>
                                    <p><label htmlFor="bDateCdeEnd">fin des Cdes</label> <input className="input-default" type="date" name="bDateCdeEnd" id="bDateCdeEnd" value={biasseFiche.bDateCdeEnd} required onChange={handleChange} /></p>
                                    <p>        
                                        <label className="check" htmlFor="bActif"> Actif</label>
                                        <input type="checkbox" id="bActif" name="bActif" checked={biasseFiche.bActif} value={biasseFiche.bActif} onMouseDown={handleDownCB} onMouseUp={handleUpCB} onChange={handleChangeCB}/>
                                    </p>
                                </fieldset>

                            </article>
                            <article className="section-prods-infos form-fiche">
                                <fieldset  disabled={!userCJ.uAdmin}>
                                    <legend>Producteurs presents</legend>
                                    <div className="dropdown-container">
                                        <Select
                                        options={producteurs}
                                        placeholder="Select color"
                                        value={selectedOptions}
                                        onChange={handleSelect}
                                        isSearchable={true}
                                        isMulti
                                        />
                                    </div>

                                </fieldset>
                                <fieldset  disabled={!userCJ.uAdmin}>
                                    <legend>Infos comp.</legend>
                                    <p><textarea className="input-area" name="bComment" id="bComment" onChange={handleChange} value={biasseFiche.bComment}></textarea></p>
                                </fieldset>
                                <fieldset disabled={!userCJ.uAdmin} className="btn-detail">
                                    <legend>Actions</legend>
                                    <button id="fiche-sav">Enregistrer</button>
                                </fieldset>
                            </article>
                            <section className="nav-admin"><p className="section-prods-err">{biasseFiche.bMsg}</p></section>
                            <section className="nav-admin"><p className="btn-detail"><img src="/img/delete.png"  alt="supprimer la biasse" /></p></section>
                        </form>
                    </section>
                    <div className="main-down"></div>
                </>
            }
            { userCJ.uAdmin===false &&
                <section className="section-prods"><p className="p-impact">Vous n'etes pas autorisé à acceder à ces informations</p></section>
            }
        </main>

    )
}

export default BiasseView;