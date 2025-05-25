/* eslint-disable react-refresh/only-export-components */

import Header from "./Components/Header"

import Body from "./Components/Body"
import About from "./Components/About"
import {createBrowserRouter, Outlet} from 'react-router-dom'
import Error from "./Components/Error"
import Contact from "./Components/Contact"
import Shoemenu from "./Components/Shoemenu"
import Cart from "./Components/Cart"
import { Provider } from "react-redux"
import store from "./utils/appStore"
import { ToastContainer } from 'react-toastify';
import Favorites from "./Components/Favourites"
import FavsPage from "./Page/FavsPage"
import PlaceOrder from "./Page/placeOrder"
import Orders from "./Page/Orders"
import ProtectedRoute from "./Components/ProtectedRoute"
import Dashboard from "./Page/Dashboard"
function App() {
  
  return (
    <Provider store={ store }>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header className="sticky top-0 z-10 bg-white" />
      
      <Outlet />
    </Provider>
  )
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      {
        path: '/',
        element: (<ProtectedRoute><Body /></ProtectedRoute>)
      },
      {
        path: '/about',
        element: (<ProtectedRoute><About /></ProtectedRoute>)
      },
      {
        path: '/cart',
        element: (<ProtectedRoute><Cart /></ProtectedRoute>)
      },
      {
        path: '/contact',
        element: (<ProtectedRoute><Contact /></ProtectedRoute>)
      },
      
      {
        path: 'favourites',
        element: (<ProtectedRoute><FavsPage /></ProtectedRoute>)
      },
      {
        path: '/shoes/:shoeId',
        element: (<ProtectedRoute><Shoemenu /></ProtectedRoute>)
      },
      {
        path: '/placeOrder',
        element: (<ProtectedRoute><PlaceOrder /></ProtectedRoute>)
      },
      {
        path: '/orders',
        element: (<ProtectedRoute><Orders /></ProtectedRoute>)
      },
      {
        path: '/home',
        element: (
          <ProtectedRoute>
            <Dashboard/>
        </ProtectedRoute >
    ),
      }, 
    ],
    errorElement: <Error />
  }
])
export default App
