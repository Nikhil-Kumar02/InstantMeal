import adminApiClient from "../services/adminApiClient";

const API_PATH = "/foods";

export const addFood = async (foodData) => {
  const response = await adminApiClient.post(API_PATH, foodData);
  return response.data;
};

export const getFoodList = async () => {
  const response = await adminApiClient.get(API_PATH);
  return response.data;
};

export const deleteFood = async (foodId) => {
  const response = await adminApiClient.delete(API_PATH + "/" + foodId);
  return response.status === 204;
};

export const updateFood = async (foodId, foodData) => {
  const response = await adminApiClient.put(API_PATH + "/" + foodId, foodData);
  return response.status === 200;
};
