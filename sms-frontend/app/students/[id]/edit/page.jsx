"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ProtectedPage from "@/components/auth/ProtectedPage"
import AdminLayout from "@/components/layout/AdminLayout"
import { apiFetch } from "@/lib/api"
import styles from "../../students.module.css"

export default function StudentEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    student_no: "",
    first_name_th: "",
    last_name_th: "",
    email: "",
    phone: "",
    status: ""
  })

  useEffect(() => {
    async function fetchStudent() {
      try {
        const result = await apiFetch(`/students/${id}`)
        const s = result.data
        setFormData({
          student_no: s.student_no,
          first_name_th: s.first_name_th,
          last_name_th: s.last_name_th,
          email: s.email || "",
          phone: s.phone || "",
          status: s.status
        })
      } catch (err) {
        setError(err.message || "ไม่สามารถโหลดข้อมูลนักศึกษาได้")
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      await apiFetch(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      })
      router.push(`/students/${id}`)
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <ProtectedPage>
      <AdminLayout>
        <div className={styles.container}>
          <p className={styles.subtitle}>กำลังโหลดข้อมูล...</p>
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
              <h1>แก้ไขข้อมูลนักศึกษา</h1>
              <p className={styles.subtitle}>ตรวจสอบและแก้ไขข้อมูลส่วนบุคคลของนักศึกษาในฐานข้อมูล</p>
            </div>
            <div className={styles.actions}>
               <button onClick={() => router.back()} className={`${styles.btn} ${styles.secondaryBtn}`}>
                ยกเลิก
              </button>
            </div>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>รหัสนักศึกษา</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={formData.student_no}
                    onChange={(e) => setFormData({...formData, student_no: e.target.value})}
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>สถานะนักศึกษา</label>
                  <select 
                    className={styles.selectInput}
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">ปกติ (Active)</option>
                    <option value="inactive">พ้นสภาพ (Inactive)</option>
                    <option value="graduated">สำเร็จการศึกษา (Graduated)</option>
                    <option value="suspended">พักการเรียน (Suspended)</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>ชื่อ (ภาษาไทย)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={formData.first_name_th}
                    onChange={(e) => setFormData({...formData, first_name_th: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>นามสกุล (ภาษาไทย)</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={formData.last_name_th}
                    onChange={(e) => setFormData({...formData, last_name_th: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>อีเมล</label>
                  <input
                    type="email"
                    className={styles.textInput}
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="08X-XXX-XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formFooter}>
                <button type="button" onClick={() => router.back()} className={`${styles.btn} ${styles.secondaryBtn}`}>
                  ยกเลิก
                </button>
                <button type="submit" className={`${styles.btn} ${styles.primaryBtn}`} disabled={submitting}>
                  {submitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </ProtectedPage>
  )
}
