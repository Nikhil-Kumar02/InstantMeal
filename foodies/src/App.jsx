import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Menubar from "./components/Menubar/Menubar";
import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import Contact from "./pages/Contact/Contact";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MyOrders from "./pages/MyOrders/MyOrders";
import { StoreContext } from "./context/StoreContext";

function App() {
  const {token} = useContext(StoreContext);

  return (
    <div>
      <Menubar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore-food" element={<Explore />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={token ? <PlaceOrder /> : <Login />} />
        <Route path="/myorders" element={token ? <MyOrders /> : <Login />} />

        <Route path="/login" element={token ? <Home /> : <Login />} />
        <Route path="/register" element={token ? <Home /> : <Register />} />
      </Routes>
    </div>
  );
}

export default App;
