import Link from "next/link";

export default async function StudentDetailPage({ params }) {
  const { id } = await params;

  return (
    <main>
      <h1>Student Detail (Link Lab)</h1>
      <p>Student ID: {id}</p>
      <p>Student Name: {name}</p>

      <p><Link href="/link-lab/students">กลับหน้า Student</Link></p>
      <p><Link href="/link-lab">กลับหน้า Lab</Link></p>
    </main>
  );
}