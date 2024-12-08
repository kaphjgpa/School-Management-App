import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; // shadcn/ui button
import { Input } from "@/components/ui/input"; // shadcn/ui input
import { Label } from "@/components/ui/label"; // shadcn/ui label

const roleApiEndpoints = {
  Admin: "http://localhost:3000/api/admin/signin",
  Teacher: "http://localhost:3000/api/teachers/signin",
  Student: "http://localhost:3000/api/students/signin",
};

const SignIn = () => {
  const [selectedRole, setSelectedRole] = useState("Admin"); // Default role: Admin
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const apiEndpoint = roleApiEndpoints[selectedRole];

    try {
      const response = await axios.post(apiEndpoint, formData);

      if (response.status === 200) {
        const { token } = response.data;
        if (token) {
          // Store the token securely
          localStorage.setItem("token", token); // Store the token in localStorage
          alert(`${selectedRole} signed in successfully!`);
        } else {
          setError("Authentication failed. No token received.");
        }
      }
    } catch (error) {
      // Handle sign-in error
      const errorMessage =
        error.response?.data?.message || "Sign-in failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
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

          {/* Password Input */}
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
        </form>
      </div>
    </div>
  );
};

export default SignIn;