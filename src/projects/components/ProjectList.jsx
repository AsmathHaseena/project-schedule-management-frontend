import React from "react"
import ProjectItem from "./ProjectItem"
import Card from "../../shared/components/UIElements/Card"
import "./ProjectList.css"

const ProjectList = (props) => {
  if (props.projects.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No project found.</h2>
        </Card>
      </div>
    )
  }
  return (
    <ul className="project-list">
      {props.projects.map((project) => (
        <ProjectItem
          key={project.id}
          id={project.id}
          status={project.status}
          name={project.projectName}
        />
      ))}
    </ul>
  )
}

export default ProjectList
