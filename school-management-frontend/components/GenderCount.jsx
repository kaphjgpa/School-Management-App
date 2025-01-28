import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios"; // Import axios for API requests

// COLORS for the pie chart sections
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

export function GenderCount() {
  const [genderCounts, setGenderCounts] = useState({
    male: 0,
    female: 0,
    other: 0,
  });
  // Fetching data from the backend server
  useEffect(() => {
    // Make API request to fetch gender counts from the backend
    const fetchGenderData = async () => {
      try {
        const response = await axios.get(
          "https://school-management-app-lkep.onrender.com/api/admin/gender-count"
        ); // Adjust the URL to your API endpoint
        const data = response.data;

        setGenderCounts({
          male: data.male || 0,
          female: data.female || 0,
          other: data.other || 0,
        });
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };

    fetchGenderData();
  }, []);

  // Prepare data for the chart
  const data = [
    { name: "Male", value: genderCounts.male },
    { name: "Female", value: genderCounts.female },
    { name: "Other", value: genderCounts.other },
  ];

  return (
    <ChartContainer
      config={{
        male: {
          label: "Male",
          color: COLORS[0],
        },
        female: {
          label: "Female",
          color: COLORS[1],
        },
      }}
      className="h-[280px]"
    >
      <PieChart>
        <Pie
          data={data}
          cx="70%"
          cy="70%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
