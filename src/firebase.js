import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDo7QCPEaYQ8FxYPDNGL8ow522RDIHHZOU",
  authDomain: "fir-todoapp-634ed.firebaseapp.com",
  projectId: "fir-todoapp-634ed",
  storageBucket: "fir-todoapp-634ed.appspot.com",
  messagingSenderId: "905629517589",
  appId: "1:905629517589:web:c91f2f74e6f6f3cb260b1c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };