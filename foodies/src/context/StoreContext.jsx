import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../components/service/foodService";
import axios from "axios";
import { addToCart, removeQtyFromCart, getCartData } from "../components/service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList] = useState([]);
    const[quantities, setQuantities] = useState({});
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");

    const increaseQty = async (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: (prev[foodId] || 0)+1}));
        await addToCart(foodId, token);
    }
          
    const decreaseQty = async (foodId) => {
        setQuantities((prev) => ({...prev, [foodId]: prev[foodId]  > 0 ? prev[foodId]-1 : 0}));
        await removeQtyFromCart(foodId, token);
    }

    const removeFromCart = (foodId) => {
        setQuantities((prevQuantities) => {
            const updatedQuantities = {...prevQuantities};
            delete updatedQuantities[foodId];
            return updatedQuantities;
        })
    }

    const loadCartData = async (token) => {
        const items = await getCartData(token);
        setQuantities(items);
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
        setToken
    };

    useEffect(() => {
        async function loadData() {
            const data = await fetchFoodList();
            setFoodList(data);

            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])

    useEffect(() => {
        if (token) {
            loadCartData(token);
        } else {
            setQuantities({}); // clear cart on logout
        }
    }, [token]);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}