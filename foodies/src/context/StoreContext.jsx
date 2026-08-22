import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../components/service/foodService";
import { addToCart, removeQtyFromCart, getCartData } from "../components/service/cartService";
import { getProfile } from "../components/service/authService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [user, setUser] = useState(null);

    const increaseQty = async (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: (prev[foodId] || 0) + 1}));
        if (token) {
            await addToCart(foodId);
        }
    }
          
    const decreaseQty = async (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0}));
        if (token) {
            await removeQtyFromCart(foodId);
        }
    }

    const removeFromCart = (foodId) => {
        setQuantities((prevQuantities) => {
            const updatedQuantities = {...prevQuantities};
            delete updatedQuantities[foodId];
            return updatedQuantities;
        });
    }

    const loadCartData = async () => {
        const items = await getCartData();
        setQuantities(items);
    }

    const loadUserData = async () => {
        try {
            const profile = await getProfile();
            setUser(profile);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            setUser(null);
        }
    }

    const contextValue = {
        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        setQuantities,
        removeFromCart,
        loadCartData,
        token,
        setToken,
        user,
        setUser,
        loadUserData
    };

    useEffect(() => {
        async function loadData() {
            const data = await fetchFoodList();
            setFoodList(data);

            if (token) {
                await loadUserData();
                await loadCartData();
            }
        }
        loadData();
    }, [token]);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}