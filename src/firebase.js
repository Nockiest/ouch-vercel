 

import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc, updateDoc, collection, onSnapshot , query} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes,getDownloadURL } from 'firebase/storage';
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
const storage = getStorage();
const colRef = collection(db, 'files');
export { db,colRef, auth, provider, storage };
// Create a reference with an initial file path and name
 
const pathReference = ref(storage, 'files/Another%file_adf_OndřejLukeš hanluk@seznam.cz_7608bb02-0e03-4e94-9703-acb9512ddeb6_ ');

// Create a reference from a Google Cloud Storage URI
const gsReference = ref(storage, 'gs://bucket/files/stars.jpg');

// Create a reference from an HTTPS URL
// Note that in the URL, characters are URL escaped!
// const httpsReference = ref(storage, 'https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');  

 
// Create a reference to the file we want to download
 
const filesRef = ref(storage, `files/hello_something_OndřejLukeš hanluk@seznam.cz_3f35f6f0-72bc-4f6d-884e-8cdd7b7b6da0_`);

// Get the download URL
export const downloadURLFinder = (downloadURL) => {
let result = null

  getDownloadURL(downloadURL)
  .then((url) => {
    console.log(0,url, pathReference)
    result = url
  })
  .catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        console.log(1)
        break;
      case 'storage/unauthorized':
             console.log(2)// User doesn't have permission to access the object
        break;
      case 'storage/canceled':
           console.log(3)  // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
           console.log(4)  // Unknown error occurred, inspect the server response
        break;
    }
  });


  return result
}
  

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

 