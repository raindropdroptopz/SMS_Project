export default function StudentDetailPage({ params }) {
 return (
  <div>
    <h1>Student Detail</h1>
    <p>Student ID: {params.id}</p>
  </div>
 );
}