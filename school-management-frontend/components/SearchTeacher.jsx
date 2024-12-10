import { useState } from "react";
import { Input } from "../src/components/ui/input";
import { Button } from "../src/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/ui/table";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function SearchTeacher() {
  const [filter, setFilter] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://cuvette-lpcv.onrender.com/api/admin/search-teacher`,
        {
          params: { filter },
        }
      );
      setTeachers(response.data.teachers);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <Helmet>
        <title>Teacher Search</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <Link to={"/admindashboard"}>
          <ChevronLeft className="text-black" />
        </Link>
        <h1 className="text-2xl font-bold mb-4">Teacher Search</h1>

        {/* Search Input */}
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search by email, first name, last name, or gender"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-grow"
            aria-label="Search input"
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
              <TableHead>D.O.B</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.teacherFirstName || "N/A"}</TableCell>
                  <TableCell>{teacher.teacherLastName || "N/A"}</TableCell>
                  <TableCell>{teacher.gender || "N/A"}</TableCell>
                  <TableCell>{teacher.contactNumber || "N/A"}</TableCell>
                  <TableCell>{teacher.dateOfBirth || "N/A"}</TableCell>
                  <TableCell>{teacher.userName || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No teachers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
