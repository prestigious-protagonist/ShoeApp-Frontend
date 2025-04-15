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
        element: <Body />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/shoes/:shoeId',
        element: <Shoemenu />
      }
      
    ],
    errorElement: <Error />
  }
])
export default App
