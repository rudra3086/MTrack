import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useExpense } from '../context/ExpenseContext';

const MonthlyChart = () => {
  const { transactions } = useExpense();
  
  // Check if there are any transactions
  const hasTransactions = transactions.length > 0;

  // Process data for the chart
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Initialize monthly data with all months
    const monthlyData = months.map(month => ({
      name: month,
      income: 0,
      expense: 0
    }));
    
    // Group transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      // Only include transactions from the current year
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (transaction.type === 'income') {
          monthlyData[monthIndex].income += transaction.amount;
        } else {
          monthlyData[monthIndex].expense += transaction.amount;
        }
      }
    });
    
    return monthlyData;
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Monthly Income & Expenses</h3>
      
      {hasTransactions ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => ['$' + value.toFixed(2)]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4ade80" />
              <Bar dataKey="expense" name="Expense" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500">
          <p>Add transactions to see your monthly data</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyChart; 