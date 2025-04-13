/**
 * Utility to export transaction data as Excel files
 */

/**
 * Convert transactions data to CSV format and trigger download
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - Type of transactions ('income', 'expense' or 'all')
 */
export const exportToExcel = (transactions, type) => {
  // Define headers
  const headers = ['Date', 'Title', 'Category', 'Amount', 'Type'];
  
  // Format transaction data for CSV
  const data = transactions.map(trans => [
    trans.date,
    trans.title,
    trans.category,
    trans.amount.toFixed(2),
    trans.type
  ]);
  
  // Add headers to data
  const csvContent = [headers, ...data]
    .map(row => row.join(','))
    .join('\n');
  
  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element and trigger download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${type}-transactions.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 