import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'
import App from './App.tsx'
import './index.css'

const store = createStore({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: import.meta.env.PROD,
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
