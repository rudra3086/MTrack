import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import SummaryCard from '../../components/SummaryCard'
import ExportButton from '../../components/ExportButton'
import MonthlyChart from '../../components/MonthlyChart'
import MonthlyTrend from '../../components/MonthlyTrend'
import { useExpense } from '../../context/ExpenseContext'
import { FiPieChart, FiRefreshCw } from 'react-icons/fi'

const Home = () => {
  const [showResetModal, setShowResetModal] = useState(false)
  const [showLoadSampleModal, setShowLoadSampleModal] = useState(false)
  
  const { 
    getTotalIncome, 
    getTotalExpense, 
    getBalance,
    getIncomeByCategory,
    getExpenseByCategory,
    resetUserData,
    loadSampleData,
    isLoading
  } = useExpense()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  const totalIncome = getTotalIncome()
  const totalExpense = getTotalExpense()
  const balance = getBalance()
  
  // Get top categories
  const incomeByCategory = getIncomeByCategory()
  const expenseByCategory = getExpenseByCategory()
  
  const topIncomeCategory = Object.entries(incomeByCategory)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 3)
  
  const topExpenseCategory = Object.entries(expenseByCategory)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 3)
    
  const handleReset = () => {
    resetUserData()
    setShowResetModal(false)
  }
  
  const handleLoadSample = () => {
    loadSampleData()
    setShowLoadSampleModal(false)
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome to your financial summary</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setShowLoadSampleModal(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4 mr-1" />
            <span>Load Sample</span>
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4 mr-1" />
            <span>Reset Data</span>
          </button>
          <ExportButton type="all" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard 
          title="Total Balance" 
          amount={balance} 
          type="balance" 
        />
        <SummaryCard 
          title="Total Income" 
          amount={totalIncome} 
          type="income" 
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={totalExpense} 
          type="expense" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bar Chart */}
        <MonthlyChart />
        {/* Monthly Trend Chart */}
        <MonthlyTrend />
      </div>

      {/* Category Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Income Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FiPieChart className="text-green-500 w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium">Top Income Sources</h3>
          </div>
          
          {topIncomeCategory.length > 0 ? (
            <div className="space-y-4">
              {topIncomeCategory.map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700">{category}</span>
                  </div>
                  <span className="font-medium text-green-600">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No income data available</p>
          )}
        </div>

        {/* Top Expense Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FiPieChart className="text-red-500 w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium">Top Expense Categories</h3>
          </div>
          
          {topExpenseCategory.length > 0 ? (
            <div className="space-y-4">
              {topExpenseCategory.map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                    <span className="text-gray-700">{category}</span>
                  </div>
                  <span className="font-medium text-red-600">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No expense data available</p>
          )}
        </div>
      </div>
      
      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reset Your Data</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all your financial data? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Load Sample Data Modal */}
      {showLoadSampleModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Load Sample Data</h3>
            <p className="text-gray-600 mb-6">
              This will replace your current data with sample transactions for demonstration purposes.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLoadSampleModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Home
