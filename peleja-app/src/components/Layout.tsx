import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import styles from './Layout.module.css'

export const Layout = () => (
  <div className={styles.layout}>
    <Navbar />
    <main className={styles.content}>
      <Outlet />
    </main>
    <Footer />
  </div>
)
