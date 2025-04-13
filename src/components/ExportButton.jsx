import React from 'react';
import { FiDownload } from 'react-icons/fi';
import { exportToExcel } from '../utils/excelExport';
import { useExpense } from '../context/ExpenseContext';

const ExportButton = ({ type = 'all' }) => {
  const { 
    transactions, 
    getIncomeTransactions, 
    getExpenseTransactions 
  } = useExpense();
  
  const handleExport = () => {
    let dataToExport;
    
    if (type === 'income') {
      dataToExport = getIncomeTransactions();
    } else if (type === 'expense') {
      dataToExport = getExpenseTransactions();
    } else {
      dataToExport = transactions;
    }
    
    if (dataToExport.length === 0) {
      alert('No data to export');
      return;
    }
    
    exportToExcel(dataToExport, type);
  };
  
  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      title={`Export ${type} transactions as CSV`}
    >
      <FiDownload className="w-4 h-4" />
      <span>Export CSV</span>
    </button>
  );
};

export default ExportButton; 