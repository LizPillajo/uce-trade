import { Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import StatCard from '../common/StatCard'; 

const StudentKpiCards = ({ kpi }) => {
  const data = [
    { title: "Total Earnings", value: `$${kpi?.earnings || 0}`, badge: "Revenue", icon: <TrendingUpIcon />, color: "#10b981"},
    { title: "Active Services", value: kpi?.products || 0, badge: "Published", icon: <InventoryIcon />, color: "#8b5cf6"},
    { title: "Total Sales", value: kpi?.sales || 0, badge: "Orders", icon: <MessageIcon />, color: "#3b82f6"},
    { title: "Avg Rating",  value: kpi?.rating || "0.0", badge: "Stars", icon: <StarIcon />, color: "#f59e0b"},
  ];

  return (
    <Grid container spacing={3} mb={6}>
      {data.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <StatCard {...item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StudentKpiCards;