import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';
import Form from './components/Form';
import ProblemsTable from './components/Table';
import Stats from './components/Stats';
import { getAllProblems, insertProblem } from './services/sheetsApi';
import './styles.css';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await getAllProblems();
      setProblems(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error loading problems. Check your Google Sheets configuration.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (problemData) => {
    try {
      await insertProblem(problemData);
      setSnackbar({
        open: true,
        message: '✅ Problem saved successfully!',
        severity: 'success',
      });
      fetchProblems();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '❌ Error saving problem. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-background">
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                DSA Growth Tracker
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
                Track problems. Track mistakes. Grow daily.
              </Typography>
            </Box>
          </motion.div>

          {/* Form */}
          <Form onSubmit={handleSubmit} />

          {/* Stats */}
          {!loading && <Stats problems={problems} />}

          {/* Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <ProblemsTable problems={problems} />
          )}

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
              elevation={6}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
