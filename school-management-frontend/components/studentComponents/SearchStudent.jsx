import { useState } from "react";
import { Input } from "../../src/components/ui/input";
import { Button } from "../../src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/ui/table";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

export default function SearchStudent() {
  const [filter, setFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://cuvette-lpcv.onrender.com/api/admin/search-student`,
        {
          params: { filter },
        }
      );
      // Adjust the response mapping based on your backend API.
      setStudents(response.data.students); // Fixed: Changed `teachers` to `students`.
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <Link to={"/admindashboard"}>
          <ChevronLeft className="text-black mb-4" />
        </Link>
        <h1 className="text-2xl font-bold mb-4">Students Search</h1>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search by name, subject, or email"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <span className="loader" /> Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Fees Paid</TableHead>
              <TableHead>D.O.B</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.studentFirstName || "N/A"}</TableCell>
                  <TableCell>{student.studentLastName || "N/A"}</TableCell>
                  <TableCell>{student.gender || "N/A"}</TableCell>
                  <TableCell>{student.contactNumber || "N/A"}</TableCell>
                  <TableCell>{student.feesPaid || "N/A"}</TableCell>
                  <TableCell>{student.dateOfBirth || "N/A"}</TableCell>
                  <TableCell>{student.userName || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
