import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";

function FoodItem({ idx, food }) {
  const {increaseQty, decreaseQty, quantities} = useContext(StoreContext);
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div
        className="card"
        style={{ maxWidth: "320px", textDecoration: "none" }}
      >
        <Link to={`/food/${food.id}`}>
          <img
            src={food.imageUrl}
            className="card-img-top"
            alt={food.imageUrl}
            style={{
              width: "100%", // always fills card width
              height: "250px", // consistent height across all cards
              objectFit: "cover", // crops proportionally, no distortion
              borderTopLeftRadius: "0.25rem", // keeps Bootstrap card rounding
              borderTopRightRadius: "0.25rem",
            }}
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{food.name}</h5>
          <p className="card-text">{food.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">&#8377; {food.price}</span>
            <div>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
              <small className="text-muted">(4.5)</small>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between bg-light">
          <Link className="btn btn-sm item-btn" to={`/food/${food.id}`}>
            View Food
          </Link>
          {
            quantities[food.id] > 0 ? (
              <>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-danger btn-sm" onClick={() => decreaseQty(food.id)}>
                    <i className="bi bi-dash-circle"></i>
                  </button>
                  <span className="fw-bold">{quantities[food.id]}</span>
                  <button className="btn btn-success btn-sm" onClick={() => increaseQty(food.id)}><i className="bi bi-plus"></i></button>
                </div>
              </>
            ) :(
              <>
              <button className="btn btn-primary btn-sm" onClick={() => increaseQty(food.id)}>
                <i className="bi bi-plus-circle"></i></button></>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default FoodItem;
