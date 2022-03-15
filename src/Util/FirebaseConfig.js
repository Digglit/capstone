import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBPCDdEsIGrYwg6AeyqGQTkgaVfbhJD6jU",
    authDomain: "capstone-e8949.firebaseapp.com",
    databaseURL: "https://capstone-e8949-default-rtdb.firebaseio.com",
    projectId: "capstone-e8949",
    storageBucket: "capstone-e8949.appspot.com",
    messagingSenderId: "336397968821",
    appId: "1:336397968821:web:41a4b1aef962f91114e5fc"
};  

const firebase = initializeApp(firebaseConfig);

const database = getDatabase(firebase);

export default database;