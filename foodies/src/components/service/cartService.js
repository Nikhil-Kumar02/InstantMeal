import apiClient from "../../services/apiClient";

export const addToCart = async (foodId) => {
  try {
    const response = await apiClient.post("/cart", { foodId });
    return response.data;
  } catch (error) {
    console.error("Error while adding the cart data: ", error);
  }
};

export const removeQtyFromCart = async (foodId) => {
  try {
    const response = await apiClient.post("/cart/remove", { foodId });
    return response.data;
  } catch (error) {
    console.error("Error while removing the qty from cart: ", error);
  }
};

export const getCartData = async () => {
  try {
    const response = await apiClient.get("/cart");
    return response.data ? response.data.items : {};
  } catch (error) {
    console.error("Error while fetching the data: ", error);
    return {};
  }
};
