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
    "uDateCreat": new Date()
}

export const BIASSE_INIT = {
    "_id": {},
    "bNum": 0,
    "bLibelle": "",
    "bComment": "",
    "bDate": new Date(),
    "bDateCdeIni": new Date(),
    "bDateCdeEnd": new Date(),
    "bParticipants":[] 
}