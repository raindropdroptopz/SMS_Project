"use client"

import { useEffect, useState, startTransition } from "react"
import Link from "next/link"
import ProtectedPage from "@/components/auth/ProtectedPage"
import AdminLayout from "@/components/layout/AdminLayout"
import { apiFetch } from "@/lib/api"
import styles from "./dashboard.module.css"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [statsRes, activityRes, meRes] = await Promise.all([
        apiFetch("/dashboard/stats").catch(() => null),
        apiFetch("/dashboard/recent-activity?limit=5").catch(() => null),
        apiFetch("/auth/me").catch(() => null),
      ])
      startTransition(() => {
        if (statsRes?.data) setStats(statsRes.data)
        if (activityRes?.data) setActivities(activityRes.data)
        if (meRes?.data) setUser(meRes.data)
        setLoading(false)
      })
    }
    fetchData()
  }, [])

  return (
    <ProtectedPage>
      <AdminLayout>
        <div className={styles.wrapper}>

          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>ยินดีต้อนรับเข้าสู่ระบบ Student Management System</p>
            </div>
            {user && (
              <div className={styles.userCard}>
                <div className={styles.userAvatar}>{user.username?.[0]?.toUpperCase()}</div>
                <div>
                  <div className={styles.userName}>{user.username}</div>
                  <div className={styles.userRole}>{user.role}</div>
                  {user.last_login && (
                    <div className={styles.userLogin}>
                      เข้าสู่ระบบล่าสุด: {new Date(user.last_login).toLocaleString("th-TH")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <p className={styles.loading}>กำลังโหลดข้อมูล...</p>
          ) : (
            <>
              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.blue}`}>
                  <div className={styles.statNumber}>{stats?.total_students ?? "-"}</div>
                  <div className={styles.statLabel}>นักศึกษาทั้งหมด</div>
                </div>
                <div className={`${styles.statCard} ${styles.green}`}>
                  <div className={styles.statNumber}>{stats?.total_instructors ?? "-"}</div>
                  <div className={styles.statLabel}>อาจารย์ทั้งหมด</div>
                </div>
                <div className={`${styles.statCard} ${styles.purple}`}>
                  <div className={styles.statNumber}>{stats?.total_courses ?? "-"}</div>
                  <div className={styles.statLabel}>รายวิชาทั้งหมด</div>
                </div>
                <div className={`${styles.statCard} ${styles.orange}`}>
                  <div className={styles.statNumber}>{stats?.active_sections ?? "-"}</div>
                  <div className={styles.statLabel}>กลุ่มเรียนทั้งหมด</div>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>กิจกรรมล่าสุด</h2>
                  <Link href="/students" className={styles.seeAll}>ดูนักศึกษาทั้งหมด →</Link>
                </div>
                {activities.length === 0 ? (
                  <p className={styles.empty}>ไม่มีกิจกรรมล่าสุด</p>
                ) : (
                  <ul className={styles.activityList}>
                    {activities.map((item, i) => (
                      <li key={i} className={styles.activityItem}>
                        <span className={`${styles.activityDot} ${styles[item.type]}`} />
                        <span className={styles.activityText}>{item.text}</span>
                        <span className={styles.activityTime}>
                          {item.time ? new Date(item.time).toLocaleDateString("th-TH") : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

        </div>
      </AdminLayout>
    </ProtectedPage>
  )
}
