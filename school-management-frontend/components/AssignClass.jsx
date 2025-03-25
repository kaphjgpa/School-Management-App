import { useState } from "react";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { Label } from "../src/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../src/components/ui/card";
import axios from "axios";

export default function AdminUpdateDialog() {
  const [teacherFirstName, setTeacherFirstName] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!teacherFirstName) {
      setError("Teacher's first name is required");
      return;
    }

    if (!teacherFirstName && !assignedClass) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in first.");
        // Redirect to login page
        navigate("/login");
        return;
      }

      const response = await axios.put(
        "http://localhost:8000/api/admin/assign-class",
        { teacherFirstName, assignedClass },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Details updated successfully");
      setTeacherFirstName("");
      setAssignedClass("");
    } catch (error) {
      console.error("Arroe during assigning class:", error);
      if (error.response) {
        setError(
          error.response.data.message || "Server responded with an error"
        );
      } else if (error.request) {
        setError("No response received from the server. Please try again.");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleCancel = () => {
    // Reset form fields on cancel
    setTeacherFirstName("");
    setAssignedClass("");
  };

  return (
    <Card className="w-[300px] h-[350px]">
      <CardHeader>
        <CardTitle>Assign Class to Teacher</CardTitle>
        <CardDescription>
          You can assign any class to any teachcer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contactNumber">Teacher First Name</Label>
              <Input
                id="contactNumber"
                placeholder="Enter teacher's first name"
                value={teacherFirstName}
                onChange={(e) => setTeacherFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Class Name</Label>
              <Input
                id="lastName"
                placeholder="Enter class name eg:- Two"
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-500 mt-2">{successMessage}</p>
          )}

          <CardFooter className="flex justify-between mt-4">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
