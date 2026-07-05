import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ListFood.css";
import { deleteFood, getFoodList, updateFood } from "../../services/foodService";

function ListFood() {
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null); // track item being edited
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error("Error while reading the foods....");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if (success) {
        toast.success("Food removed....");
        await fetchList();
      } else {
        toast.error("Error occurred while removing the food....");
      }
    } catch (error) {
      toast.error("Error occurred while removing the food....");
    }
  };

  const startEdit = (item) => {
    setEditItem(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    try {
      const success = await updateFood(editItem, formData);
      if (success) {
        toast.success("Food updated successfully!");
        setEditItem(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          imageUrl: "",
        });
        await fetchList();
      } else {
        toast.error("Error while updating food....");
      }
    } catch (error) {
      console.log(error)
      toast.error("Error while updating food");
    }
  };

  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <img src={item.imageUrl} alt="" height={48} width={48} />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>&#8377;{item.price}.00</td>
                <td>{item.description}</td>

                <td>
                  <i
                    className="bi bi-pencil-square text-primary me-3"
                    onClick={() => startEdit(item)}
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    className="bi bi-x-circle-fill text-danger"
                    onClick={() => removeFood(item.id)}
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editItem && (
          <div className="card mt-4 p-3">
            <h4>Edit Food</h4>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Update Food
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setEditItem(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListFood;
