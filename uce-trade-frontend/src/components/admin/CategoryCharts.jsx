// src/components/admin/CategoryCharts.jsx
import { Paper, Typography, Box, Grid } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const CategoryCharts = ({ pieData }) => {
  return (
    <Grid container spacing={3}>
      {/* Gráfico Circular */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb", height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Categories Distribution</Typography>
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
      </Grid>

      {/* Gráfico de Barras Detallado */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #e5e7eb", height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Category Details (Volume)</Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#0d2149" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CategoryCharts;