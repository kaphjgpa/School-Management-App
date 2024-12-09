import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../components/NotFound";

// Lazy loading components
const LandingPage = lazy(() => import("../components/LandingPage"));
const SignIn = lazy(() => import("../components/SignIn"));
const SignUp = lazy(() => import("../components/SignUp"));
const AdminDashboard = lazy(() => import("../components/AdminDashboard"));
const TeacherDashboard = lazy(() =>
  import("../components/teacherComponents/TeacherDashboard")
);
const StudentDashboard = lazy(() =>
  import("../components/studentComponents/StudentDashboard")
);
const SearchTeacher = lazy(() => import("../components/SearchTeacher"));
const SearchStudent = lazy(() => import("../components/SearchStudent"));
const SearchClass = lazy(() => import("../components/SearchClass"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
      errorElement: <NotFound />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/admindashboard",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: "search-teachers", element: <SearchTeacher /> },
        { path: "search-students", element: <SearchStudent /> },
        { path: "search-classes", element: <SearchClass /> },
      ],
    },
    {
      path: "/teacherdashboard",
      element: (
        <ProtectedRoute>
          <TeacherDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/studentdashboard",
      element: (
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
