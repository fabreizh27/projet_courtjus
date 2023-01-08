import React from 'react';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux"
import { connectUser } from '../actions/actions-types';
import { NavLink } from "react-router-dom";

const UserConnect = (props) =>{

	const {userCJ} = useSelector(state => state);
	const dispatch = useDispatch()

	const [user, setUser] = useState({email:"", mdp :"", msg:""});

    const handleSubmit = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        setUser(oldUser => { return {...user,[name]: value,}; });

		fetch('http://localhost:8080/userconnect', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
             },

        })
            .then(res => res.json())
            .then(data => {
                if (data===null) {
                    setUser(oldUser => { return {...user,msg: "Mot de passe ou adresse mail incorrect ! "}; });
                } else {
                    setUser(oldUser => { return {...user,msg: "Bonjour " + data[0].uPrenom,}; });
                    dispatch(connectUser({data}))
                }
            })
            .catch(err => console.error(err));

    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setUser(oldUser => { return {...user,[name]: value,}; });
        event.preventDefault();
      };
    

    const userNum = userCJ.uNum;


    return(

        <section className="nav-admin">
           {userNum===0 &&
            <form method="POST" id="formConnect" onSubmit={handleSubmit}>
                Mail 
                <input type="email" name="email" id="email" value={user.email} onChange={handleChange} required /> 
                Mot de passe 
                <input type="password" id="mdp" name="mdp" value={user.mdp} onChange={handleChange} required /> 
                <button>&gt;&gt;</button>
            </form>
            }
            {user.msg && <div id="divConnect"> {user.msg} </div> }
        </section>

    )
}

export default UserConnect;