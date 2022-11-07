import React, { useEffect, useState } from "react"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { useHttpClient } from "../../shared/hooks/http-hook"
import Card from "../../shared/components/UIElements/Card"
import "./Reports.css"

const ResourceAllocatedReport = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [projects, setProjects] = useState()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/projects"
        )
        setProjects(responseData.projects)
      } catch (err) {}
    }
    fetchProjects()
  }, [sendRequest])
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <Card className="report-container">
          <h2>Resource Allocated Report</h2>
          <div className="report-table">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Project Name</th>
                  <th>Resource Allocated</th>
                </tr>
              </thead>
              <tbody>
                {projects &&
                  projects.map((project, index, key) => {
                    return (
                      <tr key={key}>
                        <td>{index + 1}</td>
                        <td>{project.projectName}</td>
                        <td>{project.budgetAllocated}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </React.Fragment>
  )
}

export default ResourceAllocatedReport
