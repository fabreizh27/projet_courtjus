import { VIEW_MENU, HIDE_MENU, CONNECT_USER, DECONNECT_USER, INSERT_USER, UPDATE_USER } from '../constants/actions';
import { USER_INIT } from '../constants/globals';

let stateInit = {
        msg:"",
        userMenu:false,
        userCJ: USER_INIT
    }

let coursjusReducer = (state = stateInit, action = {}) => {
    const { userCJ, msg, userMenu } = state;
      
    switch (action.type) {
        

        case VIEW_MENU:
            console.log("VIEW_MENU");
            console.log(userMenu);
            return { ...state,
                userMenu:true
                }

        case HIDE_MENU:
            console.log("HIDE_MENU");
            console.log(userMenu);
            return { ...state,
                userMenu:false
                }
        
        case CONNECT_USER:
            console.log("CONNECT_USER");
            const { data  } = action.payload;
            return { ...state,
                userCJ: data[0],
                msg:""
                }

        case DECONNECT_USER:
            console.log("DECONNECT_USER");
            return { ...state,
                userCJ: USER_INIT
                }

        case INSERT_USER:
            console.log("INSERT_USER");
            const { user  } = action.payload;

            fetch('http://localhost:8080/insertUser', {
                method: 'POST',
                body: JSON.stringify(user),
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    },
    
            })
                .then(res => res.json())
                .catch(err => console.error(err));

        case UPDATE_USER:
            console.log("UPDATE_USER");

            fetch('http://localhost:8080/updateUser', {
                method: 'POST',
                body: JSON.stringify(action.payload.user),
    
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    },
    
            })
                .then(res => res.json())
                .catch(err => console.error(err));
            
        

            return { ...state,
                msg:""
                }
                                        
        default:
            return state;
    }

    return state
}

export default coursjusReducer;