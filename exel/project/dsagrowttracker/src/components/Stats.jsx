import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { motion } from 'framer-motion';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FlagIcon from '@mui/icons-material/Flag';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Stats = ({ problems }) => {
  const totalProblems = problems.length;
  const solvedCount = problems.filter((p) => p.status === 'Solved').length;
  const unsolvedCount = problems.filter((p) => p.status === 'Unsolved').length;
  const revisitCount = problems.filter((p) => p.revisit).length;
  const helpUsedCount = problems.filter((p) => p.helpUsed).length;

  const stats = [
    {
      label: 'Total Problems',
      value: totalProblems,
      icon: <AssignmentIcon />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      label: 'Solved',
      value: solvedCount,
      icon: <CheckCircleIcon />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Unsolved',
      value: unsolvedCount,
      icon: <CancelIcon />,
      color: '#d32f2f',
      bgColor: '#ffebee',
    },
    {
      label: 'Revisit',
      value: revisitCount,
      icon: <FlagIcon />,
      color: '#f57c00',
      bgColor: '#fff3e0',
    },
    {
      label: 'Help Used',
      value: helpUsedCount,
      icon: <HelpOutlineIcon />,
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card
                elevation={2}
                sx={{
                  bgcolor: stat.bgColor,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Box sx={{ color: stat.color, mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: 'bold', color: stat.color, mb: 0.5 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Stats;
