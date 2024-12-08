import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
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

export default function TeacherUpdate() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [teacherLastName, setTeacherLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitted) {
      const updateDetails = async () => {
        try {
          setError(""); // Clear previous errors
          setSuccessMessage(""); // Clear previous success message

          // Validation
          if (!userName) {
            setError("Username is required for updating details.");
            return;
          }

          if (!password && !teacherLastName && !contactNumber) {
            setError("Please provide at least one field to update.");
            return;
          }

          const token = localStorage.getItem("token");
          if (!token) {
            setError("Unauthorized: Please log in first.");
            navigate("/signin");
            return;
          }

          const formattedData = {
            userName,
            password,
            teacherLastName,
            contactNumber: Number(contactNumber),
          };

          const response = await axios.put(
            "http://localhost:3000/api/teachers/update-details",
            formattedData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          setSuccessMessage("Details updated successfully.");
          setUserName("");
          setPassword("");
          setTeacherLastName("");
          setContactNumber("");
        } catch (err) {
          console.error("Error during update:", err);
          if (err.response) {
            setError(
              err.response.data.message || "Server responded with an error."
            );
          } else if (err.request) {
            setError("No response received from the server. Please try again.");
          } else {
            setError("An unexpected error occurred.");
          }
        } finally {
          setIsSubmitted(false); // Reset submission flag
        }
      };

      updateDetails();
    }
  }, [
    isSubmitted,
    userName,
    password,
    teacherLastName,
    contactNumber,
    navigate,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    setPassword("");
    setTeacherLastName("");
    setUserName("");
    setContactNumber("");
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
              <Label htmlFor="userName">Email</Label>
              <Input
                id="userName"
                placeholder="Enter your email"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
              <Label htmlFor="password">Contact Number</Label>
              <Input
                id="password"
                type="text"
                placeholder="Enter your new password"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={teacherLastName}
                onChange={(e) => setTeacherLastName(e.target.value)}
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
