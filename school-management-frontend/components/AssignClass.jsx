import { useState } from "react";
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

export default function AdminUpdateDialog() {
  const [teacherFirstName, setTeacherFirstName] = useState("");
  const [className, setClassName] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!teacherFirstName && !className) {
      setError("All fields are required");
      return;
    }

    console.log("Submitting user details:", {
      teacherFirstName,
      className,
    });

    setTeacherFirstName("");
    setClassName("");
  };

  const handleCancel = () => {
    // Reset form fields on cancel
    setTeacherFirstName("");
    setClassName("");
  };

  return (
    <Card className="w-[300px] h-[350px]">
      <CardHeader>
        <CardTitle>Assign Class to Teacher</CardTitle>
        <CardDescription>
          You can assign any class to any teachcer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contactNumber">Teacher First Name</Label>
              <Input
                id="contactNumber"
                placeholder="Enter teacher's first name"
                value={teacherFirstName}
                onChange={(e) => setTeacherFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Class Name</Label>
              <Input
                id="lastName"
                placeholder="Enter class name eg:- Two"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

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
