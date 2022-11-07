import React from "react"
import { useHistory } from "react-router-dom"
import Card from "../../shared/components/UIElements/Card"
import Input from "../../shared/components/FormElements/Input"
import Button from "../../shared/components/FormElements/Button"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { VALIDATOR_EMAIL } from "../../shared/util/validators"
import { useForm } from "../../shared/hooks/form-hook"
import { useHttpClient } from "../../shared/hooks/http-hook"
import "./Auth.css"

const ForgotPassword = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  const history = useHistory()

  const authSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/users/${formState.inputs.email.value}`
      )
      history.push("/securityQuestion", { state: responseData.user })
    } catch (err) {}
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Forgot Password</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Answer Security Question
          </Button>
        </form>
      </Card>
    </React.Fragment>
  )
}

export default ForgotPassword
