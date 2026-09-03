import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Authentication, {AuthenticationMode} from './screens/Authentication'
import UserCheck from './components/UserCheck'
import UserProvider from './context/UserProvider'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./screens/NotFound";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />
  },
  {
    path:"/signin",
    element:<Authentication authenticationMode={AuthenticationMode.SignIn} />
  },
  {
    path:"/signup",
    element:<Authentication authenticationMode={AuthenticationMode.SignUp} />
  },
  {
    element: <UserCheck />,
    children: [
      {
        path: "/",
        element: <App />,
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
