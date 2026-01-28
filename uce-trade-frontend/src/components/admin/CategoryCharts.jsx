// src/components/admin/CategoryCharts.jsx
import { Paper, Typography, Box } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const CategoryCharts = ({ pieData }) => {
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb", mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Categories</Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb" }}>
        <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Category Details</Typography>
        <Box sx={{ width: "99%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pieData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" fill="#0d2149" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default CategoryCharts;