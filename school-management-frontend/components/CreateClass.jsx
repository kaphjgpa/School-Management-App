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

export default function CreateClass() {
  const [className, setClassName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [studentsFees, setStudentsFees] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!className && !teacherName && !maxStudents && !studentsFees && !year) {
      setError("All fields are required");
      return;
    }

    try {
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   setError("Unauthorized: Please log in first.");
      //   // Redirect to login page
      //   navigate("/login");
      //   return;
      // }

      // Convert string inputs to numbers because backend need numbers type
      const formattedData = {
        className,
        teacherName,
        maxStudents: Number(maxStudents),
        studentsFees: Number(studentsFees),
        year: Number(year),
      };

      const response = await axios.post(
        "http://localhost:3000/api/admin/createclass",
        formattedData
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // }
      );
      setSuccessMessage("Details updated successfully");
      setClassName("");
      setTeacherName("");
      setMaxStudents("");
      setStudentsFees("");
      setYear("");
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
    setClassName("");
    setTeacherName("");
    setMaxStudents("");
    setStudentsFees("");
    setYear("");
  };

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Create Class</CardTitle>
        <CardDescription>Only you can create a new class</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contactNumber">Class Name</Label>
              <Input
                id="contactNumber"
                placeholder="Enter class name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Teacher Name</Label>
              <Input
                id="teacherName"
                type="teacherName"
                placeholder="Enter Teacher Name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Max Students</Label>
              <Input
                id="maxStudent"
                placeholder="Enter max students is 30"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Student Fees</Label>
              <Input
                id="studentFees"
                placeholder="Enter Fees for this Class"
                value={studentsFees}
                onChange={(e) => setStudentsFees(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Year</Label>
              <Input
                id="year"
                placeholder="Enter Year 2024 - 2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
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
