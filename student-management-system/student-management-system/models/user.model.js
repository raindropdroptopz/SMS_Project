// ตัวอย่าง in-memory สำหรับการสอน
// โครงสร้างผู้ใช้: { id, username, passwordHash, role }

let users = [];
let nextId = 1;

function createUser({ username, passwordHash, role }) {
  const user = { id: nextId++, username, passwordHash, role };
  users.push(user);
  return user;
}

function findByUsername(username) {
  return users.find(u => u.username === username) || null;
}

function findById(id) {
  return users.find(u => u.id === id) || null;
}

module.exports = { createUser, findByUsername, findById };