import NavBar from './components/NavBar'

export default function LinkLabLayout({ children }) {
  return (
    <div
      style={{
        padding: 10,
        background: '#c4d2ed',
        color: '#1a1616',
        minHeight: '100vh',
      }}
    >
      <NavBar />
      {children}
    </div>
  );
}
