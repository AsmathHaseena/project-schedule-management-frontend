import React, { useContext } from "react"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import Card from "../../shared/components/UIElements/Card"
import Button from "../../shared/components/FormElements/Button"
import moment from "moment"
import "./ProjectItem.css"

const ProjectDetails = (props) => {
  const { isLoading } = useHttpClient()
  const auth = useContext(AuthContext)

  return (
    <React.Fragment>
      <Card className="project-form">
        {isLoading && <LoadingSpinner asOverlay />}
        <div>
          <h2>Project Name: {props.project.projectName}</h2>
          <p>Description: {props.project.description}</p>
          <p>Statement of Work: {props.project.sow}</p>
          <p>Budget Allocated: {props.project.budgetAllocated}</p>
          <p>
            Project Start Date:
            {moment(props.project.projectStartDate).format("MM/DD/YYYY")}
          </p>
          <p>
            Project End Date:
            {moment(props.project.projectEndDate).format("MM/DD/YYYY")}
          </p>
          <p>Status: {props.project.status}</p>
        </div>
        <div className="project-item__actions">
          {auth.role === "Admin" ? (
            <Button to={`/project/${props.project.id}`}>EDIT PROJECT</Button>
          ) : (
            <Button to={`/task/${props.project.id}`}>ADD TASK</Button>
          )}
        </div>
      </Card>
    </React.Fragment>
  )
}

export default ProjectDetails
