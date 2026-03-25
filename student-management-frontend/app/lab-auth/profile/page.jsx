"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"

export default function ProfilePage() {
  const router = useRouter();

  function goToDashboard() {
    router.push("/lab-auth/dashboard");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/lab-auth/login");
    }
  }, [router]);

  return (
    <div>
      <h1 className={styles.title}>Profiles</h1>
      <button className={styles.button} onClick={goToDashboard}>
        Dashboard
      </button>
    </div>
  )
}