import React, { useContext, useState } from 'react'
import './Login.css'
import {Link, useNavigate} from 'react-router-dom'
import { login } from '../service/authService'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'

function Login() {
    const {setToken, loadCartData} = useContext(StoreContext);
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const onChangeHandler = (event) => {
        const {name, value} = event.target;
        setData(data => ({...data, [name]: value}))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await login(data);
            if(response.status === 200) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                await loadCartData(response.data.token);
                navigate('/');
            } else {
                toast.error("Unable to login. Please try again....");
            }
        } catch (error) {
            console.log("Unable to login: ", error)
            toast.error("Unable to login. Please check your credentials...");
        }
    }


  return (
    <>
        <div className="login-container">
            <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card border-0 shadow rounded-3 my-5">
                <div className="card-body p-4 p-sm-5">
                    <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
                    <form onSubmit={onSubmitHandler}>
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" value={data.email} name='email' onChange={onChangeHandler} />
                        <label htmlFor="floatingEmail">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={data.password} name='password' onChange={onChangeHandler} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-outline-primary btn-login text-uppercase" type="submit">Sign
                        in</button>
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-outline-danger btn-login text-uppercase mt-2" type="reset">Reset
                        </button>
                    </div>

                    <div className="mt-4">
                        Don't have an account? <Link to={'/register'}>Sign up</Link>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
    </>
  )
}

export default Login
