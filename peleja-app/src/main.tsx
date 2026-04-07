import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NAuthProvider } from 'nauth-react'
import { SiteProvider } from './Contexts/SiteContext'
import { App } from './App'
import './i18n'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'nauth-react/styles'
import 'peleja-react/style.css'

const tenantId = import.meta.env.VITE_TENANT_ID || 'emagine'

const nauthConfig = {
  apiUrl: import.meta.env.VITE_NAUTH_API_URL || 'http://localhost:5001',
  headers: {
    'X-Tenant-Id': tenantId,
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NAuthProvider config={nauthConfig}>
      <SiteProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SiteProvider>
    </NAuthProvider>
  </React.StrictMode>,
)
