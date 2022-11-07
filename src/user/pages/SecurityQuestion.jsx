import React, { useContext } from "react"
import { useLocation } from "react-router-dom"
import { useForm } from "../../shared/hooks/form-hook"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import Card from "../../shared/components/UIElements/Card"
import Input from "../../shared/components/FormElements/Input"
import Button from "../../shared/components/FormElements/Button"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { VALIDATOR_REQUIRE } from "../../shared/util/validators"
import "./Auth.css"

const SecurityQuestion = () => {
  const auth = useContext(AuthContext)

  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [formState, inputHandler] = useForm(
    {
      securityQnAns: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  const securityQuestions = {
    qn1: "What is your mother's maiden name?",
    qn2: "What is your employee ID number?",
    qn3: "What was your favorite subject in high school?",
  }

  const location = useLocation()
  const locationState = location.state
  const recoveryQn = locationState.state.recoveryQn
  const emailId = locationState.state.email

  const authSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/login",
        "POST",
        JSON.stringify({
          email: emailId,
          recoveryAns: formState.inputs.securityQnAns.value,
        }),
        {
          "Content-Type": "application/json",
        }
      )
      auth.login(responseData.user.id, responseData.user.role)
    } catch (err) {}
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Security Question</h2>
        <hr />
        {recoveryQn in securityQuestions && (
          <p>{securityQuestions[recoveryQn]}</p>
        )}
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="securityQnAns"
            type="text"
            label="Security Answer"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter the answer."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Login
          </Button>
        </form>
      </Card>
    </React.Fragment>
  )
}

export default SecurityQuestion
