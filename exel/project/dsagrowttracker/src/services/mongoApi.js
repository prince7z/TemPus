const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Column mapping for Google Sheets (A-L)
const COLUMNS = {
  id: 'A',
  problemNo: 'B',
  problemName: 'C',
  problemLink: 'D',
  topic: 'E',
  coreIdea: 'F',
  mistake: 'G',
  status: 'H',
  helpUsed: 'I',
  revisit: 'J',
  dateSolved: 'K',
  notes: 'L',
};

const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;

// Helper function to convert row data to problem object
const rowToProblem = (row) => {
  if (!row || row.length === 0) return null;
  
  return {
    _id: row[0] || Date.now().toString(),
    problemNo: parseInt(row[1]) || 0,
    problemName: row[2] || '',
    problemLink: row[3] || '',
    topic: row[4] || '',
    coreIdea: row[5] || '',
    mistake: row[6] || '',
    status: row[7] || 'Solved',
    helpUsed: row[8] === 'TRUE' || row[8] === true,
    revisit: row[9] === 'TRUE' || row[9] === true,
    dateSolved: row[10] || new Date().toISOString(),
    notes: row[11] || '',
  };
};

// Helper function to convert problem object to row data
const problemToRow = (problem) => [
  problem._id || Date.now().toString(),
  problem.problemNo || 0,
  problem.problemName || '',
  problem.problemLink || '',
  problem.topic || '',
  problem.coreIdea || '',
  problem.mistake || '',
  problem.status || 'Solved',
  problem.helpUsed ? 'TRUE' : 'FALSE',
  problem.revisit ? 'TRUE' : 'FALSE',
  problem.dateSolved || new Date().toISOString(),
  problem.notes || '',
];

export const getAllProblems = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/values/Sheet1!A2:L?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }

    const data = await response.json();
    const rows = data.values || [];
    
    const problems = rows
      .map(rowToProblem)
      .filter(p => p !== null)
      .sort((a, b) => b.problemNo - a.problemNo);

    return problems;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};

export const insertProblem = async (problem) => {
  try {
    const newProblem = {
      ...problem,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const row = problemToRow(newProblem);

    const response = await fetch(
      `${BASE_URL}/values/Sheet1!A:L:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to insert data to Google Sheets');
    }

    const data = await response.json();
    return { insertedId: newProblem._id, ...data };
  } catch (error) {
    console.error('Error inserting problem:', error);
    throw error;
  }
};

export const updateProblem = async (id, updates) => {
  try {
    // First, get all problems to find the row index
    const allProblems = await getAllProblems();
    const problemIndex = allProblems.findIndex(p => p._id === id);
    
    if (problemIndex === -1) {
      throw new Error('Problem not found');
    }

    const rowNumber = problemIndex + 2; // +2 because: +1 for header, +1 for 1-based index
    const updatedProblem = { ...allProblems[problemIndex], ...updates };
    const row = problemToRow(updatedProblem);

    const response = await fetch(
      `${BASE_URL}/values/Sheet1!A${rowNumber}:L${rowNumber}?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update data in Google Sheets');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating problem:', error);
    throw error;
  }
};

export const deleteProblem = async (id) => {
  try {
    // First, get all problems to find the row index
    const allProblems = await getAllProblems();
    const problemIndex = allProblems.findIndex(p => p._id === id);
    
    if (problemIndex === -1) {
      throw new Error('Problem not found');
    }

    const rowNumber = problemIndex + 2; // +2 because: +1 for header, +1 for 1-based index

    // Clear the row data
    const response = await fetch(
      `${BASE_URL}/values/Sheet1!A${rowNumber}:L${rowNumber}:clear?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete data from Google Sheets');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting problem:', error);
    throw error;
  }
};
