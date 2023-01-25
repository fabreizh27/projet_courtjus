// fiche utilisateur vierge (initialisation de la session à vide et d'une fiche utilisateur vierge pour l'ajout)
export const USER_INIT = {
    "_id": {},
    "uNum": 0,
    "uNom": "",
    "uPrenom": "",
    "uMail": "",
    "uMailPro": "",
    "uPass": "",
    "uTel": "",
    "uInfosComp": "",
    "uStructure": "",
    "uProduction": "",
    "uVente": "",
    "uAdr_L1": "",
    "uAdr_L2": "",
    "uAdr_L3": "",
    "uAdr_CP": "",
    "uAdr_Ville": "",
    "uReferents": "",
    "uPhotoProfil": "profil.png",
    "uPhotos": "",
    "uActif": false,
    "uAdherent": false,
    "uCommission": false,
    "uProducteur": false,
    "uAdmin": false,
    "uDateCreat": new Date(),
    "uDateLastConnect": new Date(),
};

export const BIASSE_INIT = {
    "_id": {},
    "bNum": 0,
    "bLibelle": "Biasse à Créer",
    "bComment": "",
    "bDate": "01/01/2020",
    "bDateCdeIni": "01/01/2020",
    "bDateCdeEnd": "01/01/2020",
    "bParticipants":[],
    "bActif": false 
};

export const ARTICLE_INIT = {
    "_id": {},
    "aNum": 0,
    "aNumProducteur": 0,
    "aLibelle": "Nouvel Article",
    "aMesure": "kg",
    "aUnitNb": 0,
    "aUnitPrice": 0,
    "aCalculable": false, // non utilisé en V1
    "aPrecision": "",
    "aEnVente": true, // non utilisé en V1
    "aComment": ""
};

export const CDE_INIT = {
    "_id": {},
    "cProducteur": 0,
    "cUser": 0,
    "cArticle": 0,
    "cNombre": 0,
    "cCommentaire": "",
    "CArticleLib": "",
    "cBiasse": 0
  };