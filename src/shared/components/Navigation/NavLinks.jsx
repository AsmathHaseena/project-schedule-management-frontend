import React, { useContext } from "react"
import { NavLink } from "react-router-dom"

import { AuthContext } from "../../context/auth-context"
import "./NavLinks.css"

const NavLinks = (props) => {
  const auth = useContext(AuthContext)

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/" exact>
            PROJECTS
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/reports">REPORTS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && auth.role === "Admin" && (
        <li>
          <NavLink to="/projects/new">ADD PROJECT</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">SIGN IN/SIGN UP</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  )
}

export default NavLinks
