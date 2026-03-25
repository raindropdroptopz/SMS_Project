import Link from "next/link";

export default async function StudentListPage() {
  const res = await fetch("http://localhost:4000/students", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Cannot load students");
  }

  const students = await res.json();

  return (
    <div style={{ padding: 16 }}>
      <h1>Student List</h1>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Program</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const id = s.student_id;
            const fullNameTh = `${s.first_name_th || ""} ${s.last_name_th || ""}`.trim();

            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{s.student_no || "-"}</td>
                <td>{fullNameTh || "-"}</td>
                <td>{s.email || "-"}</td>
                <td>{s.program_id ?? "-"}</td>
                <td>
                  {/* ✅ ลิงก์ไป Dynamic Route */}
                  <Link href={`/sms/students/${id}`}>View</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}