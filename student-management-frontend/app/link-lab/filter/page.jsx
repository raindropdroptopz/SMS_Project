"use client";

import { useRouter } from "next/navigation";
import styles from "../FilterPage.module.css";

export default function FilterPage() {
  const router = useRouter();

  function goToProgram(program) {
    if (program) {
      router.push(`/link-lab/students?program=${program}`);
    } else {
      router.push(`/link-lab/students`);
    }
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>เลือก Program</h1>
      <div className={styles.buttonGroup}>
        <button
          onClick={() => goToProgram("SE")}
          className={styles.primaryBtn}
          >
            Program SE
        </button>
        <button
          onClick={() => goToProgram("CS")}
          className={styles.secondaryBtn
          }>
            Program CS
        </button>
        <button
         onClick={() => goToProgram("")}
         className={styles.outlineBtn}
         >
          All Programs
        </button>
      </div>
    </main>
  );
}