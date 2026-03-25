"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddStudentExample() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  async function handlesubmit(e) {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    router.push("/link-lab/");
  }

  return (
    <div style={{maxWidth: 420,margin: "40px auto", padding: 24,border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05", fontFamily: "sans-serif"}}>

      <h2 style={{ marginBottom: 16}}>Add Student (Demo)</h2>

      <form onSubmit={handlesubmit}>
        <div style={{ marginBottom: 16}}>
          <label style={{display: "block", marginBottom: 6 }}>
            Student Name
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            required style={{width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc"}}></input>
        </div>

        <button type="submit" disabled={loading}
          style={{ width: "100%", padding: 10,backgroundColor: loading ? "#9ca3af" : "#2563eb",color: "#fff",
            border: "none", borderRadius: 6,cursor: loading ? "not-allowed" : "pointer", frontWeight: 600
          }}> {loading ? "Saving...." : "Save Student"}</button>
      </form>
    </div>
  )
}