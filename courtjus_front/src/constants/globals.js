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
    "bLibelle": "",
    "bComment": "",
    "bDate": new Date(),
    "bDateCdeIni": new Date(),
    "bDateCdeEnd": new Date(),
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