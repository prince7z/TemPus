import { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const TOPICS = [
  'Arrays',
  'Strings',
  'Linked List',
  'Stack',
  'Queue',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Recursion',
  'Backtracking',
  'Greedy',
  'Dynamic Programming',
  'Trees',
  'BST',
  'Heaps',
  'Graphs',
  'DFS',
  'BFS',
  'Tries',
  'Bit Manipulation',
  'Math',
  'Prefix Sum',
  'Matrix',
];

const initialFormState = {
  problemNo: '',
  problemName: '',
  problemLink: '',
  topic: '',
  coreIdea: '',
  mistake: '',
  status: 'Solved',
  helpUsed: false,
  revisit: false,
  dateSolved: dayjs(),
  notes: '',
};

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const problemData = {
      problemNo: parseInt(formData.problemNo) || 0,
      problemName: formData.problemName,
      problemLink: formData.problemLink,
      topic: formData.topic,
      coreIdea: formData.coreIdea,
      mistake: formData.mistake,
      status: formData.status,
      helpUsed: formData.helpUsed,
      revisit: formData.revisit,
      dateSolved: formData.dateSolved?.toISOString() || new Date().toISOString(),
      notes: formData.notes,
    };

    await onSubmit(problemData);
    setFormData(initialFormState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Problem No"
                type="number"
                value={formData.problemNo}
                onChange={(e) => handleChange('problemNo', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Problem Name"
                value={formData.problemName}
                onChange={(e) => handleChange('problemName', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Problem Link"
                value={formData.problemLink}
                onChange={(e) => handleChange('problemLink', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth required>
                <InputLabel>Topic</InputLabel>
                <Select
                  value={formData.topic}
                  label="Topic"
                  onChange={(e) => handleChange('topic', e.target.value)}
                >
                  {TOPICS.map((topic) => (
                    <MenuItem key={topic} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Core Idea"
                value={formData.coreIdea}
                onChange={(e) => handleChange('coreIdea', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="What I Did Wrong"
                multiline
                rows={2}
                value={formData.mistake}
                onChange={(e) => handleChange('mistake', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <MenuItem value="Solved">Solved</MenuItem>
                  <MenuItem value="Unsolved">Unsolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Solved"
                  value={formData.dateSolved}
                  onChange={(newValue) => handleChange('dateSolved', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.helpUsed}
                      onChange={(e) => handleChange('helpUsed', e.target.checked)}
                    />
                  }
                  label="Help Used"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.revisit}
                      onChange={(e) => handleChange('revisit', e.target.checked)}
                    />
                  }
                  label="Revisit"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.5,
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Save Problem
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
};

export default Form;
