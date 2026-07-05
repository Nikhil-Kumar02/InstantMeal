import axios from "axios";

const API_URL = "http://localhost:8080/api/foods";

// export const addFood = async (foodData, image) => {
//   const formData = new FormData();
//   formData.append("food", JSON.stringify(foodData));
//   formData.append("file", image);

//   try {
//     await axios.post(API_URL, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   } catch (error) {
//     throw error;
//   }
// };

export const addFood = async (foodData) => {
  try {
    const response = await axios.post(API_URL, foodData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFoodList = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log("Error in fetching food list: ", error);
    throw error;
  }
};

export const deleteFood = async (foodId) => {
  try {
    const response = await axios.delete(API_URL + "/" + foodId);
    return response.status === 204;
  } catch (error) {
    console.log("Error while deleting the food: ", error);
    throw error;
  }
};

export const updateFood = async (foodId, foodData) => {
  try {
    const response = await axios.put(API_URL + "/" + foodId, foodData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data, response.status);
    return response.status === 200;
  } catch (error) {
    console.log("Error while updating the food: " + error);
    throw error;
  }
};
