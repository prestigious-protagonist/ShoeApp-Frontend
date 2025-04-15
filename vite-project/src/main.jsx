
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';
import { appRouter } from './App.jsx'
createRoot(document.getElementById('root')).render(
    <Auth0Provider
        domain="dev-ticbss1kiwcuz4sb.au.auth0.com"
        clientId="Cl2YFyWlPApIuha6Oucj85GNgQ7D9SVX"
        authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-ticbss1kiwcuz4sb.au.auth0.com/api/v2/"
    }}>
       
            
            <RouterProvider router={appRouter}/>
           
    </Auth0Provider>
)
