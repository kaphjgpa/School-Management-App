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
import StudentDashboard from "../components/studentComponents/StudentDashboard";
import { Helmet } from "react-helmet";

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
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        </>
      ),
    },
    {
      path: "/studentdashboard",
      element: (
        <>
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        </>
      ),
    },
  ]);

  return (
    <>
      <Helmet>
        <title>Cuvette</title>
      </Helmet>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
