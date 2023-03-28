import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAoXdllaM0yCUSG-NXgWJmhwphu9A7ulzw",
  authDomain: "myblog-4830f.firebaseapp.com",
  projectId: "myblog-4830f",
  storageBucket: "myblog-4830f.appspot.com",
  messagingSenderId: "329738032376",
  appId: "1:329738032376:web:bc26148b98be12bfbc570d",
  measurementId: "G-HGJ5XTRTSG",
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider, storage };
export default db;
