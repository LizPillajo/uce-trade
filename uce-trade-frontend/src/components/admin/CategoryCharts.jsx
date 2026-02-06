import { Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, YAxis, CartesianGrid } from "recharts";
import ChartCard from "../common/ChartCard"; // <--- Importamos

const CategoryCharts = ({ pieData }) => {
  return (
    <Grid container spacing={3}>
      {/* Gráfico Circular */}
      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard title="Categories Distribution">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ChartCard>
      </Grid>

      {/* Gráfico de Barras */}
      <Grid size={{ xs: 12, md: 8 }}>
        <ChartCard title="Category Details (Volume)">
             <BarChart data={pieData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#0d2149" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
        </ChartCard>
      </Grid>
    </Grid>
  );
};

export default CategoryCharts;