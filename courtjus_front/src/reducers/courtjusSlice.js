import { VIEW_MENU, HIDE_MENU, CONNECT_USER, DECONNECT_USER, INSERT_USER, UPDATE_USER, INSERT_BIASSE, UPDATE_BIASSE, DELETE_BIASSE } from '../constants/actions';
import { USER_INIT } from '../constants/globals';

let stateInit = {
        msg:"", //message d'alerte si besoin
        userMenu:false, // affichage menu utilisateur ou la demande de connection
        userCJ: USER_INIT // session utilisateur
    }

let coursjusReducer = (state = stateInit, action = {}) => {
    const { userCJ, msg, userMenu } = state;
      
    switch (action.type) {
        

        case VIEW_MENU:
            // afficher menu utilisateur ou la demande de connection
            return { ...state,
                userMenu:true
                }

        case HIDE_MENU:
            // masquer menu utilisateur ou la demande de connection
            return { ...state,
                userMenu:false
                }
        
        case CONNECT_USER:
           // connection utilisateur
            const { data  } = action.payload;
            return { ...state,
                userCJ: data[0],
                msg:""
                }

        case DECONNECT_USER:
            // deconnecter l'utilisateur
            return { ...state,
                userCJ: USER_INIT
                }

        case INSERT_USER:
            // creer un nouvel utilisateur
            fetch('http://localhost:8080/insertUser', {
                method: 'POST',
                body: JSON.stringify(action.payload.userFiche),    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    },    
            })
                .then(res => res.json())
                .catch(err => console.error(err));
                return state;
                   

        case UPDATE_USER:
            // modifier les infos d'un utilisateur
             fetch('http://localhost:8080/updateUser', {
                method: 'POST',
                body: JSON.stringify(action.payload.userFiche),    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    },    
            })
                .then(res => res.json())
                .catch(err => console.error(err));
            return { ...state,
                msg:"utilisateur modifié"
                }


        case INSERT_BIASSE:
            // creer une nouvelle biasse un nouveau marché
            fetch('http://localhost:8080/insertBiasse', {
                method: 'POST',
                body: JSON.stringify(action.payload.biasseFiche),    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    },
                })
                .then(res => res.json())
                .catch(err => console.error(err));
            return state;
                    

        case UPDATE_BIASSE:
            // modifier une biasse un marché
                fetch('http://localhost:8080/updateBiasse', {
                method: 'POST',
                body: JSON.stringify(action.payload.biasseFiche),    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    },    
            })
                .then(res => res.json())
                .catch(err => console.error(err));
            return { ...state,
                msg:"utilisateur modifié"
                }
                                                
        case DELETE_BIASSE:
            // supprimer une biasse un marché
                fetch('http://localhost:8080/deleteBiasse', {
                method: 'POST',
                body: JSON.stringify(action.payload.biasseFiche),    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    },    
            })
                .then(res => res.json())
                .catch(err => console.error(err));
            return { ...state,
                msg:"utilisateur modifié"
                }
                                                        
        default:
            return state;
    }

    return state
}

export default coursjusReducer;