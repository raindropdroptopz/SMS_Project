import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import styles from "@/styles/admin-layout.module.css"

export default function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}