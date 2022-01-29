import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, query } from "firebase/firestore";
import config from './config'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject  } from "firebase/storage";

const app = initializeApp(config);

const db = getFirestore(app);
const storage = getStorage(app);

const audiosRef = collection(db, "audios");

export const getData = async () => {
    const q = query(audiosRef);
    const querySnapshot = await getDocs(q);
    const items = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        items.push(doc.data())
    });
    return items
};

export const getBlobs = async (id) => {
    let audioUrl;
    await getDownloadURL( ref(storage, 'audios/' + id)).then((url) => {
        audioUrl = url;
    })
    return audioUrl;
}

export const writeData = async (rec) => {
    await setDoc(doc(audiosRef, rec[0].id), rec[0], { merge: true });
}

export const writeBlobs = async (blob, rec) => {

    const storageRef = ref(storage, 'audios/' + rec[0].id);

    // This is not working, looks like is paid service
    uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });
}

export const deleteData = async(id) => {
    const storageRef = ref(storage, 'audios/' + id);
    await deleteDoc(doc(audiosRef, id)).then(() =>
    deleteObject(storageRef).then(() => {
        console.log('File deleted successfully')
      }).catch((error) => {
        console.log('Uh-oh, an error occurred!')
      })
    );
}