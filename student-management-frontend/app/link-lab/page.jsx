import Link from "next/link";

export default function LinkLabHome() {
  return (
    <main>
      <h1>Home of Link Practice Lab</h1>
      <p><Link href="/link-lab/students">ไปหน้า Student</Link></p>
      <p><Link href="/link-lab/help">ไปหน้า Help</Link></p>
    </main>
  );
}