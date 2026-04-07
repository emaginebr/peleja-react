import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import styles from './AdminLayout.module.css'

export const AdminLayout = () => (
  <div className={styles.layout}>
    <Sidebar />
    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
)
