import { getDocs, onSnapshot, query, where } from "firebase/firestore";
import { auth, usersRef } from "../lib/config";
import { useCallback, useEffect, useState } from "react";

async function getOtherUsers () {
    const usersQuery = query(usersRef, where("uid", "!=", auth.currentUser.uid));
    const usersSnapshot = await getDocs(usersQuery);
    if (usersSnapshot.empty)
        return []
    return usersSnapshot.docs.map((doc) => doc.data());
}

export default function LeftPanel({ onSelectUser }) {
    const [users, setUsers] = useState([])
  
    const handleUserClick = useCallback((user) => {
        onSelectUser(user);
    }, [onSelectUser]);

    const fetchAllOtherUsers = useCallback(() => {
        getOtherUsers()
            .then(data => setUsers(data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        // actively check for new users in the database
        const usersQuery = query(
            usersRef,
        );
        const unsubscribe = onSnapshot(usersQuery, () => {
            fetchAllOtherUsers();
        })

        return () => unsubscribe()
    }, [])
  
    return (
      <div className="left-panel">
        {users?.map((user, i) => (
            <div
              key={i}
              className="user-item"
              onClick={() => handleUserClick(user)}
            >
              <div className="avatar-container">
                <img src={user.photoURL} alt={user.displayName} />
              </div>
              <p className="display-name">{user.displayName}</p>
            </div>
          ))}
      </div>
    );
  }  