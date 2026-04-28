// Google Apps Script for DSA Growth Tracker
// Deploy this as a Web App to enable read/write operations

// Your Sheet ID (replace with your actual Sheet ID)
const SHEET_ID = '14-gzuQ4T9RDjjuKPkUFD6ujY5jyi29f38WBf874UDGc';

// Helper function to get the sheet (uses first sheet if SHEET_NAME not specified)
function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  // Try to get the first sheet (index 0)
  const sheet = ss.getSheets()[0];
  if (!sheet) {
    throw new Error('No sheets found in the spreadsheet');
  }
  return sheet;
}

// Helper function to convert row array to object
function rowToObject(row) {
  if (!row || row.length === 0) return null;
  
  return {
    id: row[0] || '',
    problemNo: row[1] || 0,
    problemName: row[2] || '',
    problemLink: row[3] || '',
    topic: row[4] || '',
    coreIdea: row[5] || '',
    mistake: row[6] || '',
    status: row[7] || 'Solved',
    helpUsed: row[8] || 'FALSE',
    revisit: row[9] || 'FALSE',
    dateSolved: row[10] || '',
    notes: row[11] || '',
  };
}

// Helper function to convert object to row array
function objectToRow(obj) {
  return [
    obj.id || '',
    obj.problemNo || 0,
    obj.problemName || '',
    obj.problemLink || '',
    obj.topic || '',
    obj.coreIdea || '',
    obj.mistake || '',
    obj.status || 'Solved',
    obj.helpUsed ? 'TRUE' : 'FALSE',
    obj.revisit ? 'TRUE' : 'FALSE',
    obj.dateSolved || new Date().toISOString(),
    obj.notes || '',
  ];
}

// Handle GET requests
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getAll') {
      const sheet = getSheet();
      const data = sheet.getDataRange().getValues();
      
      // Skip header row (first row)
      const rows = data.slice(1);
      const problems = rows.map(rowToObject).filter(p => p && p.id);
      
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, data: problems })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Test endpoint
    if (action === 'test') {
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: 'API is working!' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Invalid action' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    const sheet = getSheet();
    
    if (action === 'insert') {
      // Add new row
      const newRow = objectToRow(requestData.data);
      sheet.appendRow(newRow);
      
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, message: 'Problem added successfully' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'update') {
      // Find and update row
      const id = requestData.id;
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
        if (data[i][0] === id) {
          const existingData = rowToObject(data[i]);
          const updatedData = { ...existingData, ...requestData.data };
          const updatedRow = objectToRow(updatedData);
          
          // Update the row (i+1 because sheet rows are 1-indexed)
          sheet.getRange(i + 1, 1, 1, 12).setValues([updatedRow]);
          
          return ContentService.createTextOutput(
            JSON.stringify({ success: true, message: 'Problem updated successfully' })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: 'Problem not found' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'delete') {
      // Find and delete row
      const id = requestData.id;
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
        if (data[i][0] === id) {
          sheet.deleteRow(i + 1); // i+1 because sheet rows are 1-indexed
          
          return ContentService.createTextOutput(
            JSON.stringify({ success: true, message: 'Problem deleted successfully' })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: 'Problem not found' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Invalid action' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
