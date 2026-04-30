import { useState, useEffect, useRef } from "react";

function DocGeeChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ✅ Auto-scroll
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Greeting message
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text:
          "Hello 👋 I be DocGee. I no be doctor, but I fit give basic health advice.",
      },
    ]);
  }, []);

  const sendMessage = async (text) => {
    const messageToSend = text || input;
    if (!messageToSend) return;

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();
      // console.log(data);
      
      
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: messageToSend },
        { sender: "bot", text: data.reply
       }, // 👈 IMPORTANT (STRING ONLY)
      ]);

      setInput("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: messageToSend },
        {
          sender: "bot",
          text: "Network error. Try again.",
        },
      ]);
    }
  };

  const quickOptions = [
    "Headache 🤕",
    "Fever 🌡",
    "Malaria 🦟",
    "Cough 😷",
    "Stomach pain 🤢",
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.avatar}>🤖</div>
        <div>
          <h2 style={styles.title}>DocGee</h2>
          <p style={styles.subtitle}>Health Assistant</p>
        </div>
      </div>

      {/* CHAT BOX */}
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={
              m.sender === "user"
                ? styles.userMessage
                : styles.botMessage
            }
          >
           {typeof m.text === "string" ? (
            m.text
           ) : (
            <div>
              <p><b>EN:</b> {m.text.en}</p>
              <p><b>PIDGIN:</b>{m.text.pidgin}</p>
            </div>
           )} 
          </div>
        ))}

        {/* AUTO SCROLL TARGET */}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK BUTTONS */}
      <div style={styles.buttons}>
        {quickOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => sendMessage(option)}
            style={styles.button}
          >
            {option}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type symptom..."
        />
        <button style={styles.sendBtn} onClick={() => sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    backgroundColor: "#0f172a",
    color: "white",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#1e293b",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  title: {
    margin: 0,
    fontSize: "18px",
  },

  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  },

  userMessage: {
    backgroundColor: "#2563eb",
    padding: "10px",
    borderRadius: "15px",
    margin: "5px 0",
    alignSelf: "flex-end",
    maxWidth: "70%",
  },

  botMessage: {
    backgroundColor: "#1e293b",
    padding: "10px",
    borderRadius: "15px",
    margin: "5px 0",
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
 buttons: {
    marginBottom: "10px",
  },

  button: {
    margin: "5px",
    padding: "8px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },

  inputArea: {
    display: "flex",
    gap: "5px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
  },

  sendBtn: {
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#22c55e",
    border: "none",
    cursor: "pointer",
  },
};

export default DocGeeChat;