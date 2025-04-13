import React, { useState } from 'react'
import { useExpense } from '../context/ExpenseContext'

const TransactionForm = ({ type, onSuccess }) => {
  const { categories, addTransaction, getCurrentUser } = useExpense()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  
  const currentUser = getCurrentUser()
  const categoryOptions = type === 'income' ? categories.income : categories.expense

  // If no user is logged in, show a message
  if (!currentUser) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Add New {type === 'income' ? 'Income' : 'Expense'}
        </h3>
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
          Please log in to add transactions.
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Validate form
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    if (!category) {
      setError('Please select a category')
      return
    }
    
    if (!date) {
      setError('Date is required')
      return
    }
    
    // Add transaction
    addTransaction({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date
    })
    
    // Reset form
    setTitle('')
    setAmount('')
    setCategory('')
    setDate(new Date().toISOString().split('T')[0])
    
    // Notify parent component
    if (onSuccess) {
      onSuccess()
    }
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Add New {type === 'income' ? 'Income' : 'Expense'}
      </h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={`Enter ${type} title`}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            type === 'income'
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  )
}

export default TransactionForm 