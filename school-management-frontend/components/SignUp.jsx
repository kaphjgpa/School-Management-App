import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomWarning } from "./BttomWarning";

export const SignUp = () => {
  const [userType, setUserType] = useState("admin");
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Parsing specific fields into numbers
      const parsedSalary = formData.salary
        ? Number(formData.salary)
        : undefined;
      const parsedFeesPaid = formData.feesPaid
        ? Number(formData.feesPaid)
        : undefined;
      const parsedContactNumber = formData.contactNumber
        ? Number(formData.contactNumber)
        : undefined;

      // Creating a new object with parsed values
      const processedFormData = {
        ...formData,
        salary: parsedSalary,
        feesPaid: parsedFeesPaid,
        contactNumber: parsedContactNumber,
      };

      const endpointMap = {
        admin: "/api/admin/signup",
        teacher: "/api/teachers/signup",
        student: "/api/students/signup",
      };

      const response = await axios.post(
        `http://localhost:3000${endpointMap[userType]}`,
        processedFormData
      );
      alert(
        `${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } signed up successfully!`
      );

      navigate("/signin");
      console.log(response.data);
    } catch (error) {
      console.error("Error during submission:", error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  const renderFormFields = () => {
    switch (userType) {
      case "admin":
        return (
          <>
            <InputBox
              name="userName"
              label="Email"
              placeholder="surendrasingh@gmail.com"
              onChange={handleInputChange}
            />
            <InputBox
              name="firstName"
              label="First Name"
              placeholder="Surendra"
              onChange={handleInputChange}
            />
            <InputBox
              name="lastName"
              label="Last Name"
              placeholder="Singh"
              onChange={handleInputChange}
            />
            <GenderSelect name="gender" onChange={handleInputChange} />
            <InputBox
              name="contactNumber"
              label="Contact Number"
              placeholder="6280500401"
              type="number"
              onChange={handleInputChange}
            />
            <InputBox
              name="password"
              label="Password"
              placeholder="At least 10 characters"
              type="password"
              onChange={handleInputChange}
            />
          </>
        );
      case "teacher":
        return (
          <>
            <InputBox
              name="userName"
              label="Email"
              placeholder="teacher@gmail.com"
              onChange={handleInputChange}
            />
            <InputBox
              name="teacherFirstName"
              label="First Name"
              placeholder="Surendra"
              onChange={handleInputChange}
            />
            <InputBox
              name="teacherLastName"
              label="Last Name"
              placeholder="Singh"
              onChange={handleInputChange}
            />
            <GenderSelect name="gender" onChange={handleInputChange} />
            <InputBox
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              onChange={handleInputChange}
            />
            <InputBox
              name="salary"
              label="Salary"
              placeholder="70000"
              type="number"
              onChange={handleInputChange}
            />
            <InputBox
              name="contactNumber"
              label="Contact Number"
              placeholder="6280500401"
              type="number"
              onChange={handleInputChange}
            />
            <InputBox
              name="password"
              label="Password"
              placeholder="At least 10 characters"
              type="password"
              onChange={handleInputChange}
            />
          </>
        );
      case "student":
        return (
          <>
            <InputBox
              name="userName"
              label="Email"
              placeholder="student@gmail.com"
              onChange={handleInputChange}
            />
            <InputBox
              name="studentFirstName"
              label="First Name"
              placeholder="Surendra"
              onChange={handleInputChange}
            />
            <InputBox
              name="studentLastName"
              label="Last Name"
              placeholder="Singh"
              onChange={handleInputChange}
            />
            <GenderSelect name="gender" onChange={handleInputChange} />
            <InputBox
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              onChange={handleInputChange}
            />
            <InputBox
              name="feesPaid"
              label="Fees Paid"
              placeholder="4000"
              type="number"
              onChange={handleInputChange}
            />
            <InputBox
              name="contactNumber"
              label="Contact Number"
              placeholder="6280500401"
              type="number"
              onChange={handleInputChange}
            />
            <InputBox
              name="className"
              label="Class Name"
              placeholder="Ten"
              onChange={handleInputChange}
            />
            <InputBox
              name="password"
              label="Password"
              placeholder="At least 10 characters"
              type="password"
              onChange={handleInputChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen w-screen flex justify-center items-center">
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-zinc-900">
          Signup Now
        </h2>
        <label className="block mb-4">
          <span className="text-zinc-900 font-semibold">User Type</span>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="form-select mt-2 block w-full h-8 text-white outline-none border-gray-300 rounded-md shadow-sm  bg-zinc-900 "
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </label>
        <form className="space-y-4">{renderFormFields()}</form>
        <Button
          onClick={handleSubmit}
          className="mt-6 w-full  bg-blue-800 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-md"
        >
          Submit
        </Button>
        <BottomWarning
          label={"Already have an account?"}
          buttonText={"Sign in"}
          to={"/signin"}
        />
      </div>
    </div>
  );
};

const InputBox = ({ name, label, placeholder, type = "text", onChange }) => (
  <div>
    <label className="block text-zinc-900 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className=" h-8 mt-2 block w-full outline-none text-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-zinc-800"
    />
  </div>
);

const GenderSelect = ({ name, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium">Gender</label>
    <select
      name={name}
      onChange={onChange}
      className="form-select h-8 mt-2 block w-full outline-none border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-zinc-900 text-white "
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>
);

export default SignUp;
