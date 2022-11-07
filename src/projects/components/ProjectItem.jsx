import React from "react"
import { Link } from "react-router-dom"
import Card from "../../shared/components/UIElements/Card"
import "./ProjectItem.css"

const ProjectItem = (props) => {
  return (
    <li className="project-item">
      <Card className="project-item__content">
        <Link to={`/${props.id}/project`}>
          <div className="project-item__info">
            <h2>{props.name}</h2>
            <h3>{props.status}</h3>
          </div>
        </Link>
      </Card>
    </li>
  )
}

export default ProjectItem
