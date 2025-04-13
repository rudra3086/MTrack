import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import TransactionList from '../../components/TransactionList'
import TransactionForm from '../../components/TransactionForm'
import SummaryCard from '../../components/SummaryCard'
import ExportButton from '../../components/ExportButton'
import { useExpense } from '../../context/ExpenseContext'

const Income = () => {
  const { getTotalIncome, isLoading } = useExpense()
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
          <h1 className="text-2xl font-bold text-gray-800">Income</h1>
          <p className="text-gray-600">Manage your income sources</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <ExportButton type="income" />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {showAddForm ? 'Hide Form' : 'Add New Income'}
          </button>
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="mb-6">
        <SummaryCard 
          title="Total Income" 
          amount={getTotalIncome()} 
          type="income" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Form */}
        {showAddForm && (
          <div className="lg:col-span-1">
            <TransactionForm 
              type="income" 
              onSuccess={() => setShowAddForm(false)} 
            />
          </div>
        )}
        
        {/* Income List */}
        <div className={showAddForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <TransactionList type="income" />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Income
