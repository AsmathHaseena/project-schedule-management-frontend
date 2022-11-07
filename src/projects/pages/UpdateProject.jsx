import React, { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { useForm } from "../../shared/hooks/form-hook"
import { useHttpClient } from "../../shared/hooks/http-hook"
import Input from "../../shared/components/FormElements/Input"
import Button from "../../shared/components/FormElements/Button"
import Card from "../../shared/components/UIElements/Card"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators"
import "./ProjectForm.css"

const UpdateProject = () => {
  const projectId = useParams().projectId
  const history = useHistory()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [loadedProject, setLoadedProject] = useState()
  const [loadedUsers, setLoadedUsers] = useState()
  const [fields, setFields] = useState({
    pmoUser: "",
    status: "Active",
  })
  const [formState, inputHandler, setFormData] = useForm(
    {
      projectName: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  const handleFormChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/projects/${projectId}`
        )
        setLoadedProject(responseData.project)
        setFormData(
          {
            projectName: {
              value: responseData.project.projectName,
              isValid: true,
            },
            description: {
              value: responseData.project.description,
              isValid: true,
            },
          },
          true
        )
      } catch (err) {}
    }
    fetchProject()
  }, [sendRequest, projectId, setFormData])

  useEffect(() => {
    const fetchPMOUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/pmo"
        )

        setLoadedUsers(responseData.users)
      } catch (err) {}
    }
    fetchPMOUsers()
  }, [sendRequest])

  const projectUpdateSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      await sendRequest(
        `http://localhost:5000/api/projects/${projectId}`,
        "PATCH",
        JSON.stringify({
          projectName: formState.inputs.projectName.value,
          description: formState.inputs.description.value,
          status: fields.status,
          pmoUser: fields.pmoUser,
        }),
        {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        }
      )
      history.push("/")
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedProject && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find project!</h2>
        </Card>
      </div>
    )
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedProject && (
        <form className="project-form" onSubmit={projectUpdateSubmitHandler}>
          <Input
            id="projectName"
            element="input"
            type="text"
            label="Project Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedProject.projectName}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedProject.description}
            initialValid={true}
          />
          {loadedUsers && (
            <div className="form-control false">
              <label htmlFor="pmoUser">PMO User</label>
              <select
                name="pmoUser"
                id="pmoUser"
                onChange={(event) => handleFormChange(event)}
              >
                <option value=""></option>
                {loadedUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          )}
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
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PROJECT
          </Button>
        </form>
      )}
    </React.Fragment>
  )
}

export default UpdateProject
