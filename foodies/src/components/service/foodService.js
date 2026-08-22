import apiClient from "../../services/apiClient";

export const fetchFoodList = async () => {
  try {
    const response = await apiClient.get("/foods");
    return response.data;
  } catch (error) {
    console.error("Error in fetching food list: ", error);
    throw error;
  }
};

export const fetchFoodDetails = async (id) => {
  try {
    const response = await apiClient.get("/foods/" + id);
    return response.data;
  } catch (error) {
    console.error("Error in fetching the food details: ", error);
    throw error;
  }
};
