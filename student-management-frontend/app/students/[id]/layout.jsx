export default function StudentsLayout ({ children }) {
  return (
    <section>
      <h3>Students Section</h3>
      <nav>
        <a href="/students">Student List</a>
      </nav>
      <hr />
      {children}
    </section>
  );
}