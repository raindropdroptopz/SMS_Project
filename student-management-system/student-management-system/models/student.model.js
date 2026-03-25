let students = [
  { id: 1, student_code: 'SE001', name: 'Somchai', program: 'Software Engineering' },
  { id: 2, student_code: 'SE002', name: 'Suda', program: 'Information Technology' },
];

let nextId = 3;

function findAll() {
  return students;
}

function create(student) {
  const created = { id: nextId++, ...student };
  students.push(created);
  return created;
}

module.exports = { findAll, create };