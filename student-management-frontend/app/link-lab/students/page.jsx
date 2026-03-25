import Link from "next/link";

export default async function StudentsPage({ searchParams }) {
  const students = [
    { id: "1", name: "Alice", program: "SE" },
    { id: "2", name: "Bob", program: "CS" },
    { id: "3", name: "Chai", program: "SE" },
  ];

  // ✅ Next.js รุ่นใหม่: searchParams อาจเป็น Promise → ต้อง await ก่อน
  const sp = await searchParams;
  const program = sp?.program; // "SE" | "CS" | undefined

  const filtered = program ? students.filter((s) => s.program === program) : students;

  return (
    <main>
      <h1>Students (Link Lab)</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <Link href="/link-lab/students?program=SE">Program: SE</Link>
        <Link href="/link-lab/students?program=CS">Program: CS</Link>
        <Link href="/link-lab/students">All</Link>
      </div>

      <p style={{ marginTop: 0, color: "#6b7280" }}>
        ตัวกรองปัจจุบัน: <b>{program || "All"}</b>
      </p>

      <ul>
        {filtered.map((s) => (
          <li key={s.id}>
            <Link href={`/link-lab/students/${s.id}`}>{s.name}</Link> ({s.program})
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p style={{ color: "#b91c1c" }}>ไม่พบข้อมูลนักศึกษาในโปรแกรมที่เลือก</p>
      )}

      <p>
        <Link href="/link-lab">← กลับหน้า Lab</Link>
      </p>
    </main>
  );
}