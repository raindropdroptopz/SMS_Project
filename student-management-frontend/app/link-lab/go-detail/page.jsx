"use client";

import { useRouter } from "next/navigation";
import styles from "../GoDetailPage.module.css";

export default function goDetailPage() {
  const router = useRouter();

  const students = [
    { id: "1", name: "Alice"},
    { id: "2", name: "Bob"},
    { id: "3", name: "Chai"},
  ];

  function goToDetail(id) {
    router.push(`/link-lab/students/${id}`);
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>คลิกทั้งแถวเพื่อไปหน้า Detail</h1>

      <div className={styles.list}>
        {students.map((s) => (
          <div
            key={s.id}
            onClick={() => goToDetail(s.id)}
            className={styles.row}
          >
            <span className={styles.name}>{s.name}</span>
            <span className={styles.arrow}> → </span>
          </div>
        ))}
      </div>
    </main>
  );
}