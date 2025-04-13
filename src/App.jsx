import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import { ExpenseProvider } from './context/ExpenseContext';
import { restoreUserSession, isLoggedIn } from './utils/auth';

const App = () => {
  // Try to restore user session from cookie when app loads
  useEffect(() => {
    restoreUserSession();
  }, []);

  return (
    <ExpenseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login/>}/>
          <Route path="/signUp" exact element={<SignUp/>}/>
          <Route path="/dashboard" exact element={<Home/>}/>
          <Route path="/income" exact element={<Income/>}/>
          <Route path="/expense" exact element={<Expense/>}/>
        </Routes>
      </Router>
    </ExpenseProvider>
  )
}

export default App;

const Root = () => {
  // Check if user is logged in using the updated auth utility
  const authenticated = isLoggedIn();

  // Redirected to dashboard if authenticated otherwise to login
  return authenticated ? (
    <Navigate to="/dashboard"/>
  ) : (
    <Navigate to="/login"/>
  );
}

