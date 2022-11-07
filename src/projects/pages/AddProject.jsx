import React, { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useForm } from "../../shared/hooks/form-hook"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import Input from "../../shared/components/FormElements/Input"
import Button from "../../shared/components/FormElements/Button"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./ProjectForm.css"
import moment from "moment"

const AddProject = () => {
  const auth = useContext(AuthContext)
  const history = useHistory()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [loadedUsers, setLoadedUsers] = useState()
  const [fields, setFields] = useState({
    pmoUser: "",
    status: "Active",
  })

  const handleFormChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value })
  }

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

  const [formState, inputHandler] = useForm(
    {
      projectName: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      sow: {
        value: "",
        isValid: false,
      },
      projectStartDate: {
        value: "",
        isValid: false,
      },
      projectEndDate: {
        value: "",
        isValid: false,
      },
      budgetAllocated: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  const placeSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      await sendRequest(
        "http://localhost:5000/api/projects",
        "POST",
        JSON.stringify({
          projectName: formState.inputs.projectName.value,
          description: formState.inputs.description.value,
          sow: formState.inputs.sow.value,
          projectStartDate: moment(startDate).format("MM/DD/YYYY"),
          projectEndDate: moment(endDate).format("MM/DD/YYYY"),
          budgetAllocated: parseInt(formState.inputs.budgetAllocated.value),
          status: fields.status,
          pmoUser: fields.pmoUser,
          creator: auth.userId,
        }),
        { "Content-Type": "application/json" }
      )
      history.push("/")
    } catch (err) {}
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="project-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="projectName"
          element="input"
          type="text"
          label="Project Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid project name."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(15)]}
          errorText="Please enter a valid description (at least 15 characters)."
          onInput={inputHandler}
        />
        <Input
          id="sow"
          element="textarea"
          label="Statement of Work"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid statement of work (at least 15 characters)."
          onInput={inputHandler}
        />
        <div className="form-control false">
          <label htmlFor="projectStartDate">Project Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="form-control false">
          <label htmlFor="projectEndDate">Project End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <Input
          id="budgetAllocated"
          element="input"
          label="Budget Allocated"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter budget allocated."
          onInput={inputHandler}
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
        <Button type="submit">ADD PROJECT</Button>
      </form>
    </React.Fragment>
  )
}

export default AddProject
