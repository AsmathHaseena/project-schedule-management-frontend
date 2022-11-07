import React from "react"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { Link } from "react-router-dom"
import Card from "../../shared/components/UIElements/Card"
import "./Reports.css"

const ReportsList = () => {
  const { isLoading, error, clearError } = useHttpClient()

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <React.Fragment>
          <ul className="project-list">
            <li className="reports">
              <Card className="reports__content">
                <Link to={`/ganttReport`}>
                  <div className="reports__info">
                    <h2>Gantt Report</h2>
                  </div>
                </Link>
              </Card>
            </li>
            <li className="reports">
              <Card className="reports__content">
                <Link to={`/budgetAllocated`}>
                  <div className="reports__info">
                    <h2>Budget Allocated Report</h2>
                  </div>
                </Link>
              </Card>
            </li>
            <li className="reports">
              <Card className="reports__content">
                <Link to={`/resourceAllocated`}>
                  <div className="reports__info">
                    <h2>Resource Allocated Report</h2>
                  </div>
                </Link>
              </Card>
            </li>
            <li className="reports">
              <Card className="reports__content">
                <Link to={`/projectStatus`}>
                  <div className="reports__info">
                    <h2>Project Status Report</h2>
                  </div>
                </Link>
              </Card>
            </li>
          </ul>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ReportsList
