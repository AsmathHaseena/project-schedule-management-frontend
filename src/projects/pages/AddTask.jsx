import React, { useState, useContext } from "react"
import { useHistory } from "react-router-dom"
import { useForm } from "../../shared/hooks/form-hook"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import DatePicker from "react-datepicker"
import moment from "moment"
import Input from "../../shared/components/FormElements/Input"
import Button from "../../shared/components/FormElements/Button"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators"
import "./ProjectForm.css"

const AddTask = (props) => {
  const auth = useContext(AuthContext)
  const history = useHistory()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [status, setStatus] = useState("Active")
  const [subtaskFields, setSubtaskFields] = useState([])

  const [formState, inputHandler] = useForm(
    {
      taskName: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      taskStartDate: {
        value: "",
        isValid: false,
      },
      taskEndDate: {
        value: "",
        isValid: false,
      },
      resource: {
        value: "",
        isValid: false,
      },
      cost: {
        value: "",
        isValid: false,
      },
      status: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  const placeSubmitHandler = async (event) => {
    event.preventDefault()

    const updatedSubtaskFields = subtaskFields.map((field) => {
      if (field["subtaskStartDate"] || field["subtaskEndDate"]) {
        const startDate = field["subtaskStartDate"]
        const endDate = field["subtaskEndDate"]
        return {
          ...field,
          subtaskStartDate: moment(startDate).format("MM/DD/YYYY"),
          subtaskEndDate: moment(endDate).format("MM/DD/YYYY"),
        }
      }
      return field
    })

    try {
      await sendRequest(
        "http://localhost:5000/api/tasks",
        "POST",
        JSON.stringify({
          taskName: formState.inputs.taskName.value,
          taskDescription: formState.inputs.taskDescription.value,
          taskStartDate: moment(startDate).format("MM/DD/YYYY"),
          taskEndDate: moment(endDate).format("MM/DD/YYYY"),
          resourceAllocated: parseInt(formState.inputs.resource.value),
          costAllocated: parseInt(formState.inputs.cost.value),
          taskStatus: status,
          creator: auth.userId,
          projectId: props.projectId,
          subTask: updatedSubtaskFields,
        }),
        { "Content-Type": "application/json" }
      )
      history.push("/")
    } catch (err) {}
  }

  const handleFormChange = (index, event, module) => {
    if (module === "task") {
      setStatus(event.target.value)
    } else {
      let data = [...subtaskFields]
      data[index][event.target.name] = event.target.value
      setSubtaskFields(data)
    }
  }

  const handleDateChange = (index, name, value) => {
    let data = [...subtaskFields]
    data[index][name] = value
    setSubtaskFields(data)
  }

  const addSubTask = () => {
    let subtaskNewFields = {
      subtaskName: "",
      subtaskDescription: "",
      subtaskStartDate: new Date(),
      subtaskEndDate: new Date(),
      subtaskStatus: "",
    }

    setSubtaskFields([...subtaskFields, subtaskNewFields])
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="project-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="taskName"
          element="input"
          type="text"
          label="Task Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid task name."
          onInput={inputHandler}
        />
        <Input
          id="taskDescription"
          element="textarea"
          label="Task Description"
          validators={[VALIDATOR_MINLENGTH(15)]}
          errorText="Please enter a valid description (at least 15 characters)."
          onInput={inputHandler}
        />
        <div className="form-control false">
          <label htmlFor="taskStartDate">Task Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="form-control false">
          <label htmlFor="taskEndDate">Task End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <Input
          id="resource"
          element="input"
          label="Resource Allocated"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter resource allocated."
          onInput={inputHandler}
        />
        <Input
          id="cost"
          element="input"
          label="Budget Allocated"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter budget allocated."
          onInput={inputHandler}
        />

        <div className="form-control false">
          <label htmlFor="status">Task Status</label>
          <select
            name="status"
            id="status"
            onChange={(event) => handleFormChange(null, event, "task")}
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {subtaskFields &&
          subtaskFields.map((input, index) => {
            return (
              <div key={index}>
                <div className="form-control false">
                  <label htmlFor="subtaskName">
                    {`${index + 1}: Subtask Name`}
                  </label>
                  <input
                    name="subtaskName"
                    value={input.subtaskName}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </div>
                <div className="form-control false">
                  <label htmlFor="subtaskDescription">
                    {`${index + 1}: Subtask Description`}
                  </label>
                  <input
                    name="subtaskDescription"
                    value={input.subtaskDescription}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </div>
                <div className="form-control false">
                  <label htmlFor="subtaskStartDate">{`${
                    index + 1
                  }: Subtask Start Date`}</label>
                  <DatePicker
                    selected={input.subtaskStartDate}
                    onChange={(date) =>
                      handleDateChange(index, "subtaskStartDate", date)
                    }
                  />
                </div>
                <div className="form-control false">
                  <label htmlFor="subtaskEndDate">{`${
                    index + 1
                  }: Subtask End Date`}</label>
                  <DatePicker
                    name="subtaskEndDate"
                    selected={input.subtaskEndDate}
                    onChange={(date) =>
                      handleDateChange(index, "subtaskEndDate", date)
                    }
                  />
                </div>
                <div className="form-control false">
                  <label htmlFor="subtaskStatus">
                    {`${index + 1}: Subtask Status`}{" "}
                  </label>
                  <select
                    name="subtaskStatus"
                    id="subtaskStatus"
                    onChange={(event) => handleFormChange(index, event)}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            )
          })}
        <div>
          <input
            type="button"
            className="button button--default"
            onClick={addSubTask}
            value="ADD SUBTASK"
          />
        </div>

        <Button type="submit">ADD TASK</Button>
      </form>
    </React.Fragment>
  )
}

export default AddTask
