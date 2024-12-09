import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // shadcn/ui input
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label"; // shadcn/ui label
import { Helmet } from "react-helmet";

export const SignUp = () => {
  const [userType, setUserType] = useState("admin");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Parsing specific fields into numbers
      // const parsedSalary = formData.salary
      //   ? Number(formData.salary)
      //   : undefined;
      // const parsedFeesPaid = formData.feesPaid
      //   ? Number(formData.feesPaid)
      //   : undefined;
      // const parsedContactNumber = formData.contactNumber
      //   ? Number(formData.contactNumber)
      //   : undefined;

      // Creating a new object with parsed values
      const processedFormData = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : undefined,
        feesPaid: formData.feesPaid ? Number(formData.feesPaid) : undefined,
        contactNumber: formData.contactNumber
          ? Number(formData.contactNumber)
          : undefined,
      };

      const endpointMap = {
        admin: "/api/admin/signup",
        teacher: "/api/teachers/signup",
        student: "/api/students/signup",
      };

      const response = await axios.post(
        `https://cuvette-lpcv.onrender.com${endpointMap[userType]}`,
        processedFormData
      );

      // Check if a token is present in the response
      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);
      }

      alert(
        `${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } signed up successfully!`
      );

      navigate("/signin");
      console.log(response.data);
    } catch (error) {
      console.error("Error during submission:", error);
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
    <div className="bg-gray-100 min-h-screen w-screen flex justify-center items-center">
      <Helmet>
        <title>Cuvette SignUp</title>
      </Helmet>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div>
          <Link
            to="/"
            className="flex items-center text-sm text-blue-800 hover:text-blue-600 ml-4"
          >
            <ChevronLeft />
            Home
          </Link>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        </div>
        <label className="block mb-4">
          <Label className="mb-2">Select Role</Label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full h-8 outline-none border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-slate-100 "
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
        <div className="flex justify-center">
          <p>Already have an account</p>
          <Link className="underline" to={"/signin"}>
            {" "}
            SignIn
          </Link>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({ name, label, placeholder, type = "text", onChange }) => (
  <div>
    <label className="block text-zinc-900 font-medium">{label}</label>
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full h-8 outline-none border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-slate-100 "
    />
  </div>
);

const GenderSelect = ({ name, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium">Gender</label>
    <select
      name={name}
      onChange={onChange}
      className="w-full h-8 outline-none border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 bg-slate-100 "
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>
);

export default SignUp;
