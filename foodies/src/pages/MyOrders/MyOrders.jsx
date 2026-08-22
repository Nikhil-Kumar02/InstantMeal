import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from "../../context/StoreContext";
import { assets } from '../../assets/assets';
import apiClient from '../../services/apiClient';
import './MyOrders.css';

const STATUS_STEPS = ["Placed", "Preparing", "Dispatched", "Delivered"];

const getStepIndex = (status) => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s === 'preparing') return 1;
    if (s === 'dispatched') return 2;
    if (s === 'delivered') return 3;
    return 0; // Placed / Paid
};

function OrderTracker({ status }) {
    const currentStep = getStepIndex(status);
    return (
        <div className="order-tracker">
            {STATUS_STEPS.map((step, idx) => (
                <React.Fragment key={step}>
                    <div className={`tracker-step ${idx <= currentStep ? 'active' : ''}`}>
                        <div className="tracker-dot">
                            {idx < currentStep ? <i className="bi bi-check-lg"></i> : idx + 1}
                        </div>
                        <span className="tracker-label">{step}</span>
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                        <div className={`tracker-line ${idx < currentStep ? 'active' : ''}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

function MyOrders() {
    const { token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/orders');
            setData(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="my-orders-title">My Orders</h1>
                    <button className="btn btn-refresh" onClick={fetchOrders} title="Refresh orders">
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </button>
                </div>
                <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Track your order history and live status</p>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-brand" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-bag-x" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: 'var(--border-light)' }}></i>
                        <p className="fw-semibold">No orders yet.</p>
                        <p style={{ fontSize: '0.85rem' }}>Your order history will appear here once you place your first order.</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {data.map((order, idx) => (
                            <div key={idx} className="card orders-card p-4">
                                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={assets.delivery} alt="order" height={44} width={44} style={{ borderRadius: '10px' }} />
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                                {order.orderedItems.map((item, i) => (
                                                    i === order.orderedItems.length - 1
                                                        ? `${item.name} x${item.quantity}`
                                                        : `${item.name} x${item.quantity}, `
                                                ))}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                {order.orderedItems.length} item{order.orderedItems.length > 1 ? 's' : ''} &bull; {order.email}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="order-amount">&#8377; {Number(order.amount).toFixed(2)}</span>
                                </div>

                                {/* Live Tracker */}
                                <OrderTracker status={order.orderStatus} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default MyOrders;
