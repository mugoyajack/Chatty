import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/config";

const provider = new GoogleAuthProvider();

export default function SignIn() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
    };
  
    return (
      <>
        <button className="sign-in" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </>
    );
  }
  