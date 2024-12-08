import { useState } from "react";
import { Input } from "../src/components/ui/input";
import { Button } from "../src/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
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

// Mock data for demonstration
const teachers = [
  {
    id: 1,
    name: "John Doe",
    subject: "Mathematics",
    email: "john@example.com",
  },
  { id: 2, name: "Jane Smith", subject: "English", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", subject: "Science", email: "bob@example.com" },
  {
    id: 4,
    name: "Alice Brown",
    subject: "History",
    email: "alice@example.com",
  },
];

export default function SearchTeacher() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(teachers);

  const handleSearch = () => {
    const results = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <>
      <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
        <div className="container justify-center mx-auto p-4">
          <Link to={"/admindashboard"}>
            <ChevronLeft className="text-black" />
          </Link>
          <h1 className="text-2xl font-bold mb-4">Teacher Search</h1>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search by name, subject, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
