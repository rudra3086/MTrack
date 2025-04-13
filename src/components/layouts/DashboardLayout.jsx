import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiTrendingUp, FiTrendingDown, FiLogOut, FiMenu, FiX, FiUser } from 'react-icons/fi'
import { logout, getCurrentUser } from '../../utils/auth'
import { useExpense } from '../../context/ExpenseContext'
import logoImage from '../../assets/images/mtrack-removebg-preview.png'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoading } = useExpense()

  useEffect(() => {
    // Get current user
    const currentUser = getCurrentUser()
    if (!currentUser) {
      navigate('/login')
    } else {
      setUser(currentUser)
    }
  }, [navigate, isLoading])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Income', path: '/income', icon: <FiTrendingUp className="w-5 h-5" /> },
    { name: 'Expense', path: '/expense', icon: <FiTrendingDown className="w-5 h-5" /> },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-40 px-2 border-b overflow-hidden">
            <Link to="/dashboard" className="flex items-center justify-center w-full py-2">
              <img 
                src={logoImage} 
                alt="MTrack Logo" 
                className="h-32 w-auto object-contain" 
                loading="eager"
                style={{ maxHeight: '128px' }}
              />
            </Link>
          </div>

          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <button
            className="p-1 rounded-md lg:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            {user && (
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600">
                  <FiUser className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Welcome, {user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 