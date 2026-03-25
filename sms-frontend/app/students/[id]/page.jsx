"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ProtectedPage from "@/components/auth/ProtectedPage"
import AdminLayout from "@/components/layout/AdminLayout"
import { apiFetch } from "@/lib/api"
import styles from "../students.module.css"

export default function StudentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStudent() {
      try {
        const result = await apiFetch(`/students/${id}`)
        setStudent(result.data)
      } catch (err) {
        setError(err.message || "ไม่สามารถโหลดข้อมูลนักศึกษาได้")
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [id])

  if (loading) return (
    <ProtectedPage>
      <AdminLayout>
        <div className={styles.container}>
          <p className={styles.subtitle}>กำลังโหลดข้อมูลนักศึกษา...</p>
        </div>
      </AdminLayout>
    </ProtectedPage>
  )

  if (error) return (
    <ProtectedPage>
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.errorBox}>{error}</div>
          <button onClick={() => router.back()} className={`${styles.btn} ${styles.secondaryBtn}`}>ย้อนกลับ</button>
        </div>
      </AdminLayout>
    </ProtectedPage>
  )

  return (
    <ProtectedPage>
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>รายละเอียดนักศึกษา</h1>
              <p className={styles.subtitle}>จัดการและดูข้อมูลส่วนตัวของนักศึกษาภายในระบบ</p>
            </div>
            <div className={styles.actions}>
              <Link href={`/students/${id}/edit`} className={`${styles.btn} ${styles.primaryBtn}`}>
                แก้ไขข้อมูล
              </Link>
              <button onClick={() => router.back()} className={`${styles.btn} ${styles.secondaryBtn}`}>
                ย้อนกลับ
              </button>
            </div>
          </div>

          <div className={styles.profileHeader}>
            <div className={styles.avatarCircle}>
              {student.first_name_th?.[0] || "?"}
            </div>
            <div className={styles.profileInfo}>
              <h2>{student.prefix}{student.first_name_th} {student.last_name_th}</h2>
              <span className={`${styles.badge} ${student.status === 'active' ? styles.badgeActive : styles.badgeInactive}`}>
                {student.status === 'active' ? 'ปกติ' : student.status}
              </span>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span>📝</span> ข้อมูลพื้นฐาน
              </div>
              <div className={styles.field}>
                <label className={styles.label}>รหัสนักศึกษา</label>
                <div className={styles.value}>{student.student_no}</div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>เลขบัตรประชาชน</label>
                <div className={styles.value}>{student.citizen_id || "-"}</div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>เพศ</label>
                <div className={styles.value}>{student.gender === 'M' ? 'ชาย' : student.gender === 'F' ? 'หญิง' : student.gender || "-"}</div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span>📞</span> ข้อมูลการติดต่อ
              </div>
              <div className={styles.field}>
                <label className={styles.label}>อีเมล</label>
                <div className={styles.value}>{student.email || "-"}</div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>เบอร์โทรศัพท์</label>
                <div className={styles.value}>{student.phone || "-"}</div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>วันเกิด</label>
                <div className={styles.value}>
                  {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString("th-TH") : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedPage>
  )
}
