"use client"

import { useEffect } from "react"
import { useRouter  } from "next/navigation"
import styles from "./dashboardpage.module.css"

export default function LabDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/lab-auth/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/lab-auth/login");
  }

  function goToProfile() {
    router.push("/lab-auth/profile")
  }

  return (
    <div className={styles.containter}>
      <h1 className={styles.title}>Lab Dashboard (Protected)</h1>
      <p className={styles.subtitle}>หน้านี้เป็น Protected Page และตรวจสอบสิทธิ์</p>
      <button className={styles.button} onClick={handleLogout}>
        Logout
      </button>
      <button className={styles.button} onClick={goToProfile}>
        Profile
      </button>
      <hr className={styles.hr} />
    </div>
  );
}