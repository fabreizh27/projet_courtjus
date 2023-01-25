import { VIEW_MENU, HIDE_MENU, CONNECT_USER, DECONNECT_USER, INSERT_USER, UPDATE_USER, INSERT_BIASSE, UPDATE_BIASSE, DELETE_BIASSE, INSERT_ARTICLE, UPDATE_ARTICLE, UPDATE_CDESLIGNES } from '../constants/actions';

// afficher menu utilisateur ou la demande de connection
export const viewMenu = () => {
    return {
        type: VIEW_MENU
    };
};

// masquer menu utilisateur ou la demande de connection
export const hideMenu = () => {
    return {
        type: HIDE_MENU
    };
};

// connection utilisateur
export const connectUser = payload => {
    return {
        type: CONNECT_USER, payload
    };
};

// deconnecter l'utilisateur
export const deconnectUser = () => {
    return {
        type: DECONNECT_USER
    };
};

// creer un nouvel utilisateur
export const insertUser = payload => {
    return {
        type: INSERT_USER, payload
    };
};

// modifier les infos d'un utilisateur
export const updateUser = payload => {
    return {
        type: UPDATE_USER, payload
    };
};

// creer une nouvelle Biasse / marché
export const insertBiasse = payload => {
    return {
        type: INSERT_BIASSE, payload
    };
};

// modifier les infos d'une biasse
export const updateBiasse = payload => {
    return {
        type: UPDATE_BIASSE, payload
    };
};

// supprimer une biasse
export const deleteBiasse = payload => {
    return {
        type: DELETE_BIASSE, payload
    };
};

// creer un nouvel article a la vente
export const insertArticle = payload => {
    return {
        type: INSERT_ARTICLE, payload
    };
};

// modifier un article a la vente
export const updateArticle = payload => {
    return {
        type: UPDATE_ARTICLE, payload
    };
};

// modifier ou ajouter une pre-commande
export const updateCdesLignes = payload => {
    return {
        type: UPDATE_CDESLIGNES, payload
    };
};


