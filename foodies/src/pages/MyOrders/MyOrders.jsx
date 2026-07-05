import React, { useContext, useEffect, useState } from 'react'
import {StoreContext} from "../../context/StoreContext"
import axios from 'axios';
import { assets } from '../../assets/assets';
import './MyOrders.css'

function MyOrders() {
    const { token } = useContext(StoreContext);
    const [data, setData] = useState([])

    const fetchOrders = async () => {
        const response = await axios.get('http://localhost:8080/api/orders', {headers: {"Authorization": `Bearer ${token}`}})
        setData(response.data)
    }

    useEffect(() => {
        if(token) {
            fetchOrders();
        }
    }, [token])

    const getStatusClass = (status) => {
        if (!status) return '';
        const s = status.toLowerCase();
        if (s === 'preparing') return 'status-preparing';
        if (s === 'paid') return 'status-paid';
        if (s === 'delivered') return 'status-delivered';
        return '';
    }

  return (
    <>
        <div className="container py-5">
            <h1 className="my-orders-title mb-1">My Orders</h1>
            <p className="text-muted mb-4" style={{fontSize: '0.9rem'}}>Track your order history and status</p>

            <div className="card orders-card">
                <table className="table table-responsive mb-0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Count</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-5 text-muted">
                                    <i className="bi bi-bag-x" style={{fontSize: '2rem', display: 'block', marginBottom: '0.5rem'}}></i>
                                    No orders yet.
                                </td>
                            </tr>
                        ) : (
                            data.map((order, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <img src={assets.delivery} alt="order" height={40} width={40} style={{borderRadius: '8px'}} />
                                    </td>
                                    <td>
                                        {order.orderedItems.map((item, i) => (
                                            i === order.orderedItems.length - 1
                                                ? item.name + " x " + item.quantity
                                                : item.name + " x " + item.quantity + ", "
                                        ))}
                                    </td>
                                    <td>
                                        <span className="order-amount">&#8377; {order.amount.toFixed(2)}</span>
                                    </td>
                                    <td>
                                        <span className="badge" style={{background: 'var(--brand-primary-subtle)', color: 'var(--brand-primary)', fontWeight: 600, borderRadius: '999px', padding: '0.3rem 0.7rem', fontSize: '0.78rem'}}>
                                            {order.orderedItems.length} items
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`order-status-dot ${getStatusClass(order.orderStatus)}`}>
                                            &#x25cf; {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-refresh btn-sm" onClick={fetchOrders} title="Refresh status">
                                            <i className="bi bi-arrow-clockwise"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </>
  )
}

export default MyOrders
