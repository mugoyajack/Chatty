import "./App.css";
import { useState, useCallback, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import LeftPanel from "./components/LeftPanel";
import SignOut from "./components/SignOut";
import SignIn from "./components/SignIn";
import ChatRoom from "./components/ChatRoom";
import { auth, db, usersRef } from "./lib/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

function App() {
  const [user] = useAuthState(auth);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return
    setLoading(false)
  }, [user])

  const handleSelectUser = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const addUser = useCallback(async () => {
    const userDoc = doc(db, "users", user.uid);
    const docSnapshot = await getDoc(userDoc);
    if (!docSnapshot.exists()) {
        const username = prompt("Please enter a username:");
        setDoc(userDoc, {
            uid: user.uid,
            photoURL: user.photoURL,
            displayName: username || "Anonymous",
        });
    }
}, [user]);

useEffect(() => {
	if (auth.currentUser) {
		addUser();
	}
}, [addUser]);

  return (
    <div className="App">
      <header>
        <h1>Chatty ⚛️ WebApp</h1>
        <SignOut />
      </header>

      <main>
        {user ? <LeftPanel onSelectUser={handleSelectUser} /> : null}

        <section>
          {user && selectedUser ? (
            <ChatRoom
              user={user}
              selectedUser={selectedUser}
              usersRef={usersRef}
            />
          ) : null} 

          {(!loading && !auth.currentUser) ? <SignIn /> : null}
        </section>
      </main>
    </div>
  );
}


export default App;
