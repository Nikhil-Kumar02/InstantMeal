import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

function FoodDisplay({category, searchText}) {
  const { foodList } = useContext(StoreContext);

  const filteredFoods = foodList.filter(food => (
    (category === 'All' || food.category === category) &&
    food.name.toLowerCase().includes(searchText.toLowerCase())
  ))
 
  return (
    <div className="container">
      <div className="row">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food, idx) => <FoodItem idx={idx} food={food} />)
        ) : (
          <>
            <div className="text-center mt-4">
              <h4>No food found.</h4>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FoodDisplay;
