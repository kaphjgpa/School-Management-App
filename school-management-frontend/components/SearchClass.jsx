import { useState, useEffect } from "react";
import { Input } from "../src/components/ui/input";
import { Button } from "../src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/ui/table";
import { Pagination } from "../src/components/ui/pagination";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

export default function SearchClass() {
  const [filter, setFilter] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://school-management-app-lkep.onrender.com/api/admin/search-class`,
        {
          params: { filter, page, limit },
        }
      );
      setClasses(response.data.classes);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to the first page on a new search
    fetchClasses();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <Link to={"/admindashboard"}>
          <ChevronLeft className="text-black mb-4" />
        </Link>
        <h1 className="text-2xl font-bold mb-4">Class Search</h1>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search by class name, teacher name, or fees"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyPress={handleKeyPress}
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
              <TableHead>Class Name</TableHead>
              <TableHead>Teacher Name</TableHead>
              <TableHead>Student Fees</TableHead>
              <TableHead>Max Students</TableHead>
              <TableHead>Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length > 0 ? (
              classes.map((cls) => (
                <TableRow key={cls._id}>
                  <TableCell>{cls.className || "N/A"}</TableCell>
                  <TableCell>{cls.teacherName || "N/A"}</TableCell>
                  <TableCell>{cls.studentsFees || "N/A"}</TableCell>
                  <TableCell>{cls.maxStudents || "N/A"}</TableCell>
                  <TableCell>{cls.year || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No classes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
