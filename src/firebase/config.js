import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyA5BIheOQ_qBTyvBvtHQ95bPWL-Xh3wm60",
//   authDomain: "dev-farmhouse.firebaseapp.com",
//   projectId: "dev-farmhouse",
//   storageBucket: "dev-farmhouse.appspot.com",
//   messagingSenderId: "203145139807",
//   appId: "1:203145139807:web:5e04a3eb188895b841edea",
//   measurementId: "G-42TVCVF37Q",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBQzPIJT2TKhdR4a_okCE07kQdwMYcowAM",
  authDomain: "farmful-16dfb.firebaseapp.com",
  databaseURL: "https://farmful-16dfb-default-rtdb.firebaseio.com",
  projectId: "farmful-16dfb",
  storageBucket: "farmful-16dfb.appspot.com",
  messagingSenderId: "594334357756",
  appId: "1:594334357756:web:5996863aec5d8ac061df79",
  measurementId: "G-MQ223W6MNC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
