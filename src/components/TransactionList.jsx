import React from 'react'
import { useExpense } from '../context/ExpenseContext'
import { FiTrash } from 'react-icons/fi'

const TransactionList = ({ type }) => {
  const { deleteTransaction, getCurrentUser } = useExpense()
  const transactions = useExpense()[type === 'income' ? 'getIncomeTransactions' : 'getExpenseTransactions']()
  const currentUser = getCurrentUser()
  
  // If no user is logged in, show a message
  if (!currentUser) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-yellow-600">Please log in to view your transactions.</p>
      </div>
    )
  }
  
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No {type} transactions found.</p>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="p-4 border-b text-lg font-medium">
        {type === 'income' ? 'Income' : 'Expense'} Transactions
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete transaction"
                  >
                    <FiTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionList 