import './globals.scss'
import localFont from 'next/font/local'

const myFont = localFont({
  src: './w95fa.woff2',
})

export const metadata = {
  title: 'Vaishal Dsouza 👋',
  description: 'Windows 95 themed portfolio of Vaishal Dsouza — Computer Science Student',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>
        {children}
      </body>
    </html>
  )
}
