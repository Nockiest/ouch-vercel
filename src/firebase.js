// import { initializeApp } from "firebase/app";
// // import firebase from 'firebase/compat/app';
// // import 'firebase/compat/auth';
// import { getAuth } from "firebase/auth";
// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);

// export default auth;

import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc, updateDoc, collection, onSnapshot , query} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyC1tsEH0k0ZQ6iUHUOxjAsA6ypYOQh6qsU",
    authDomain: "fileshraingapp.firebaseapp.com",
    projectId: "fileshraingapp",
    storageBucket: "fileshraingapp.appspot.com",
    messagingSenderId: "973775377545",
    appId: "1:973775377545:web:53747856538339a639e258"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const colRef = collection(db, 'files');
export { db,colRef, auth, provider, storage };

export const signInWithGoogle = () => {
 return signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result, "xyz");
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      console.log(name, email, profilePic);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
      return result
    //   window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUserAuthentication = async () => {
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });

  return user;
};

export const checkUserAccess = async () => {
  try {
    const user = await getUserAuthentication();
    if (user) {
      const userEmail = user.email;
      if (userEmail === 'hanluk@seznam.cz') {
        console.log('User has access to the Firebase database');
        return true;
      } else {
        console.log('User does not have access to the Firebase database');
        return false;
      }
    } else {
      console.log('No user is signed in');
      return false;
    }
  } catch (error) {
    console.log('Error occurred:', error);
  }
};

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user);
  } else {
    console.log('User has signed out');
  }
});

export const fetchPosts = async () => {
  const colRef = collection(db, 'BlogPosts');
  const snapshot = await onSnapshot(colRef);
  const postsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return postsData;
};

 