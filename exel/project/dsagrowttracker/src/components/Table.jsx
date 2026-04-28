import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
  Box,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FlagIcon from '@mui/icons-material/Flag';

const ProblemsTable = ({ problems }) => {
  const getRowStyle = (problem) => {
    let backgroundColor = 'transparent';
    
    if (problem.status === 'Solved') {
      backgroundColor = '#e8f5e9'; // light green
    } else if (problem.status === 'Unsolved') {
      backgroundColor = '#ffebee'; // light red
    }
    
    if (problem.revisit) {
      backgroundColor = '#fff9c4'; // yellow highlight
    }
    
    return { backgroundColor };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (problems.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No problems yet. Start tracking your DSA journey! 🚀
        </Typography>
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <TableContainer component={Paper} elevation={2} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Problem</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Topic</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Core Idea</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Mistake</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', textAlign: 'center' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', textAlign: 'center' }}>Help</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', textAlign: 'center' }}>Revisit</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.map((problem, index) => (
              <motion.tr
                key={problem._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                component={TableRow}
                style={getRowStyle(problem)}
              >
                <TableCell>{problem.problemNo}</TableCell>
                <TableCell>
                  <Box>
                    {problem.problemLink ? (
                      <Link 
                        href={problem.problemLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {problem.problemName}
                      </Link>
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {problem.problemName}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={problem.topic} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap>
                    {problem.coreIdea || '-'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap color="error">
                    {problem.mistake || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {problem.status === 'Solved' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <CancelIcon color="error" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {problem.helpUsed && <HelpOutlineIcon color="warning" />}
                </TableCell>
                <TableCell align="center">
                  {problem.revisit && <FlagIcon color="error" />}
                </TableCell>
                <TableCell>{formatDate(problem.dateSolved)}</TableCell>
                <TableCell sx={{ maxWidth: 150 }}>
                  <Typography variant="body2" noWrap>
                    {problem.notes || '-'}
                  </Typography>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};

export default ProblemsTable;
