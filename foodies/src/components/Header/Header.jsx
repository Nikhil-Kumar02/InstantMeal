import React from 'react'
import {Link} from 'react-router-dom'
import "./Header.css"

function Header() {
  return (
    <>
      <div className="header">
        <div className="container-fluid py-3">
          <h1 className="display-5">Order your favourite food here</h1>
          <p>Discover the best dishes and drinks from across India — delivered hot, fresh, and right to your doorstep.</p>
          <Link to="/explore-food" className="explore-button">
            <i className="bi bi-grid-fill"></i>
            Explore Menu
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header
