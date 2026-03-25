"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ProtectedPage from "@/components/auth/ProtectedPage"
import AdminLayout from "@/components/layout/AdminLayout"
import StudentTable from "@/components/students/StudentTable"
import { apiFetch } from "@/lib/api"
import styles from "./students.module.css"

export default function StudentsPage() {

  const [students,setStudents] = useState([])
  const [page,setPage] = useState(1)
  const [limit] = useState(5)
  const [totalPages,setTotalPages] = useState(1)
  const [loading,setLoading] = useState(true)

  async function loadStudents(p){
    setLoading(true)
    const result = await apiFetch(`/students?page=${p}&limit=${limit}`)
    if(Array.isArray(result)){
        setStudents(result)
        setTotalPages(1)
    }else{
        setStudents(result.data)
        setTotalPages(result.pagination.totalPages)
    }
    setLoading(false)
  }

  useEffect(()=>{
    async function fetchData(){
      setLoading(true)
      const result = await apiFetch(`/students?page=${page}&limit=${limit}`)
      if(Array.isArray(result)){
        setStudents(result)
        setTotalPages(1)
      }else{
        setStudents(result.data)
        setTotalPages(result.pagination.totalPages)
      }
      setLoading(false)
    }
    fetchData()
  },[page, limit])

  async function handleDelete(id){

    const confirmDelete = window.confirm("ต้องการลบข้อมูลนี้หรือไม่")

    if(!confirmDelete) return

    await apiFetch(`/students/${id}`,{
      method:"DELETE"
    })

    loadStudents(page)

  }

  return (

  <ProtectedPage>

  <AdminLayout>

  <div className={styles.header}>

  <h1>รายการนักศึกษา</h1>

  <Link href="/students/create" className={styles.addBtn}>
  เพิ่มนักศึกษา
  </Link>

  </div>

  {loading ? (
    <p>Loading...</p>
  ):(

  <>

  <StudentTable
    students={students}
    onDelete={handleDelete}
  />

  <div className={styles.pagination}>

  <button
    disabled={page<=1}
    onClick={()=>setPage(page-1)}
  >
  Previous
  </button>

  <span>
  Page {page} / {totalPages}
  </span>

  <button
    disabled={page>=totalPages}
    onClick={()=>setPage(page+1)}
  >
  Next
  </button>

  </div>

  </>

  )}

  </AdminLayout>

  </ProtectedPage>

  )
}