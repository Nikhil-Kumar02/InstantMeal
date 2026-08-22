import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../util/constants";
import { citiesByState } from "../../util/data";
import apiClient from "../../services/apiClient";

function PlaceOrder() {
  const { foodList, quantities, setQuantities } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}`,
      phoneNumber: `${data.phoneNumber}`,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.id,
        quantity: quantities[item.id],
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const response = await apiClient.post("/orders/create", orderData);
      if (response.status === 201 && response.data.razorpayOrderId) {
        initiateRazorpayPayment(response.data);
      } else {
        toast.error("Unable to place order. Please try again.");
      }
    } catch (error) {
      toast.error("Unable to place order. Please try again.");
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "InstantMeal",
      description: "Food order payment",
      order_id: order.razorpayOrderId,
      handler: async function (razorpayResponse) {
        await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: { color: "#FF5F38" },
      modal: {
        ondismiss: async function () {
          toast.error("Payment cancelled.");
          await deleteOrder(order.id);
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };
    try {
      const response = await apiClient.post("/orders/verify", paymentData);
      if (response.status === 200) {
        toast.success("Payment successful!");
        await clearCart();
        navigate("/myorders");
      } else {
        toast.error("Payment verification failed. Please contact support.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await apiClient.delete("/orders/" + orderId);
    } catch (error) {
      console.error("Error deleting pending order:", error);
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete("/cart");
      setQuantities({});
    } catch (error) {
      toast.error("Error while clearing the cart.");
    }
  };

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const { subTotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);

  return (
    <>
      <div className="container mt-4">
        <main>
          <div className="py-1 text-center">
            <img className="d-block mx-auto" src={assets.logo} alt="InstantMeal" width="98" height="98" />
          </div>
          <div className="row g-5">
            <div className="col-md-5 col-lg-4 order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Your cart</span>
                <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
              </h4>
              <ul className="list-group mb-3">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 className="my-0">{item.name}</h6>
                      <small className="text-body-secondary">Qty: {quantities[item.id]}</small>
                    </div>
                    <span className="text-body-secondary">&#8377; {item.price * quantities[item.id]}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-body-secondary">Shipping</span>
                  <span className="text-body-secondary">&#8377; {subTotal === 0 ? "0.00" : shipping.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-body-secondary">Tax (10%)</span>
                  <span className="text-body-secondary">&#8377; {subTotal === 0 ? "0.00" : tax.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (INR)</span>
                  <strong>&#8377; {total.toFixed(2)}</strong>
                </li>
              </ul>
            </div>

            <div className="col-md-7 col-lg-8">
              <h4 className="mb-3">Billing address</h4>
              <form className="needs-validation" onSubmit={onSubmitHandler}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input type="text" className="form-control" id="firstName" placeholder="John" name="firstName" onChange={onChangeHandler} value={data.firstName} required />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input type="text" className="form-control" id="lastName" placeholder="Doe" name="lastName" onChange={onChangeHandler} value={data.lastName} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text">@</span>
                      <input type="email" className="form-control" id="email" placeholder="Email" name="email" onChange={onChangeHandler} value={data.email} required />
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="phone" placeholder="9876543210" name="phoneNumber" onChange={onChangeHandler} value={data.phoneNumber} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" placeholder="1234 Main St" name="address" onChange={onChangeHandler} value={data.address} required />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State</label>
                    <select className="form-select" id="state" name="state" value={data.state} onChange={onChangeHandler} required>
                      <option value="">Choose...</option>
                      {Object.keys(citiesByState).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-5">
                    <label htmlFor="city" className="form-label">City</label>
                    <select className="form-select" id="city" name="city" value={data.city} onChange={onChangeHandler} required>
                      <option value="">Choose...</option>
                      {citiesByState[data.state]?.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">Zip</label>
                    <input type="number" className="form-control" id="zip" placeholder="411011" name="zip" onChange={onChangeHandler} value={data.zip} required />
                  </div>
                </div>
                <hr className="my-4" />
                <button className="w-100 btn btn-primary btn-lg mt-2 mb-5" type="submit" disabled={cartItems.length === 0}>
                  Continue to checkout
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default PlaceOrder;
