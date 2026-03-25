"use client"

import { useEffect, useState, startTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import ProtectedPage from "@/components/auth/ProtectedPage"
import AdminLayout from "@/components/layout/AdminLayout"
import StudentForm from "@/components/students/StudentForm"
import { apiFetch } from "@/lib/api"

export default function EditStudentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStudent() {
      const res = await apiFetch(`/students/${id}`)
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

  async function handleUpdate(data) {
    await apiFetch(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    router.push(`/students/${id}`)
  }

  return (
    <ProtectedPage>
      <AdminLayout>
        <div style={{ background: "white", borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button
              onClick={() => router.back()}
              style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 14, color: "#475569" }}
            >
              ← กลับ
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>แก้ไขข้อมูลนักศึกษา</h1>
          </div>

          {loading && <p style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}>กำลังโหลด...</p>}
          {error && <p style={{ color: "#ef4444", textAlign: "center", padding: 40 }}>{error}</p>}

          {student && (
            <StudentForm
              initialData={student}
              onSubmit={handleUpdate}
              submitLabel="บันทึกการแก้ไข"
            />
          )}
        </div>
      </AdminLayout>
    </ProtectedPage>
  )
}
