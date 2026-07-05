import axios from "axios";

const API_URL = "http://localhost:8080/api/foods";

export const fetchFoodList = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log("Error in fetching food list: ", error);
    throw error;
  }
};

export const fetchFoodDetails = async (id) => {
  try {
    const response = await axios.get(API_URL + "/" + id);
    return response.data;
  } catch (error) {
    console.log("Error in fetching the food details: " + error);
    throw error;
  }
};
