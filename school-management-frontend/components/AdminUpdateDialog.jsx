import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
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

export default function AdminUpdateDialog() {
  const [userName, setUserName] = useState(""); // Add userName field for identification
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for form submission trigger
  const navigate = useNavigate();

  // useEffect to trigger API call after form submission
  useEffect(() => {
    if (isSubmitted) {
      const updateDetails = async () => {
        setError(""); // Clear previous errors
        setSuccessMessage(""); // Clear previous success message

        if (!userName) {
          setError("userName is required");
          return;
        }

        if (!contactNumber && !password && !lastName) {
          setError("At least one field is required to update");
          return;
        }

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Unauthorized: Please log in first.");
            // Redirect to login page
            navigate("/signin");
            return;
          }

          const response = await axios.put(
            "https://school-management-app-lkep.onrender.com/api/admin/update-details",
            { userName, contactNumber, password, lastName },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          setSuccessMessage("Details updated successfully");
          setContactNumber("");
          setPassword("");
          setLastName("");
        } catch (error) {
          console.error("Error during update:", error);
          if (error.response) {
            setError(
              error.response.data.message || "Server responded with an error"
            );
          } else if (error.request) {
            setError("No response received from the server. Please try again.");
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setIsSubmitted(false); // Reset the submission flag to avoid repeated submissions
        }
      };

      updateDetails();
    }
  }, [isSubmitted, userName, contactNumber, password, lastName, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Trigger the effect to run the update
  };

  const handleCancel = () => {
    setContactNumber("");
    setPassword("");
    setLastName("");
    setUserName(""); // Reset the userName field
    setError("");
    setSuccessMessage("");
  };

  return (
    <Card className="w-[300px] h-[500px]">
      <CardHeader>
        <CardTitle>Update Details</CardTitle>
        <CardDescription>
          Update your contact number, password, or last name.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="Enter your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
            <Button onCLick={handleSubmit} type="submit">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
