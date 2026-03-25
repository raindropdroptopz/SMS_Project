"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { setToken, isLoggedIn } from "@/lib/auth"
import styles from "./login.module.css"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   if (isLoggedIn()) {
  //     router.push("/dashboard")
  //   }
  // }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })

      const token = result.token || result.accessToken || result.data?.token

      if (!token) {
        throw new Error("ไม่พบ token จากระบบ backend")
      }

      setToken(token)
      router.push("/dashboard")
    } catch (err) {
      setError(err.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div className={styles.logo}>S</div>
          <h1 className={styles.title}>ระบบจัดการข้อมูลนักศึกษา</h1>
          <p className={styles.subtitle}>Student Management System</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.formGroup}>
            <label>ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

        </form>
      </div>
    </div>
  )
}