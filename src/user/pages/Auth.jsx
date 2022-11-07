import React, { useState, useContext } from "react"

import Card from "../../shared/components/UIElements/Card"
import Input from "../../shared/components/FormElements/Input"
import Button from "../../shared/components/FormElements/Button"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators"
import { useForm } from "../../shared/hooks/form-hook"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import "./Auth.css"

const Auth = () => {
  const auth = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [fields, setFields] = useState({
    recoveryQuestion: "qn1",
    userRole: "Admin",
  })

  const handleFormChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value })
  }

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      )
    }
    setIsLoginMode((prevMode) => !prevMode)
  }

  const authSubmitHandler = async (event) => {
    event.preventDefault()

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        )
        auth.login(responseData.user.id, responseData.user.role)
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            recoveryQn: fields.recoveryQuestion,
            recoveryAns: formState.inputs.forgotPasswordAns.value,
            role: fields.userRole,
          }),
          {
            "Content-Type": "application/json",
          }
        )

        auth.login(responseData.user.id, responseData.user.role)
      } catch (err) {}
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        {isLoginMode ? <h2>Login</h2> : <h2>Sign up</h2>}
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />

          {!isLoginMode && (
            <div className="form-control false">
              <label htmlFor="forgotPasswordQn">Security Question</label>
              <select
                name="forgotPasswordQn"
                id="forgotPasswordQn"
                onChange={(event) => handleFormChange(event)}
              >
                <option value="qn1">What is your mother's maiden name?</option>
                <option value="qn2">What is your employee ID number?</option>
                <option value="qn3">
                  What was your favorite subject in high school?
                </option>
              </select>
            </div>
          )}
          {!isLoginMode && (
            <Input
              element="input"
              id="forgotPasswordAns"
              type="text"
              label="Security Answer"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter the answer."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <div className="form-control false">
              <label htmlFor="userRole">Role</label>
              <select
                name="userRole"
                id="userRole"
                onChange={(event) => handleFormChange(event)}
              >
                <option value="Admin">Admin</option>
                <option value="PMO">PMO</option>
              </select>
            </div>
          )}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
        {isLoginMode && (
          <Button inverse to={`/forgotPassword`}>
            FORGOT PASSWORD
          </Button>
        )}
      </Card>
    </React.Fragment>
  )
}

export default Auth
