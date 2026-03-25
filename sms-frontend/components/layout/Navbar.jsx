"use client"

import { removeToken } from "@/lib/auth"
import styles from "@/styles/navbar.module.css"

export default function Navbar() {
  function handleLogout() {
    removeToken()
    window.location.href = "/login"
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.brand}>SMS System</div>
      <button onClick={handleLogout} className={styles.button}>ออกจากระบบ</button>
    </div>
  )
}