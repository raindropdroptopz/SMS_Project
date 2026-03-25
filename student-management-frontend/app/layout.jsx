import './globals'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>
          <h2> Student Management Fronted</h2>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/students">Students</a>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <small>Module 4 - Next.js App Router</small>
        </footer>
      </body>
    </html>
  )
}
