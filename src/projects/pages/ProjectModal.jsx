import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useHttpClient } from "../../shared/hooks/http-hook"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import ProjectDetails from "../components/ProjectDetails"

const ProjectModal = () => {
  const [loadedProject, setLoadedProject] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const projectId = useParams().projectId

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/${projectId}`
        )
        setLoadedProject(responseData.project)
      } catch (err) {}
    }
    fetchProject()
  }, [sendRequest, projectId])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProject && (
        <ProjectDetails project={loadedProject} />
      )}
    </React.Fragment>
  )
}

export default ProjectModal
