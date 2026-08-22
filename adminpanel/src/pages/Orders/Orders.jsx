import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import adminApiClient from "../../services/adminApiClient";
import { toast } from "react-toastify";
import "./Orders.css";

const STATUS_OPTIONS = ["Preparing", "Dispatched", "Delivered"];

function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApiClient.get("/orders/all");
      setData(response.data);
    } catch (error) {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await adminApiClient.patch(`/orders/status/${orderId}?status=${newStatus}`);
      if (response.status === 200) {
        setData((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        toast.success(`Status updated to "${newStatus}"`);
      }
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="mx-2 mt-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">All Orders</h2>
          <button className="btn btn-sm btn-outline-secondary" onClick={fetchOrders}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox" style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.75rem" }}></i>
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="card">
            <table className="table table-responsive mb-0">
              <thead className="table-light">
                <tr>
                  <th></th>
                  <th>Items</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Items #</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order, idx) => (
                  <tr key={order.id || idx}>
                    <td>
                      <img src={assets.parcel} alt="parcel" height={44} width={44} style={{ borderRadius: "8px" }} />
                    </td>
                    <td>
                      {order.orderedItems.map((item, i) =>
                        i === order.orderedItems.length - 1
                          ? `${item.name} x${item.quantity}`
                          : `${item.name} x${item.quantity}, `
                      )}
                    </td>
                    <td className="text-muted" style={{ fontSize: "0.85rem" }}>{order.userAddress}</td>
                    <td><strong>&#8377; {Number(order.amount).toFixed(2)}</strong></td>
                    <td>{order.orderedItems.length}</td>
                    <td>
                      <select
                        className={`form-select form-select-sm status-select status-${(order.orderStatus || "").toLowerCase()}`}
                        onChange={(event) => updateStatus(event, order.id)}
                        value={order.orderStatus || ""}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
