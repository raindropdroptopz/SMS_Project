import Link from "next/link";

export default function NavBar() {
  return (
    <nav style={{ display: "flex", gap: 16, padding: 12, borderBottom: "1px solid #ddd"}}>
      <Link href="/link-lab">Lab Home</Link>
      <Link href="/link-lab/students">Students</Link>
      <Link href="/link-lab/help">Help</Link>
    </nav>
  )
}