import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const calculateDocumentSize = async (collectionName, docId) => {
  try {
    const documentRef = doc(db, collectionName, docId);
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
      const docData = documentSnapshot.data();
      const jsonString = JSON.stringify(docData);
      const sizeInBytes = new TextEncoder().encode(jsonString).length;

      console.log(`Document size: ${sizeInBytes} bytes`);
      return sizeInBytes;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error calculating document size: ", error);
    return null;
  }
};
