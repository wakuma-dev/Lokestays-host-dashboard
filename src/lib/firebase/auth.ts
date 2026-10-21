import { getAuth, type Auth, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth"
import app from "./config";
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const auth: Auth = getAuth(app);