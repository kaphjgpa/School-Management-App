import SignIn from "../components/Signin";
import SignUp from "../components/SignUp";
import LandingPage from "../components/LandingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Admin } from "../components/Admin";
import SearchTeacher from "../components/SearchTeacher";
import SearchStudent from "../components/SearchStudent";
import SearchClass from "../components/SearchClass";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/signup",
      element: (
        <>
          <SignUp />
        </>
      ),
    },
    {
      path: "/signin",
      element: (
        <>
          <SignIn />
        </>
      ),
    },
    {
      path: "/admin",
      element: (
        <>
          <Admin />
        </>
      ),
    },
    {
      path: "/admin/search-teachers",
      element: (
        <>
          <SearchTeacher />
        </>
      ),
    },
    {
      path: "/admin/search-students",
      element: (
        <>
          <SearchStudent />
        </>
      ),
    },
    {
      path: "/admin/search-classes",
      element: (
        <>
          <SearchClass />
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
