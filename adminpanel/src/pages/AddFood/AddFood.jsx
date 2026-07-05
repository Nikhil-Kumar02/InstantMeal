import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import "./AddFood.css";
import { addFood } from "../../services/foodService";
import { toast } from "react-toastify";

function AddFood() {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    imageUrl: "",
    name: "",
    description: "",
    price: "",
    category: "Biryani",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // if(!image) {
    //     toast.error("Please select an image..");
    //     return;
    // }

    try {
        // await addFood(data, image);

      const response = await addFood(data);
      toast.success('Food added successfully....');

      setData({
          imageUrl: "",
          name: "",
          description: "",
          price: "",
          category: "Biryani",
        });
        // setImage(null);

    } catch (error) {
      toast.error("Error while adding food....");
    }
  };

  return (
    <>
      <div className="mx-2 mt-2">
        <div className="row">
          <div className="card col-md-6">
            <div className="card-body">
              <h2 className="mb-4">Add Food</h2>

              <form onSubmit={onSubmitHandler}>
                {/* <div className="mb-3">
                  <label htmlFor="image" className="form-label" style={{cursor: "pointer"}}>
                    <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" width={98} />
                  </label>
                  <input type="file" className="form-control" id="image" name="image" required hidden onChange={(e) => setImage(e.target.files[0])} />
                </div> */}

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image
                  </label>
                  <input
                    type="text"
                    placeholder="Please enter image address"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    required
                    onChange={onChangeHandler}
                    value={data.imageUrl}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter food name"
                    className="form-control"
                    id="name"
                    name="name"
                    required
                    onChange={onChangeHandler}
                    value={data.name}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Write the food description"
                    className="form-control"
                    name="description"
                    rows="5"
                    required
                    onChange={onChangeHandler}
                    value={data.description}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="&#8377;200"
                    className="form-control"
                    id="price"
                    name="price"
                    required
                    onChange={onChangeHandler}
                    value={data.price}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="form-control"
                    onChange={onChangeHandler}
                    value={data.category}
                  >
                    <option value="Biryani">Biryani</option>
                    <option value="Cake">Cake</option>
                    <option value="Burger">Burger</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Salad">Salad</option>
                    <option value="Ice-cream">Ice-cream</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddFood;
