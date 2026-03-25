"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./loginpage.module.css"

export default function LabLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("กรุณากรอก email & password ให้ครบถ้วน");
      return;
    }

    const fakeToken = `lab-token-${Date.now()}`;
    localStorage.setItem("token",fakeToken);

    router.push("/lab-auth/dashboard");
  }
  
return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lab Login</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <input 
          className={styles.input} 
          placeholder="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />

        <input 
          className={styles.input} 
          type="password" 
          placeholder="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />

        <button className={styles.button} type="submit">
          Login
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  )
}