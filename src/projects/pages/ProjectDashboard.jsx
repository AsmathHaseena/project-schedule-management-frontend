import React, { useContext, useEffect, useState } from "react"
import ProjectList from "../components/ProjectList"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"

const ProjectDashboard = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [projects, setProjects] = useState()
  const auth = useContext(AuthContext)
  const userId = auth.userId
  const role = auth.role

  useEffect(() => {
    if (role === "Admin") {
      const fetchProjects = async () => {
        try {
          const responseData = await sendRequest(
            "http://localhost:5000/api/projects"
          )

          setProjects(responseData.projects)
        } catch (err) {}
      }
      fetchProjects()
    } else {
      const fetchProjects = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/projects/user/${userId}`
          )

          setProjects(responseData.projects)
        } catch (err) {}
      }
      fetchProjects()
    }
  }, [sendRequest, role, userId])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && projects && <ProjectList projects={projects} />}
    </React.Fragment>
  )
}

export default ProjectDashboard
