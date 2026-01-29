// src/components/student/StudentCharts.jsx
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar} from 'recharts';

export const IncomeHistoryChart = ({ lineData }) => (
  <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', mb: 4 }} elevation={0}>
    <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Income History ($)</Typography>
    <Box sx={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData.length > 0 ? lineData : [{name: 'No Data', income: 0}]}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <Line type="monotone" dataKey="income" stroke="#efb034" strokeWidth={4} dot={{ r: 4, fill: '#efb034', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
);

export const CategoryBarChart = ({ barData }) => (
  <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb', height: '100%' }} elevation={0}>
    <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>Sales by Category</Typography>
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData.length > 0 ? barData : [{category: 'No Data', value: 0}]} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
          <XAxis type="number" hide />
          <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} width={80} />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="value" fill="#0d2149" radius={[0, 10, 10, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
);