// Use Google Apps Script Web App as backend
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

// Use Vercel serverless function as CORS proxy
const getApiUrl = () => {
  // In production, use our Vercel proxy to avoid CORS
  if (import.meta.env.PROD) {
    return '/api/proxy';
  }
  // In development, call directly (will have CORS issues but that's okay for now)
  return SCRIPT_URL;
};

// Helper function to convert row data to problem object
const rowToProblem = (row) => {
  if (!row || typeof row !== 'object') return null;
  
  return {
    _id: row.id || Date.now().toString(),
    problemNo: parseInt(row.problemNo) || 0,
    problemName: row.problemName || '',
    problemLink: row.problemLink || '',
    topic: row.topic || '',
    coreIdea: row.coreIdea || '',
    mistake: row.mistake || '',
    status: row.status || 'Solved',
    helpUsed: row.helpUsed === 'TRUE' || row.helpUsed === true,
    revisit: row.revisit === 'TRUE' || row.revisit === true,
    dateSolved: row.dateSolved || new Date().toISOString(),
    notes: row.notes || '',
  };
};

export const getAllProblems = async () => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}?action=getAll`, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }

    const data = await response.json();
    
    const problems = (data.data || [])
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
    const apiUrl = getApiUrl();
    const newProblem = {
      ...problem,
      id: Date.now().toString(),
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'insert',
        data: newProblem,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to insert data to Google Sheets');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error inserting problem:', error);
    throw error;
  }
};

export const updateProblem = async (id, updates) => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        id: id,
        data: updates,
      }),
    });

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
    const apiUrl = getApiUrl();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        id: id,
      }),
    });

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
