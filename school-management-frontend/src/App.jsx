import SignIn from "../components/Signin";
import SignUp from "../components/SignUp";
import LandingPage from "../components/LandingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminDashboard } from "../components/AdminDashboard";
import SearchTeacher from "../components/SearchTeacher";
import SearchStudent from "../components/SearchStudent";
import SearchClass from "../components/SearchClass";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { TeacherDashboard } from "../components/teacherComponents/TeacherDashboard";

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
          <AdminLayout />
        </>
      ),
    },
    {
      path: "/admindashboard",
      element: (
        <>
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        </>
      ),
    },
    {
      path: "/admindashboard/search-teachers",
      element: (
        <>
          <SearchTeacher />
        </>
      ),
    },
    {
      path: "/admindashboard/search-students",
      element: (
        <>
          <SearchStudent />
        </>
      ),
    },
    {
      path: "/admindashboard/search-classes",
      element: (
        <>
          <SearchClass />
        </>
      ),
    },
    {
      path: "/teacherdashboard",
      element: (
        <>
          <TeacherDashboard />
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
