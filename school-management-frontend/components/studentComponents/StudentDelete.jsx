import { useState } from "react";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../src/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentDelete() {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    setError("");
    setSuccessMessage("");

    if (!userName) {
      setError("Email is required");
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
        `http://localhost:3000/api/students/delete-student/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setUserName(""); // Clear the input field
    } catch (error) {
      console.error("Error deleting teacher:", error);
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
    setUserName("");
  };

  return (
    <Card className="w-[300px] h-[270px]">
      <CardHeader>
        <CardTitle>Delete Your Profile</CardTitle>
        <CardDescription>Verify it's you</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDelete}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Enter your Email to confirm</Label>
              <Input
                id="className"
                placeholder="Enter class name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
            <Button onClick={handleDelete} type="submit">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
