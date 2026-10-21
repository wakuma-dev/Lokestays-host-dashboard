import { Firestore, getFirestore } from "firebase/firestore";
import  app  from "./config"
export const db: Firestore = getFirestore(app)