import { VIEW_MENU, HIDE_MENU, CONNECT_USER, DECONNECT_USER, INSERT_USER, UPDATE_USER } from '../constants/actions';

// payload correspond à ce que vous allez passer comme valeur à votre action { ... name : "Super basket", force : 10 }

export const viewMenu = () => {
    console.log("switchMenu");
    return {
        type: VIEW_MENU
    }
};

export const hideMenu = () => {
    console.log("switchMenu");
    return {
        type: HIDE_MENU
    }
};

export const connectUser = payload => {
    console.log("connectUser");
    return {
        type: CONNECT_USER, payload
    }
};

export const deconnectUser = () => {
    console.log("deconnectUser");
    return {
        type: DECONNECT_USER
    }
};

export const insertUser = payload => {
    console.log("insertUser");
    return {
        type: INSERT_USER, payload
    }
};
export const updateUser = payload => {
    console.log("updateUser");
    return {
        type: UPDATE_USER, payload
    }
};




