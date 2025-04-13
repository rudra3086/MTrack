import React, { useState, useEffect } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import { login, isLoggedIn } from '../../utils/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    if (isLoggedIn()) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validate form
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      // Get users from local storage
      const usersString = localStorage.getItem('users') || '[]'
      const users = JSON.parse(usersString)
      
      // Find user with matching credentials
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        // Use the enhanced login function from auth.js
        login({
          id: user.id,
          name: user.name,
          email: user.email
        })
        
        navigate('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      setError('An error occurred during login')
    }
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to login
        </p>
        
        {error && <div className="p-2 mb-4 text-sm text-red-500 bg-red-100 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signUp" className="text-purple-600 hover:text-purple-800 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
