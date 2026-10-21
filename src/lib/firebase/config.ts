import { initializeApp, getApp, getApps,  type FirebaseApp} from "firebase/app"
import { type Analytics, getAnalytics, isSupported} from "firebase/analytics"
import {env} from "./env"

const firebaseConfig = {
     apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId,
}
const app: FirebaseApp = getApps.length > 0  ? getApp() : initializeApp(firebaseConfig);
export const analytics: Promise<Analytics | null> = isSupported().then((supported) => 
   supported ? getAnalytics(app) : null
)
export default app;