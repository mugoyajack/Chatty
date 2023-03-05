import { auth } from "../lib/config";

export default function SignOut() {
    return (
      auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>
          Sign Out
        </button>
      )
    );
  }
  