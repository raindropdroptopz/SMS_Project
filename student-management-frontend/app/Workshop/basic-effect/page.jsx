"use client";

import { useEffect,useState } from "react";

export default function BasicCounterPage() {
  const [message, setMessage] = useState("Loading....");

  useEffect(() => {
    setMessage("Component mounted successfulyy");
  }, []);

  return (
    <dev style={{padding: 16}}>
      <h1>use Effect Demo</h1>
      <p>{message}</p>
    </dev>
  );
}