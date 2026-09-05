import React, { useState } from "react";
import adminApiClient from "../../services/adminApiClient";
import { toast } from "react-toastify";
import "./AddFood.css";

const CATEGORIES = ["Biryani", "Cake", "Burger", "Pizza", "Rolls", "Salad", "Ice-cream"];

function AddFood() {
  const [tab, setTab] = useState("url"); // "url" or "upload"
  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const clearForm = () => {
    setData({ imageUrl: "", name: "", description: "", price: "", category: "Biryani" });
    setImage(null);
    setTab("url");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (tab === "url") {
      // JSON mode — image URL
      if (!data.imageUrl.trim()) {
        toast.error("Please enter an image URL.");
        return;
      }
      try {
        await adminApiClient.post("/foods", data);
        toast.success("Food added successfully!");
        clearForm();
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error("Access denied. Admin role required.");
        } else {
          toast.error("Error adding food: " + (error.response?.data?.message || error.message));
        }
      }
    } else {
      // Multipart mode — file upload
      if (!image) {
        toast.error("Please select an image to upload.");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("food", JSON.stringify({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          category: data.category,
          imageUrl: null,
        }));
        formData.append("file", image);

        await adminApiClient.post("/foods", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Food added successfully with uploaded image!");
        clearForm();
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes("S3")) {
          toast.warning("S3 is not configured. Please switch to URL mode or configure AWS credentials.");
        } else if (error.response?.status === 403) {
          toast.error("Access denied. Admin role required.");
        } else {
          toast.error("Error adding food: " + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  return (
    <>
      <div className="mx-2 mt-2">
        <div className="row">
          <div className="card col-md-7">
            <div className="card-body">
              <h2 className="mb-4">Add Food Item</h2>

              <form onSubmit={onSubmitHandler}>
                {/* Image Input Tabs */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Food Image</label>
                  <div className="add-food-tabs">
                    <button
                      type="button"
                      className={`add-food-tab ${tab === "url" ? "active" : ""}`}
                      onClick={() => setTab("url")}
                    >
                      <i className="bi bi-link-45deg me-1"></i> Image URL
                    </button>
                    <button
                      type="button"
                      className={`add-food-tab ${tab === "upload" ? "active" : ""}`}
                      onClick={() => setTab("upload")}
                    >
                      <i className="bi bi-cloud-upload me-1"></i> Upload File
                    </button>
                  </div>

                  {tab === "url" ? (
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="form-control mt-2"
                      id="imageUrl"
                      name="imageUrl"
                      onChange={onChangeHandler}
                      value={data.imageUrl}
                    />
                  ) : (
                    <div
                      className={`drop-zone mt-2 ${dragOver ? "drag-over" : ""} ${image ? "has-file" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      {image ? (
                        <div className="drop-zone-preview">
                          <img src={URL.createObjectURL(image)} alt="Preview" className="drop-preview-img" />
                          <div>
                            <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>{image.name}</div>
                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>{(image.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-auto"
                            onClick={(e) => { e.stopPropagation(); setImage(null); }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="drop-zone-placeholder">
                          <i className="bi bi-cloud-arrow-up-fill drop-icon"></i>
                          <div className="fw-semibold">Drag & drop an image here</div>
                          <div className="text-muted" style={{ fontSize: "0.8rem" }}>or click to browse files</div>
                        </div>
                      )}
                    </div>
                  )}
                  <input type="file" id="fileInput" accept="image/*" hidden onChange={handleFileSelect} />
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Food Name</label>
                  <input type="text" placeholder="Enter food name" className="form-control" id="name" name="name" required onChange={onChangeHandler} value={data.name} />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea id="description" placeholder="Write the food description" className="form-control" name="description" rows="4" required onChange={onChangeHandler} value={data.description}></textarea>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price (₹)</label>
                  <input type="number" placeholder="200" className="form-control" id="price" name="price" required min="1" onChange={onChangeHandler} value={data.price} />
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select name="category" id="category" className="form-control" onChange={onChangeHandler} value={data.category}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="bi bi-plus-circle me-1"></i> Save Food
                  </button>
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={clearForm}>
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddFood;
