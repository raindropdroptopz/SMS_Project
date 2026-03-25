import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Student Management System</h1>
          <p className={styles.subtitle}>
            Hello
          </p>
        </div>
      </div>
    </div>
  );
}