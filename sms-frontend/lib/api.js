import { API_BASE_URL } from "./config"
import { getToken, removeToken } from "./auth"

export async function apiFetch(path, options = {}) {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  let data = null
  const contentType = response.headers.get("content-type")

  if (contentType && contentType.includes("application/json")) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (response.status === 401 || response.status === 403) {
    removeToken()
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    throw new Error("Unauthorized")
  }

  if (!response.ok) {
    const errorMessage = data?.message || "เกิดข้อผิดพลาดในการเรียก API"
    throw new Error(errorMessage)
  }

  return data
}