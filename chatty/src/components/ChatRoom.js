import {
	addDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	onSnapshot,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { db, messagesRef, usersRef } from "../lib/config";
import ChatMessage from "./ChatMessage";

function msgSort(msgA, msgB) {
	return msgA.createdAt.seconds - msgB.createdAt.seconds;
}

async function getMessages(sender, receiver) {
	const messages = [];
	const senderMsgQuery = query(
		messagesRef,
		where("uid", "==", sender.uid),
		where("selectedUid", "==", receiver.uid),
		limit(1000)
	);
	const receiverMsgQuery = query(
		messagesRef,
		where("uid", "==", receiver.uid),
		where("selectedUid", "==", sender.uid),
		limit(1000)
	);
	const [senderSnapshot, receiverSnapshot] = await Promise.all([
		getDocs(senderMsgQuery),
		getDocs(receiverMsgQuery),
	]);
	if (senderSnapshot.empty && receiverSnapshot.empty) return [];

	senderSnapshot.docs.forEach((doc) => messages.push(doc.data()));
	receiverSnapshot.docs.forEach((doc) => messages.push(doc.data()));

	return messages.sort(msgSort);
}

export default function ChatRoom({ user, selectedUser }) {
	const [formValue, setFormValue] = useState("");
	const [messages, setMessages] = useState();
	const mainRef = useRef();
	const { uid, photoURL } = user;

	const getAllMessages = useCallback(() => {
		getMessages(user, selectedUser)
			.then((msgs) => {
				setMessages(msgs);
			})
			.catch(console.log);
	}, [user, selectedUser]);

    useEffect(() => {
        // check for our received messages
        const receiverMsgQuery = query(
            messagesRef,
            where("uid", "==", selectedUser.uid),
            where("selectedUid", "==", user.uid),
            limit(1000)
        );
        const unsubscribe = onSnapshot(receiverMsgQuery, () => {
            getAllMessages();
        })

        return () => unsubscribe()
    }, [])


	useEffect(() => {
		if (messages && messages?.length > 0) {
			mainRef.current?.scrollTo(0, mainRef.current?.scrollHeight);
		}
	}, [messages]);

	const sendMessage = async (e) => {
		e.preventDefault();

		await addDoc(messagesRef, {
			text: formValue,
			createdAt: serverTimestamp(),
			uid,
			photoURL,
			selectedUid: selectedUser.uid,
		});
		setFormValue("");
        getAllMessages();
	};

	return (
		<>
			<main className="chat-messages-container" ref={mainRef}>
				{messages &&
					messages.map((msg, i) => (
						<ChatMessage key={i} message={msg} user={user} />
					))}
			</main>

			<form onSubmit={sendMessage} className="send-message-form">
				<input
					value={formValue}
					onChange={(e) => setFormValue(e.target.value)}
					placeholder="Type a message..."
				/>

				<button type="submit" disabled={!formValue}>
					Send
				</button>
			</form>
		</>
	);
}
