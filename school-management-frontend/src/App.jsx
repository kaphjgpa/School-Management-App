import SignIn from "../components/Signin";
import SignUp from "../components/SignUp";
import LandingPage from "../components/LandingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
