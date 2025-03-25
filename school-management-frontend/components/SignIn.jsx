import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const roleApiEndpoints = {
  Admin: "http://localhost:8000/api/admin/signin",
  Teacher: "http://localhost:8000/api/teachers/signin",
  Student: "http://localhost:8000/api/students/signin",
};

const roleRedirectPaths = {
  Admin: "/admindashboard",
  Teacher: "/teacherdashboard",
  Student: "/studentdashboard",
};

const SignIn = () => {
  const [selectedRole, setSelectedRole] = useState("Admin"); // Default role: Admin
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const apiEndpoint = roleApiEndpoints[selectedRole];

    try {
      const response = await axios.post(apiEndpoint, formData);

      if (response.status === 200) {
        const { token } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          alert(`${selectedRole} signed in successfully!`);

          // Redirect to the appropriate dashboard based on the selected role
          const redirectPath = roleRedirectPaths[selectedRole];
          navigate(redirectPath);
        } else {
          setError("Authentication failed. No token received.");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Sign-in failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <Helmet>
        <title>Cuvette SignIn</title>
      </Helmet>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div>
          <Link
            to="/"
            className="flex items-center text-sm text-blue-800 hover:text-blue-600 ml-4"
          >
            <ChevronLeft />
            Home
          </Link>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector */}
          <div>
            <Label className="mb-2">Select Role</Label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full h-8 outline-none border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-slate-100"
            >
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>
          {/* User Name Input */}
          <div>
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant={loading ? "ghost" : "default"}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <div className="flex justify-center">
            <p>Create an account</p>
            <Link className="underline" to={"/signup"}>
              {" "}
              SignUp
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
