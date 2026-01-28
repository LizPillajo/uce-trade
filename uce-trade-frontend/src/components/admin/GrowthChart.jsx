// src/components/admin/GrowthChart.jsx
import { Paper, Typography, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GrowthChart = ({ data }) => (
  <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb", height: "100%" }}>
    <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>User Growth</Typography>
    <Box sx={{ width: "99%", height: 350 }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
            <Tooltip />
            <Line type="monotone" dataKey="val" stroke="#efb034" strokeWidth={3} dot={{ r: 4, fill: "#efb034" }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography align="center" color="text.secondary" mt={10}>No historical data yet.</Typography>
      )}
    </Box>
  </Paper>
);

export default GrowthChart;