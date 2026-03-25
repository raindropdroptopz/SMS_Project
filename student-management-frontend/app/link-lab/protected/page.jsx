"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../ProtectedPage.module.css";

export default function ProtectedPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("demo_token");

    if (!token) {
      router.replace("/link-lab/login?next=/link-lab/protected");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className={styles.container}>
        <p className={styles.muted}>กำลังตรวจสอบสิทธิ์...</p>
      </div>
    )
  };

  function handleLogout() {
    localStorage.removeItem("demo_token");
    router.replace("/link-lab/login");
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Protected Page</h2>
        <p className={styles.desc}>
          หน้านี้จะแสดงเฉพาะเมื่อะบ <b>demo_token</b> ใน <b>localStorage</b>
        </p>

        <div className={styles.infoBox}>
          <div className={styles.infoBox}>
            <span className={styles.label}>สถานะ:</span>
            <span className={styles.value}>ผ่านการตรวจสอบแล้ว</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>token key:</span>
            <span className={styles.code}>demo_token</span>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.dangerBtn}>
          Logout (ลบ Token)
        </button>

        <p className={styles.hint}>
          หมายเหตุ: เพื่อทดสอบ flow ให้เปิด <code>/link-lab/protected</code> ในหน้าต่างใหม่หรือทดลองลบ token แล้วรีเฟรชหน้า
        </p>
      </div>
    </main>
  );
}