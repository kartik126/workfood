import { db } from "../config";
import { collection, doc, setDoc } from "firebase/firestore";

// ADD
export const addDocument = (documentData, collectionName) =>
  new Promise((resolve, reject) => {
    const newCourseRef = doc(collection(db, collectionName));
    setDoc(newCourseRef, {
      ...documentData,
      id: newCourseRef?.id,
    })
      .then(() => resolve({ status: true, data: newCourseRef?.id }))
      .catch((error) => reject({ status: false, data: null, error }));
  });
