import Link from "next/link";

export default function StudentsHelpPage() {
  return (
    <main>
      <h1>Students (Help)</h1>
      <p>Email: registar@payap.ac.th</p>
      <p>Tel.053-476-2345</p>
      <p><Link href="/link-lab">กลับหน้าหลัก</Link></p>
    </main>
  );
}