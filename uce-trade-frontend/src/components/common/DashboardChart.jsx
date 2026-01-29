// src/components/common/DashboardChart.jsx
import { Paper, Typography, Box } from "@mui/material";
// Importaciones separadas de Recharts para evitar el error de Vite
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DashboardChart = ({ title, data, dataKey, color = "#efb034" }) => (
  <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb' }} elevation={0}>
    <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={2}>{title}</Typography>
    <Box sx={{ width: '100%', height: 400, minHeight: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.length > 0 ? data : [{name: 'No Data', [dataKey]: 0}]}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={4} 
            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
);

export default DashboardChart;