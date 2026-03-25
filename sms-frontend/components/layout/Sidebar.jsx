"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/styles/sidebar.module.css"

const menus = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "นักศึกษา", href: "/students" },
  { label: "อาจารย์", href: "/instructors" },
  { label: "รายวิชา", href: "#" },
  { label: "ภาควิชา", href: "#" },
  { label: "หลักสูตร", href: "#" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileBox}>
        <div className={styles.avatar}>ผ</div>
        <div>
          <div className={styles.name}>ผู้ดูแล ระบบ</div>
          <div className={styles.role}>ผู้ดูแลระบบ</div>
        </div>
      </div>

      <div className={styles.menuList}>
        {menus.map((menu) => {
          const active = pathname === menu.href

          if (menu.href === "#") {
            return (
              <div key={menu.label} className={`${styles.menuItem} ${styles.disabled}`}>
                {menu.label}
              </div>
            )
          }

          return (
            <Link
              key={menu.label}
              href={menu.href}
              className={`${styles.menuItem} ${active ? styles.active : ""}`}
            >
              {menu.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}