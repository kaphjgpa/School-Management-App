import React, { useState } from "react";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../src/components/ui/select";
import axios from "axios";

const models = {
  Admin: [
    "Email",
    "First Name",
    "Last Name",
    "Gender",
    "Contact Number",
    "Password",
  ],
  Student: [
    "userName",
    "studentFirstName",
    "studentLastName",
    "gender",
    "dateOfBirth",
    "feesPaid",
    "contactNumber",
    "password",
    "className",
  ],
  Teacher: [
    "Email",
    "First Name",
    "Last Name",
    "Gender",
    "D.O.B",
    "Salary",
    "Contact Number",
    "Password",
  ],
};

const roleUrls = {
  Admin: `${import.meta.env.VITE_API_BASE_URL}/admin/signup`,
  Student: `${import.meta.env.VITE_API_BASE_URL}/students/signup`,
  Teacher: `${import.meta.env.VITE_API_BASE_URL}/teachers/signup`,
};

const DynamicForm = () => {
  const [selectedModel, setSelectedModel] = useState("Admin");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const destinationUrl = roleUrls[selectedModel];
    if (destinationUrl) {
      try {
        const response = await axios.post(destinationUrl, formData, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200 || response.status === 201) {
          alert("Signup successful!");
        } else {
          alert("Failed to signup. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error.response || error.message);
        alert(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    } else {
      alert("Invalid role selected!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Dynamic Form
        </h1>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Who you are</label>
          <Select onValueChange={setSelectedModel} defaultValue={selectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(models).map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {models[selectedModel].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field}
              </label>
              <Input
                id={field}
                name={field.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}
                placeholder={`Enter ${field}`}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
