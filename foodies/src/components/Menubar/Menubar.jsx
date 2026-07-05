import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import "./Menubar.css"
import {Link} from "react-router-dom"
import { assets } from '../../assets/assets.js'
import { StoreContext } from '../../context/StoreContext.jsx'

function Menubar() {
    const [active, setActive] = useState('home');

    const navigate = useNavigate();

    const {quantities, token, setToken, setQuantities} = useContext(StoreContext);
    const uniqueItemsInCart = Object.values(quantities).filter(qty => qty > 0).length;

    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        setQuantities({})
        navigate('/login');
    }

  return (
    <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to={'/'}><img src={assets.logo} className='mx-4' height={48} width={48} /></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <Link className={active === 'home' ? "nav-link fw-semibold active" : "nav-link"} to="/" onClick={() => setActive('home')}>Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link className={active === 'explore-food' ? "nav-link fw-semibold active" : "nav-link"} to="/explore-food" onClick={() => setActive('explore-food')}>Explore</Link>
                    </li>
                    <li className="nav-item">
                    <Link className={active === 'contact-us' ? "nav-link fw-semibold active" : "nav-link"} to="/contact-us" onClick={() => setActive('contact-us')}>Contact us</Link>
                    </li>
                </ul>
                <div className="d-flex align-items-center gap-4">
                    <Link to={'/cart'}>
                        <div className="position-relative">
                            <img src={assets.cart1} alt="" height={32} width={32} className='position-relative'/>
                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning'>{uniqueItemsInCart}</span>
                        </div>
                    </Link>
                        
                    {
                        !token ? (
                            <>
                                <button className='btn btn-outline-primary btn-sm' onClick={() => navigate('/login')}>Login</button>
                                <button className='btn btn-outline-success btn-sm' onClick={() => navigate('/register')}>Register</button>
                            </>
                        ) : (
                            <>
                                <div className='dropdown text-end'>
                                    <a href="" className='d-block link-body-emphasis text-decoration-none dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={assets.user} alt="" height={30} width={35} className='rounded-circle' />
                                    </a>
                                    <ul className='dropdown-menu text-small'>
                                        <li className='dropdown-item'>{}</li>
                                        <li className='dropdown-item' onClick={() => navigate('/myorders')}>Orders</li>
                                        <li className='dropdown-item' onClick={logout}>Logout</li>
                                    </ul>
                                </div>
                            </>
                        )
                    }
                </div>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Menubar
