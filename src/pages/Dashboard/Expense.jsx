import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import TransactionList from '../../components/TransactionList'
import TransactionForm from '../../components/TransactionForm'
import SummaryCard from '../../components/SummaryCard'
import ExportButton from '../../components/ExportButton'
import { useExpense } from '../../context/ExpenseContext'

const Expense = () => {
  const { getTotalExpense, isLoading } = useExpense()
  const [showAddForm, setShowAddForm] = useState(false)
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-600">Manage your expenses</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <ExportButton type="expense" />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {showAddForm ? 'Hide Form' : 'Add New Expense'}
          </button>
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="mb-6">
        <SummaryCard 
          title="Total Expenses" 
          amount={getTotalExpense()} 
          type="expense" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Form */}
        {showAddForm && (
          <div className="lg:col-span-1">
            <TransactionForm 
              type="expense" 
              onSuccess={() => setShowAddForm(false)} 
            />
          </div>
        )}
        
        {/* Expense List */}
        <div className={showAddForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <TransactionList type="expense" />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Expense
