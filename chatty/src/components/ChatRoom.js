import {
	addDoc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { messagesRef, groupId } from "../lib/config";
import ChatMessage from "./ChatMessage";
import { foundProfanity } from "./profanityFilter";
import ProfanityFilter from "./profanityFilter";

function msgSort(msgA, msgB) {
	return msgA.createdAt.seconds - msgB.createdAt.seconds;
}
/**
 * getMessages - fetches new messages in chats
 * @param {user} sender
 * @param {user} receiver
 * @returns
 */
async function getMessages(sender, receiver) {
	const messages = [];

	if (receiver.uid !== groupId) {
		//Fetch chat messages

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
	} else {
		//Fetch group Messages
		const msgQuery = query(messagesRef, orderBy("createdAt"), limit(1000));
		const [groupSnapshot] = await Promise.all([getDocs(msgQuery)]);
		if (groupSnapshot.empty) return [];
		groupSnapshot.docs.forEach((doc) => messages.push(doc.data()));
	}
	return messages.sort(msgSort);
}

export default function ChatRoom({ user, selectedUser }) {
	const [formValue, setFormValue] = useState("");
    //const [profanity, ProfanityFilter] = useState(false);
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
		// const receiverMsgQuery = query(
		// 	messagesRef,
		// 	where("uid", "==", selectedUser.uid),
		// 	where("selectedUid", "==", user.uid),
		// 	limit(1000)
		// );
		// const unsubscribe = onSnapshot(receiverMsgQuery, () => {
		// 	getAllMessages();
		// });

		// return () => unsubscribe();
		setTimeout(() => {
			getAllMessages();
		}, 2000);
	});

	useEffect(() => {
		if (messages && messages?.length > 0) {
			mainRef.current?.scrollTo(0, mainRef.current?.scrollHeight);
		}
	}, [messages]);

	/**
	 * sendMessage send the message to the database
	 * @param {*} e
	 */
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
	};

	// const handleSubmit = (e) => {
	// 	e.preventDefault();
	// 	const hasBadWords = ProfanityFilter(formValue);
	// 	if (hasBadWords) {
	// 		alert("Text cannot be sent!! It contains a bad word");
	// 	}
	// 	setFormValue("");
	// };

	return (
		<>
			<main className="chat-messages-container" ref={mainRef}>
				{messages &&
					messages.map((msg, i) => (
						<ChatMessage key={i} message={msg} user={user} />
					))}
			</main>

			<form onSubmit={sendMessage} className="send-message-form">
				<ProfanityFilter input={formValue}>
					<p>Profanity!</p>
                    
				</ProfanityFilter>

				<input
					value={formValue}
					onChange={(e) => setFormValue(e.target.value)}
					placeholder="Type a message..."
				/>

				<button type="submit" disabled={foundProfanity }>
					Send
				</button>
			</form>
		</>
	);
}
