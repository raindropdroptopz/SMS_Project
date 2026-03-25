"use client"

import { useState, useEffect, startTransition } from "react"
import { apiFetch } from "@/lib/api"
import styles from "@/styles/student-form.module.css"

export default function StudentForm({ initialData = {}, onSubmit, submitLabel = "บันทึกข้อมูล" }) {
  const [formData, setFormData] = useState({
    student_no: initialData.student_no || "",
    first_name_th: initialData.first_name_th || "",
    last_name_th: initialData.last_name_th || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    program_id: initialData.program_id || "",
    status: initialData.status || "active",
  })
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPrograms() {
      const res = await apiFetch("/programs").catch(() => null)
      startTransition(() => {
        if (res?.data) setPrograms(res.data)
      })
    }
    fetchPrograms()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await onSubmit({ ...formData, program_id: Number(formData.program_id) })
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>

        <div className={styles.group}>
          <label>รหัสนักศึกษา</label>
          <input name="student_no" value={formData.student_no} onChange={handleChange} className={styles.input} required />
        </div>

        <div className={styles.group}>
          <label>ชื่อ (ภาษาไทย)</label>
          <input name="first_name_th" value={formData.first_name_th} onChange={handleChange} className={styles.input} required />
        </div>

        <div className={styles.group}>
          <label>นามสกุล (ภาษาไทย)</label>
          <input name="last_name_th" value={formData.last_name_th} onChange={handleChange} className={styles.input} required />
        </div>

        <div className={styles.group}>
          <label>สาขาวิชา</label>
          <select name="program_id" value={formData.program_id} onChange={handleChange} className={styles.input} required>
            <option value="">-- เลือกสาขาวิชา --</option>
            {programs.map((p) => (
              <option key={p.program_id} value={p.program_id}>
                {p.name_th} ({p.code})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label>อีเมล</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.group}>
          <label>เบอร์โทรศัพท์</label>
          <input name="phone" value={formData.phone} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.group}>
          <label>สถานะ</label>
          <select name="status" value={formData.status} onChange={handleChange} className={styles.input}>
            <option value="active">กำลังศึกษา</option>
            <option value="graduated">สำเร็จการศึกษา</option>
            <option value="suspended">พักการศึกษา</option>
          </select>
        </div>

      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "กำลังบันทึก..." : submitLabel}
      </button>
    </form>
  )
}
