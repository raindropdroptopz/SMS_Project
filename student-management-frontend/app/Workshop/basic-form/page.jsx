"use client";

import { useState } from "react";

export default function BasicCounterPage() {
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");

  return (
    <div style={{ padding: 16 }}>
      <h1>Basic Form</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type Smth"
      />
      <p>You typed: {message || "(empty)"}</p>


      <input
        value={message2}
        onChange={(e) => setMessage2(e.target.value)}
        placeholder="Type Smth"
      />
      <p>You typed: {message2 || "(empty)"}</p>
    </div>
      
  );
}