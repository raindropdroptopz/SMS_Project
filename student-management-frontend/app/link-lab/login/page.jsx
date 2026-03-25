'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/link-lab';

  function handleLogin() {
    localStorage.setItem('demo_token', 'ok');

    router.replace(next)
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Login (Demo)</h2>

      <p className={styles.desc}>
        หน้านี้ใข้สำหรับจำลองการLoginโดยกดปุ่มเพื่อสร้าง<b>demo_token</b>
        ใน <b>localStorage</b> แล้วระบบจะนำไปยังปลายทาง
      </p>

      <button onClick={handleLogin} className={styles.primaryBtn}>
        Login
      </button>
      <p className={styles.hint}>
        หลัง Login ระบบจะพากลับไแยังหน้าเดิมผ่านพารามิเตอร์ <code>next</code>
        <br />
        ตัวอย่าง: <code>/link-lab/login?next=/link-lab/protected</code>
      </p>
    </div>
  )
}
