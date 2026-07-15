import './globals.scss'
import localFont from 'next/font/local'

const myFont = localFont({
  src: './w95fa.woff2',
})

export const metadata = {
  title: 'Prajwal A 👋',
  description: 'Windows 95 themed portfolio of Prajwal A — AI/ML Engineer',
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
