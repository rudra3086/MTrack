// Check if user is logged in
export const isLoggedIn = () => {
  // Check session storage first (for current browser session)
  const user = sessionStorage.getItem('user')
  if (user) return true
  
  // If no session, check cookie
  return getCookie('userId') !== null
}

// Get the currently logged in user
export const getCurrentUser = () => {
  const sessionUser = sessionStorage.getItem('user')
  if (sessionUser) return JSON.parse(sessionUser)
  
  // If no session but cookie exists, try to find the user
  const userId = getCookie('userId')
  if (userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.id === userId)
    if (user) {
      // Recreate session from cookie
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email
      }
      sessionStorage.setItem('user', JSON.stringify(sessionData))
      
      // Dispatch event to load user data
      window.dispatchEvent(new Event('userStateChanged'))
      
      return sessionData
    }
  }
  
  return null
}

// Login user
export const login = (user) => {
  // Store in session storage
  sessionStorage.setItem('user', JSON.stringify(user))
  
  // Store in cookie for persistence
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30) // Expires in 30 days for longer persistence
  document.cookie = `userId=${user.id}; expires=${expiryDate.toUTCString()}; path=/;`

  // Make sure the user is in the users list in localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (!users.some(u => u.id === user.id)) {
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
  }
  
  // Dispatch event for contexts to update
  window.dispatchEvent(new Event('userStateChanged'))
}

// Logout user
export const logout = () => {
  // Clear session storage
  sessionStorage.removeItem('user')
  
  // Clear cookie
  document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  
  // Dispatch event for contexts to update
  window.dispatchEvent(new Event('userStateChanged'))
}

// Helper to get cookie by name
export const getCookie = (name) => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    
  if (cookieValue) {
    return cookieValue.split('=')[1]
  }
  
  return null
}

// Restore user session from cookie if available
export const restoreUserSession = () => {
  // If we already have a session, no need to restore
  if (sessionStorage.getItem('user')) return true
  
  // Try to restore from cookie
  const userId = getCookie('userId')
  if (userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.id === userId)
    if (user) {
      // Recreate session
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email
      }
      sessionStorage.setItem('user', JSON.stringify(sessionData))
      
      // Dispatch event to notify components
      window.dispatchEvent(new Event('userStateChanged'))
      
      return true
    }
  }
  
  return false
} 