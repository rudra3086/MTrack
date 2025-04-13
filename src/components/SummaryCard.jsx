import React from 'react'
import { FiDollarSign, FiArrowUp, FiArrowDown } from 'react-icons/fi'

const SummaryCard = ({ title, amount, type }) => {
  const getIcon = () => {
    if (type === 'income') return <FiArrowUp className="w-5 h-5" />
    if (type === 'expense') return <FiArrowDown className="w-5 h-5" />
    return <FiDollarSign className="w-5 h-5" />
  }
  
  const getIconBackground = () => {
    if (type === 'income') return 'bg-green-100 text-green-600'
    if (type === 'expense') return 'bg-red-100 text-red-600'
    return 'bg-purple-100 text-purple-600'
  }
  
  const getAmountColor = () => {
    if (type === 'income') return 'text-green-600'
    if (type === 'expense') return 'text-red-600'
    return 'text-purple-600'
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${getIconBackground()}`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-semibold ${getAmountColor()}`}>
            ${amount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard 