import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Users,
  Book,
  CalendarDays,
  Baby,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GenderCount } from "./GenderCount";

export default function ClassAnalytics() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState({});

  useEffect(() => {
    const fetchClassAnalytics = async () => {
      try {
        const response = await axios.get(
          "https://cuvette-lpcv.onrender.com/api/admin/class-analytics"
        );
        setClasses(response.data.classObject); // Assumes the backend sends `classObject` array
      } catch (err) {
        console.error("Error fetching class analytics:", err);
        setError("Failed to fetch class data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassAnalytics();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen w-screen mx-auto p-4 ">
      <Link to={"/admindashboard"}>
        <ChevronLeft className="text-black mb-4" />
      </Link>
      <h1 className="text-3xl font-bold mb-6">Class Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem._id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <span role="img" aria-label={classItem.className}>
                      📘
                    </span>
                  </Avatar>
                  <span>{classItem.className.toUpperCase()}</span>
                </div>
              </CardTitle>
              <Badge
                variant={
                  classItem.studentList.length >= classItem.maxStudents
                    ? "destructive"
                    : "default"
                }
              >
                {classItem.studentList.length >= classItem.maxStudents
                  ? "Full"
                  : "Active"}
              </Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Users className="inline-block mr-2" size={16} />
                      Teacher
                    </TableCell>
                    <TableCell>{classItem.teacherName.toUpperCase()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Book className="inline-block mr-2" size={16} />
                      Students
                    </TableCell>
                    <TableCell>
                      {classItem.studentList.length}{" "}
                      <button
                        onClick={() => toggleDropdown(classItem._id)}
                        className="text-gray-100 ml-2"
                      >
                        {openDropdown[classItem._id] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                  {openDropdown[classItem._id] && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <ul className="list-disc pl-6">
                          {classItem.studentList.map((student, index) => (
                            <li key={index} className="text-sm">
                              {student}{" "}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">
                      <Baby className="inline-block mr-2" size={16} />
                      Students Allowed
                    </TableCell>
                    <TableCell>{classItem.maxStudents}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <CalendarDays className="inline-block mr-2" size={16} />
                      Year
                    </TableCell>
                    <TableCell>{classItem.year}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className=" mt-10 ml-4 align-center justify-center border-black  ">
        <h2 className="text-3xl font-bold mb-6">
          Gender Distribution in School
        </h2>
        <GenderCount />
      </div>
    </div>
  );
}
