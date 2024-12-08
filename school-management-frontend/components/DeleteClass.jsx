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
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DeleteClass() {
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    setError("");
    setSuccessMessage("");

    if (!className) {
      setError("Class name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in first.");
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/api/admin/delete-class/${className}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setClassName(""); // Clear the input field
    } catch (error) {
      console.error("Error deleting class:", error);
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
    <Card className="w-[300px] h-[270px]">
      <CardHeader>
        <CardTitle>Delete Class</CardTitle>
        <CardDescription>
          You can assign any class to any teachcer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDelete}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Class Name</Label>
              <Input
                id="className"
                placeholder="Enter class name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
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
