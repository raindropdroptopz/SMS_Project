"use client"

import { useRouter } from "next/navigation"
import StudentForm from "@/components/students/StudentForm"
import ProtectedPage from "@/components/auth/ProtectedPage"
import AdminLayout from "@/components/layout/AdminLayout"
import { apiFetch } from "@/lib/api"

export default function CreateStudentPage(){

 const router = useRouter()

 async function handleCreate(data){

   await apiFetch("/students",{
     method:"POST",
     body:JSON.stringify(data)
   })

   router.push("/students")

 }

 return (

 <ProtectedPage>
 <AdminLayout>

 <h1>เพิ่มนักศึกษา</h1>

 <StudentForm
   onSubmit={handleCreate}
   submitLabel="บันทึก"
 />

 </AdminLayout>
 </ProtectedPage>

 )

}