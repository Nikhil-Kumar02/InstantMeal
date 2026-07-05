import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";

function Orders() {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.get("http://localhost:8080/api/orders/all");
    setData(response.data);
  };

  const updateStatus = async (event, orderId) => {
    const response = await axios.patch(
      `http://localhost:8080/api/orders/status/${orderId}?status=${event.target.value}`,
    );
    if (response.status === 200) {
      await fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="container">
        <div className="py-5 row justify-content-center">
          <div className="col card">
            <table className="table table-responsive">
              <tbody>
                {data.map((order, idx) => {
                  return (
                    <tr key={idx}>
                      <td>
                        <img
                          src={assets.parcel}
                          alt={assets.delivery}
                          height={48}
                          width={48}
                        />
                      </td>
                      <td>
                        <div>
                          {order.orderedItems.map((item, idx) => {
                          if (idx === order.orderedItems.length - 1) {
                            return item.name + " x " + item.quantity;
                          } else {
                            return item.name + " x " + item.quantity + ", ";
                          }
                        })}
                        </div>

                        <div>
                          {order.userAddress}
                        </div>
                      </td>
                      <td>&#8377; {order.amount.toFixed(2)}</td>
                      <td>Items: {order.orderedItems.length}</td>
                      <td>
                        <select
                          className="form-control"
                          onChange={(event) => updateStatus(event, order.id)}
                          value={order.orderStatus}
                        >
                          <option value="Food Preparing">Food Preparing</option>
                          <option value="Out for delivery">
                            Out for delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orders;
