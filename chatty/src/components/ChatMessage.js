
export default function ChatMessage({ message, user }) {
    const { text, uid, photoURL } = message;
  
    const messageClass = uid === user.uid ? "sent" : "received";
  
    return (
      <>
        <div className={`message ${messageClass}`}>
          <img
            src={
              photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
            }
            alt=""
          />
          <p>{text}</p>
        </div>
      </>
    );
  }
  