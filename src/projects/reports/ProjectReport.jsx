import React, { useState } from "react"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { useHttpClient } from "../../shared/hooks/http-hook"
import Card from "../../shared/components/UIElements/Card"
import Button from "../../shared/components/FormElements/Button"

import "./Reports.css"

const ProjectReport = () => {
  const { isLoading, error, clearError } = useHttpClient()
  const [status, setStatus] = useState("Active")

  const handleFormChange = (event) => {
    setStatus(event.target.value)
  }

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
          <h2>Project Status Report</h2>
          <div className="form-control false">
            <label htmlFor="status">Project Status</label>
            <select
              name="status"
              id="status"
              onChange={(event) => handleFormChange(event)}
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <Button to={`/projectStatus/${status}`}>Submit</Button>
        </Card>
      )}
    </React.Fragment>
  )
}

export default ProjectReport
