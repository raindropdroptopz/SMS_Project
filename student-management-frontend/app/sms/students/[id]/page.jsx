import Link from "next/link";

export default async function StudentDetailPage({params}) {

  const { id }  = await params;

  const url = `http://localhost:4000/students/${id}`;
  const res = await fetch(url, { cache: "no-store" });
  const raw = await res.text();

  if (!res.ok) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Student Detail</h1>
        <p><b>Request URL:</b> {url} </p>
        <p><b>Status:</b> {res.status} {res.statusText}</p>
        <pre style={{ padding: 12, borderRadius: 8, overflow: "auto" }}>
          {raw}
        </pre>
        <Link href={"/sms/students"}Back to List></Link>
      </div>
    )
  }

  const s = JSON.parse(raw);
  const fullNameTh = `${s.first_name_th || ""} ${s.last_name_th || ""}`.trim();

  return (
    <div style={{ padding: 16}}>
      <h1>Student Detail</h1>
      <p><b>ID:</b> {s.student_id}</p>
      <p><b>Student No:</b> {s.student_no || "-"}</p>
      <p><b>Name:</b> {fullNameTh || "-"}</p>
      <p><b>Program:</b> {s.program_id ?? "-"}</p>

      <div style={{ marginTop: 12 }}>
      <Link href="/sms/students">Back to List</Link>
      </div>
    </div>
  );
}