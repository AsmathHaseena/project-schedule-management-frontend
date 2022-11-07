import React, { useEffect, useState } from "react"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { GanttComponent } from "@syncfusion/ej2-react-gantt"
import Card from "../../shared/components/UIElements/Card"
import moment from "moment"
import "./Reports.css"

const GanttReport = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [tasks, setTasks] = useState()

  const taskFields = {
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    child: "subtasks",
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/tasks"
        )
        const renamedTasks = responseData.tasks.map((task) => {
          let i = 0
          let tempTask = {}
          tempTask.TaskID = i++
          tempTask.TaskName = task.taskName
          tempTask.StartDate = moment(task.taskStartDate).format("MM/DD/YYYY")
          tempTask.EndDate = moment(task.taskEndDate).format("MM/DD/YYYY")
          let subTask = []
          subTask = task.subTask.map((subTask) => {
            let tempSubTask = {}
            tempSubTask.TaskID = i++
            tempSubTask.TaskName = subTask.subtaskName
            tempSubTask.StartDate = moment(subTask.subtaskStartDate).format(
              "MM/DD/YYYY"
            )
            tempSubTask.EndDate = moment(subTask.subtaskEndDate).format(
              "MM/DD/YYYY"
            )
            return tempSubTask
          })
          tempTask.subtasks = subTask
          return tempTask
        })
        setTasks(renamedTasks)
      } catch (err) {}
    }
    fetchTasks()
  }, [sendRequest])

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <Card className="gantt-report-container">
        <h2>Gantt Report</h2>
        <GanttComponent
          dataSource={tasks}
          taskFields={taskFields}
          height="450px"
        ></GanttComponent>
      </Card>
    </React.Fragment>
  )
}

export default GanttReport
