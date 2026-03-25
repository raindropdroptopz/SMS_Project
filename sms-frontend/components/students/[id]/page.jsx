"use client"

import { useEffect, useState, startTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ProtectedPage from "@/components/auth/ProtectedPage"
import AdminLayout from "@/components/layout/AdminLayout"
import { apiFetch } from "@/lib/api"
import styles from "./student-detail.module.css"

export default function StudentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStudent() {
      const res = await apiFetch(`/students/${id}`).catch((err) => { throw err })
      startTransition(() => {
        setStudent(res.data)
        setLoading(false)
      })
    }
    fetchStudent().catch((err) => {
      startTransition(() => {
        setError(err.message || "ไม่พบข้อมูลนักศึกษา")
        setLoading(false)
      })
    })
  }, [id])

  function Row({ label, value }) {
    return (
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value || "-"}</span>
      </div>
    )
  }

  return (
    <ProtectedPage>
      <AdminLayout>
        <div className={styles.wrapper}>

          <div className={styles.topBar}>
            <button onClick={() => router.back()} className={styles.backBtn}>← กลับ</button>
            {student && (
              <Link href={`/students/${id}/edit`} className={styles.editBtn}>แก้ไขข้อมูล</Link>
            )}
          </div>

          {loading && <p className={styles.loading}>กำลังโหลด...</p>}
          {error && <p className={styles.error}>{error}</p>}

          {student && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {student.first_name_th?.[0] || "?"}
                </div>
                <div>
                  <h1 className={styles.name}>
                    {student.prefix}{student.first_name_th} {student.last_name_th}
                  </h1>
                  {student.first_name_en && (
                    <p className={styles.nameEn}>{student.first_name_en} {student.last_name_en}</p>
                  )}
                  <span className={`${styles.badge} ${styles[student.status]}`}>{student.status}</span>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>ข้อมูลทั่วไป</h2>
                <Row label="รหัสนักศึกษา" value={student.student_no} />
                <Row label="เลขบัตรประชาชน" value={student.citizen_id} />
                <Row label="เพศ" value={student.gender} />
                <Row label="วันเกิด" value={student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString("th-TH") : null} />
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>ช่องทางติดต่อ</h2>
                <Row label="อีเมล" value={student.email} />
                <Row label="เบอร์โทรศัพท์" value={student.phone} />
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>ข้อมูลการลงทะเบียน</h2>
                <Row label="วันที่เพิ่มข้อมูล" value={student.created_at ? new Date(student.created_at).toLocaleString("th-TH") : null} />
              </div>
            </div>
          )}

        </div>
      </AdminLayout>
    </ProtectedPage>
  )
}
