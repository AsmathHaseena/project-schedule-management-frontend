import React, { useState, useCallback } from "react"
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom"

import ProjectDashboard from "./projects/pages/ProjectDashboard"
import AddProject from "./projects/pages/AddProject"
import Auth from "./user/pages/Auth.jsx"
import ForgotPassword from "./user/pages/ForgotPassword.jsx"
import SecurityQuestion from "./user/pages/SecurityQuestion.jsx"
import MainNavigation from "./shared/components/Navigation/MainNavigation.jsx"
import { AuthContext } from "./shared/context/auth-context"
import ProjectModal from "./projects/pages/ProjectModal"
import UpdateProject from "./projects/pages/UpdateProject"
import AddTask from "./projects/pages/AddTask"
import ReportsList from "./projects/reports/ReportsList"
import GanttReport from "./projects/reports/GanttReport"
import ResourceAllocatedReport from "./projects/reports/ResourceAllocatedReport"
import BudgetAllocatedReport from "./projects/reports/BudgetAllocatedReport"
import ProjectReport from "./projects/reports/ProjectReport"
import ProjectStatusReport from "./projects/reports/ProjectStatusReport"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(false)
  const [role, setRole] = useState("")

  const login = useCallback((uid, role) => {
    setIsLoggedIn(true)
    setUserId(uid)
    setRole(role)
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUserId(null)
    setRole("")
  }, [])

  let routes

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <ProjectDashboard />
        </Route>
        <Route path="/:projectId/project" exact>
          <ProjectModal />
        </Route>
        <Route path="/project/:projectId">
          <UpdateProject />
        </Route>
        {role === "Admin" && (
          <Route path="/projects/new" exact>
            <AddProject />
          </Route>
        )}
        {role === "Admin" && (
          <Route path="/reports" exact>
            <ReportsList />
          </Route>
        )}
        <Route path="/ganttReport" exact>
          <GanttReport />
        </Route>
        <Route path="/budgetAllocated" exact>
          <BudgetAllocatedReport />
        </Route>
        <Route path="/resourceAllocated" exact>
          <ResourceAllocatedReport />
        </Route>
        <Route path="/projectStatus" exact>
          <ProjectReport />
        </Route>
        <Route
          path="/projectStatus/:status"
          render={({ match }) => (
            <ProjectStatusReport status={match.params.status} />
          )}
        />
        <Route
          path="/task/:projectId"
          render={({ match }) => <AddTask projectId={match.params.projectId} />}
        />
        <Redirect to="/" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/" exact></Route>
        <Route path="/:projectId/project" exact>
          <ProjectModal />
        </Route>
        <Route path="/project/:projectId">
          <UpdateProject />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/forgotPassword">
          <ForgotPassword />
        </Route>
        <Route path="/securityQuestion">
          <SecurityQuestion />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
