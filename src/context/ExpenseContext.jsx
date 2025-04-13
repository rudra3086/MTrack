import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../utils/auth'

// Create the context
const ExpenseContext = createContext()

// Sample data only for demo purposes - not used for new users anymore
const sampleTransactions = [
  { id: 1, title: 'Salary', amount: 5000, type: 'income', category: 'Salary', date: '2023-06-01' },
  { id: 2, title: 'Rent', amount: 1200, type: 'expense', category: 'Housing', date: '2023-06-05' },
  { id: 3, title: 'Groceries', amount: 200, type: 'expense', category: 'Food', date: '2023-06-08' },
  { id: 4, title: 'Freelance Work', amount: 800, type: 'income', category: 'Freelance', date: '2023-06-15' },
  { id: 5, title: 'Restaurant', amount: 75, type: 'expense', category: 'Food', date: '2023-06-18' },
  { id: 6, title: 'Utilities', amount: 150, type: 'expense', category: 'Utilities', date: '2023-06-20' },
  // Add more mock data with different months to better demonstrate the charts
  { id: 7, title: 'Salary', amount: 5000, type: 'income', category: 'Salary', date: '2023-05-01' },
  { id: 8, title: 'Bonus', amount: 1000, type: 'income', category: 'Salary', date: '2023-05-10' },
  { id: 9, title: 'Rent', amount: 1200, type: 'expense', category: 'Housing', date: '2023-05-05' },
  { id: 10, title: 'Groceries', amount: 250, type: 'expense', category: 'Food', date: '2023-05-12' },
  { id: 11, title: 'Salary', amount: 5000, type: 'income', category: 'Salary', date: '2023-04-01' },
  { id: 12, title: 'Rent', amount: 1200, type: 'expense', category: 'Housing', date: '2023-04-05' },
  { id: 13, title: 'Car Repair', amount: 450, type: 'expense', category: 'Transportation', date: '2023-04-18' },
  { id: 14, title: 'Freelance Work', amount: 1200, type: 'income', category: 'Freelance', date: '2023-04-22' }
]

// Categories for expenses and income
const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
  expense: ['Food', 'Housing', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Education', 'Personal', 'Other']
}

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Get current user
  const getUser = () => {
    return getCurrentUser()
  }

  // Get storage key for current user
  const getUserStorageKey = () => {
    const user = getUser()
    return user ? `transactions_${user.id}` : null
  }

  // Check if user is a first-time user
  const isFirstTimeUser = (userId) => {
    return !localStorage.getItem(`transactions_${userId}`)
  }

  // Load data on initial render or when user changes
  useEffect(() => {
    const loadData = () => {
      try {
        const user = getUser()
        
        if (!user) {
          // If no user is logged in, set empty transactions
          setTransactions([])
          setIsLoading(false)
          return
        }
        
        const storageKey = getUserStorageKey()
        const storedTransactions = localStorage.getItem(storageKey)
        
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions))
        } else {
          // For first-time users, initialize with empty array
          const emptyTransactions = []
          setTransactions(emptyTransactions)
          localStorage.setItem(storageKey, JSON.stringify(emptyTransactions))
        }
      } catch (error) {
        console.error('Error loading transaction data:', error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    
    // Add event listener for login/logout events
    window.addEventListener('userStateChanged', loadData)
    
    return () => {
      window.removeEventListener('userStateChanged', loadData)
    }
  }, [])

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const storageKey = getUserStorageKey()
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(transactions))
      }
    }
  }, [transactions, isLoading])

  // Add a new transaction
  const addTransaction = (transaction) => {
    if (!getUser()) return // Don't add if no user is logged in
    
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: transaction.date || new Date().toISOString().split('T')[0],
      userId: getUser().id
    }
    setTransactions([...transactions, newTransaction])
  }

  // Delete a transaction
  const deleteTransaction = (id) => {
    if (!getUser()) return // Don't delete if no user is logged in
    
    setTransactions(transactions.filter(transaction => transaction.id !== id))
  }

  // Reset all user data
  const resetUserData = () => {
    const user = getUser()
    if (!user) return false

    const storageKey = getUserStorageKey()
    if (storageKey) {
      // Clear transactions
      setTransactions([])
      localStorage.setItem(storageKey, JSON.stringify([]))
      return true
    }
    return false
  }

  // Load sample data (for testing or demo)
  const loadSampleData = () => {
    const user = getUser()
    if (!user) return false

    setTransactions(sampleTransactions.map(transaction => ({
      ...transaction,
      userId: user.id
    })))
    return true
  }

  // Get all income transactions for current user
  const getIncomeTransactions = () => {
    if (!getUser()) return []
    
    return transactions.filter(transaction => 
      transaction.type === 'income' && 
      (!transaction.userId || transaction.userId === getUser().id)
    )
  }

  // Get all expense transactions for current user
  const getExpenseTransactions = () => {
    if (!getUser()) return []
    
    return transactions.filter(transaction => 
      transaction.type === 'expense' && 
      (!transaction.userId || transaction.userId === getUser().id)
    )
  }

  // Calculate total income for current user
  const getTotalIncome = () => {
    return getIncomeTransactions().reduce((total, transaction) => total + transaction.amount, 0)
  }

  // Calculate total expense for current user
  const getTotalExpense = () => {
    return getExpenseTransactions().reduce((total, transaction) => total + transaction.amount, 0)
  }

  // Calculate balance for current user
  const getBalance = () => {
    return getTotalIncome() - getTotalExpense()
  }

  // Calculate income by category for current user
  const getIncomeByCategory = () => {
    const result = {}
    getIncomeTransactions().forEach(transaction => {
      if (result[transaction.category]) {
        result[transaction.category] += transaction.amount
      } else {
        result[transaction.category] = transaction.amount
      }
    })
    return result
  }

  // Calculate expense by category for current user
  const getExpenseByCategory = () => {
    const result = {}
    getExpenseTransactions().forEach(transaction => {
      if (result[transaction.category]) {
        result[transaction.category] += transaction.amount
      } else {
        result[transaction.category] = transaction.amount
      }
    })
    return result
  }

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        categories,
        isLoading,
        addTransaction,
        deleteTransaction,
        getIncomeTransactions,
        getExpenseTransactions,
        getTotalIncome,
        getTotalExpense,
        getBalance,
        getIncomeByCategory,
        getExpenseByCategory,
        resetUserData,
        loadSampleData,
        getCurrentUser: getUser
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

// Custom hook to use the expense context
export const useExpense = () => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider')
  }
  return context
} 