"use client"

import { useEffect, useState, startTransition } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"
import styles from "@/styles/protected-page.module.css"

export default function ProtectedPage({ children }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login")
    } else {
      startTransition(() => setAllowed(true))
    }
  }, [router])

  if (!allowed) {
    return <p className={styles.loading}>กำลังตรวจสอบสิทธิ์...</p>
  }

  return children
}