import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function FinanceDashboard() {
  const [data, setData] = useState({ studentFees: 0, teacherSalaries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await fetch(
          "https://cuvette-lpcv.onrender.com/api/admin/financial-data"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial data");
        }
        const result = await response.json();

        // Calculate total student fees and teacher salaries
        const totalFees = result.students.reduce(
          (sum, student) => sum + student.feesPaid,
          0
        );
        const totalSalaries = result.teachers.reduce(
          (sum, teacher) => sum + teacher.salary,
          0
        );

        setData({
          studentFees: totalFees,
          teacherSalaries: totalSalaries,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
  }

  return (
    <div className="h-screen w-screen mx-auto px-4 bg-gray-100 py-8">
      <Link to={"/admindashboard"}>
        <ChevronLeft className="text-black mb-4" />
      </Link>
      <h1 className="text-3xl font-bold mb-8">Finance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Total Student Fees Paid</p>
              <p className="text-2xl font-bold">
                ₹{data.studentFees.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Teacher Salaries Paid</p>
              <p className="text-2xl font-bold">
                ₹{data.teacherSalaries.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
