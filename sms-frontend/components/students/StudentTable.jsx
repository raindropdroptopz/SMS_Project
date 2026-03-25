"use client"

import Link from "next/link"
import styles from "@/styles/student-table.module.css"

export default function StudentTable({ students, onDelete }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>รหัสนักศึกษา</th>
          <th className={styles.th}>ชื่อ-นามสกุล</th>
          <th className={styles.th}>อีเมล</th>
          <th className={styles.th}>สถานะ</th>
          <th className={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="5" className={styles.empty}>ไม่พบข้อมูลนักศึกษา</td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student.student_id}>
              <td className={styles.td}>{student.student_no}</td>
              <td className={styles.td}>{student.prefix}{student.first_name_th} {student.last_name_th}</td>
              <td className={styles.td}>{student.email}</td>
              <td className={styles.td}>{student.status || "-"}</td>
              <td className={styles.td}>
                <div className={styles.actionGroup}>
                  <Link href={`/students/${student.student_id}`} className={styles.viewBtn}>ดูข้อมูล</Link>
                  <Link href={`/students/${student.student_id}/edit`} className={styles.editBtn}>แก้ไข</Link>
                  <button onClick={() => onDelete(student.student_id)} className={styles.deleteBtn}>ลบ</button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}