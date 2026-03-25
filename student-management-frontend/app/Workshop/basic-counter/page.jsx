"use client";

import { useState } from "react";

export default function BasicCounterPage() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 16 }}>
      <h1>Basic Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: 8 }}>-1</button>
    </div>
  )
}