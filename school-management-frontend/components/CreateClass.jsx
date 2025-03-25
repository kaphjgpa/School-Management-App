import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";

export default function CreateClass() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in first.");
        navigate("/login");
        return;
      }

      // Convert the received values to the correct types for the backend.
      const formattedData = {
        className: data.className,
        teacherName: data.teacherName,
        maxStudents: Number(data.maxStudents),
        studentsFees: Number(data.studentsFees),
        year: Number(data.year),
      };

      const response = await axios.post(
        "http://localhost:8000/api/admin/create-class",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("========Form Data========", data);
      console.log("======Create class data========", response.data);
      setSuccessMessage("Details updated successfully");
      reset(); // Clear the form inputs
    } catch (err) {
      console.error("Error during creating class:", err);
      if (err.response) {
        setError(err.response.data.message || "Server responded with an error");
      } else if (err.request) {
        setError("No response received from the server. Please try again.");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Create Class</CardTitle>
        <CardDescription>Only you can create a new class</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            {/* Class Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                type="text"
                placeholder="Enter class name"
                {...register("className", {
                  required: "Class Name is required",
                })}
              />
              {errors.className && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.className.message}
                </p>
              )}
            </div>

            {/* Teacher Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="teacherName">Teacher Name</Label>
              <Input
                id="teacherName"
                placeholder="Enter Teacher Name"
                {...register("teacherName", {
                  required: "Teacher Name is required",
                })}
              />
              {errors.teacherName && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.teacherName.message}
                </p>
              )}
            </div>

            {/* Max Students */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="maxStudents">Max Students</Label>
              <Input
                id="maxStudents"
                placeholder="Enter max students, e.g., 30"
                {...register("maxStudents", {
                  required: "Max Students is required",
                })}
              />
              {errors.maxStudents && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.maxStudents.message}
                </p>
              )}
            </div>

            {/* Student Fees */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="studentsFees">Student Fees</Label>
              <Input
                id="studentsFees"
                placeholder="Enter fees for this class"
                {...register("studentsFees", {
                  required: "Student Fees are required",
                })}
              />
              {errors.studentsFees && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.studentsFees.message}
                </p>
              )}
            </div>

            {/* Year */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                placeholder="Enter Year (2024 - 2030)"
                {...register("year", { required: "Year is required" })}
              />
              {errors.year && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>

          {/* Display server or submission errors */}
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
