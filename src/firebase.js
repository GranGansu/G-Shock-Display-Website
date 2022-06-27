import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc
} from "firebase/firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxfiJ4J0-EMqcKCBS9_3S2W9QIIhfyi50",
    authDomain: "proyecto-react-sprint-9.firebaseapp.com",
    databaseURL: "https://proyecto-react-sprint-9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "proyecto-react-sprint-9",
    storageBucket: "proyecto-react-sprint-9.appspot.com",
    messagingSenderId: "191998500037",
    appId: "1:191998500037:web:f360b0f04a9bbc90c464ac"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const db = getFirestore(app);

export const getFavorites = (uid, setState) => {
    const getAllFavorites = ref(database, 'me/favorite/' + uid)
    onValue(getAllFavorites, (snapshot) => {
        const favoritos = snapshot.val()
        setState(favoritos)
    })
}
export const addFavorite = (uid, modeloReloj, objeto) => {
    const objetito = JSON.parse(objeto)
    set(ref(database, 'me/favorite/' + uid + '/' + modeloReloj), {
        ...objetito
    })
}
export const deleteFavorite = (modeloReloj, uid = auth.currentUser.uid) => {
    set(ref(database, 'me/favorite/' + uid + '/' + modeloReloj), {
    })
}
export const login = async (email, password, funcion, setError) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        funcion('/')
    } catch (error) {
        setError(error.code)
    }
}
export const registerWithEmailAndPassword = async (name, email, password, funcion, setState) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
        setState('')
        funcion()
    } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
            setState('Este e-mail ya está registrado')
        }
        else {
            setState(err.code)
        }
    }
};
export {
    auth,
    db,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword
};