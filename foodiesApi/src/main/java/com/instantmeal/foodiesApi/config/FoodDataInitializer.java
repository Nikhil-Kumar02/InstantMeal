package com.instantmeal.foodiesApi.config;

import com.instantmeal.foodiesApi.entity.FoodEntity;
import com.instantmeal.foodiesApi.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FoodDataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;

    @Override
    public void run(String... args) {

        /*
         * Only insert the initial food data when the
         * foods collection is empty.
         *
         * This prevents duplicate foods every time
         * Spring Boot starts.
         */
        if (foodRepository.count() > 0) {
            System.out.println(
                    "Food collection already contains data. Skipping food initialization."
            );
            return;
        }

        List<FoodEntity> foods = List.of(

                // =========================
                // BIRYANI
                // =========================

                createFood(
                        "Veg Biryani",
                        "Fragrant basmati rice with mixed vegetables",
                        249,
                        "Biryani",
                        "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Paneer Biryani",
                        "Paneer cubes cooked with saffron rice",
                        299,
                        "Biryani",
                        "https://media.istockphoto.com/id/2204467102/photo/delicious-paneer-biryani.jpg?s=612x612&w=0&k=20&c=9Cw5NxobWgtlMtdgdEoWgELYj1gIlpjAlQvz68enH1A="
                ),

                createFood(
                        "Chicken Biryani",
                        "Spicy Hyderabadi chicken biryani",
                        299,
                        "Biryani",
                        "https://media.istockphoto.com/id/2254897359/photo/homemade-delicious-chicken-biriyani-served-in-cast-iron-pan.webp?a=1&b=1&s=612x612&w=0&k=20&c=IieK3z-KHQfURK6sgMHHOcdUZybz1huTK14ljevuz8k="
                ),

                createFood(
                        "Mutton Biryani",
                        "Tender mutton pieces cooked with aromatic spices",
                        349,
                        "Biryani",
                        "https://media.istockphoto.com/id/1058029096/photo/chicken-biryani.webp?a=1&b=1&s=612x612&w=0&k=20&c=jjPwycS_qHz52KYp4sNBXRy9gl6k4L8KXsN8b9En9fs="
                ),

                createFood(
                        "Egg Biryani",
                        "Boiled eggs layered with spiced rice",
                        199,
                        "Biryani",
                        "https://media.istockphoto.com/id/2218881177/photo/keema-rice-made-with-lamb-mince-basmati-rice-with-aromatic-spices.webp?a=1&b=1&s=612x612&w=0&k=20&c=xLLe_0d3HJuvwnJHJKP1UkdoKDgOhFA-WZVVOymO2WQ="
                ),

                // =========================
                // CAKES
                // =========================

                createFood(
                        "Chocolate Cake",
                        "Rich chocolate sponge with ganache",
                        199,
                        "Cake",
                        "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Red Velvet Cake",
                        "Classic red velvet with cream cheese frosting",
                        229,
                        "Cake",
                        "https://images.unsplash.com/photo-1602630209855-dceac223adfe?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Black Forest Cake",
                        "Chocolate sponge layered with cherries and cream",
                        249,
                        "Cake",
                        "https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Pineapple Cake",
                        "Soft sponge with pineapple chunks and cream",
                        189,
                        "Cake",
                        "https://images.unsplash.com/photo-1628505048571-327399c9324c?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Butterscotch Cake",
                        "Caramelized butterscotch layered sponge",
                        209,
                        "Cake",
                        "https://plus.unsplash.com/premium_photo-1714669889975-90386fbb03e4?w=600&auto=format&fit=crop&q=60"
                ),

                // =========================
                // BURGERS
                // =========================

                createFood(
                        "Veg Burger",
                        "Crispy veggie patty with cheese",
                        149,
                        "Burger",
                        "https://images.unsplash.com/photo-1610970878459-a0e464d7592b?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Chicken Burger",
                        "Grilled chicken patty with lettuce and mayo",
                        179,
                        "Burger",
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Cheese Burger",
                        "Juicy patty topped with melted cheese",
                        199,
                        "Burger",
                        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Double Patty Burger",
                        "Two patties stacked with sauces",
                        249,
                        "Burger",
                        "https://plus.unsplash.com/premium_photo-1683619761492-639240d29bb5?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Paneer Burger",
                        "Paneer patty with spicy sauce",
                        169,
                        "Burger",
                        "https://plus.unsplash.com/premium_photo-1664392112262-271039647be9?w=600&auto=format&fit=crop&q=60"
                ),

                // =========================
                // PIZZA
                // =========================

                createFood(
                        "Regular Pizza",
                        "Paneer pizza with cheese topping",
                        359,
                        "Pizza",
                        "https://plus.unsplash.com/premium_photo-1733259709671-9dbf22bf02cc?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Pepperoni Pizza",
                        "Classic pepperoni with mozzarella",
                        399,
                        "Pizza",
                        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Margherita Pizza",
                        "Simple tomato, mozzarella and basil",
                        299,
                        "Pizza",
                        "https://images.unsplash.com/photo-1613564834361-9436948817d1?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "BBQ Chicken Pizza",
                        "Chicken chunks with BBQ sauce",
                        429,
                        "Pizza",
                        "https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Veggie Supreme Pizza",
                        "Loaded with fresh vegetables",
                        349,
                        "Pizza",
                        "https://media.istockphoto.com/id/115041754/photo/isolated-pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=DahirV3jiRWlV8N1g-uMOYDLxudyYfeLWi5lDO3m8EI="
                ),

                // =========================
                // ROLLS
                // =========================

                createFood(
                        "Paneer Roll",
                        "Soft roll stuffed with paneer tikka",
                        129,
                        "Rolls",
                        "https://media.istockphoto.com/id/1352474720/photo/fresh-paneer-roll-with-fresh-tomatos-salad-cheese-and-onions-isolated-on-bright-blue.webp?a=1&b=1&s=612x612&w=0&k=20&c=HHeBNencFEcT2ZplHH2SJ-5us8L-m8GYHmfMhoMuzaw="
                ),

                createFood(
                        "Chicken Kathi Roll",
                        "Paratha roll with spicy chicken filling",
                        149,
                        "Rolls",
                        "https://media.istockphoto.com/id/1324902900/photo/soya-paneer-kathi-roll.webp?a=1&b=1&s=612x612&w=0&k=20&c=Nd5jJIW_-JdaOWMnX4TME1joUija0t9ien6mxt4aIH4="
                ),

                createFood(
                        "Egg Roll",
                        "Paratha roll with egg filling",
                        99,
                        "Rolls",
                        "https://media.istockphoto.com/id/1400110943/photo/mix-vegetable-kathi-roll.webp?a=1&b=1&s=612x612&w=0&k=20&c=_zAwEz0dR0ECdPVfLJRs07jE91mtqayl6Epvjr8CJg0="
                ),

                createFood(
                        "Veg Roll",
                        "Roll stuffed with mixed veggies",
                        109,
                        "Rolls",
                        "https://media.istockphoto.com/id/1400256468/photo/mix-vegetable-kathi-roll.webp?a=1&b=1&s=612x612&w=0&k=20&c=lEAqXmWXQJeaY_1dbah56qRGmRx2EukJ2u-skGVYCZ0="
                ),

                createFood(
                        "Cheese Roll",
                        "Cheese-stuffed roll with herbs",
                        139,
                        "Rolls",
                        "https://media.istockphoto.com/id/1251257258/photo/cheese-paneer-kathi-roll-or-wrap-vegetarians-indian-food.webp?a=1&b=1&s=612x612&w=0&k=20&c=1kjhla9wD1OG1VwFC9hIcVC6EHuOV9o1PEexACmMaHY="
                ),

                // =========================
                // SALADS
                // =========================

                createFood(
                        "Greek Salad",
                        "Fresh veggies with feta and olives",
                        179,
                        "Salad",
                        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Caesar Salad",
                        "Crisp lettuce with parmesan and croutons",
                        159,
                        "Salad",
                        "https://plus.unsplash.com/premium_photo-1673590981774-d9f534e0c617?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Fruit Salad",
                        "Seasonal fruits tossed with honey",
                        129,
                        "Salad",
                        "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Sprout Salad",
                        "Healthy sprouts with lemon dressing",
                        119,
                        "Salad",
                        "https://plus.unsplash.com/premium_photo-1700089483464-4f76cc3d360b?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Pasta Salad",
                        "Cold pasta with veggies and mayo",
                        149,
                        "Salad",
                        "https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&auto=format&fit=crop&q=60"
                ),

                // =========================
                // ICE CREAM
                // =========================

                createFood(
                        "Vanilla Ice Cream",
                        "Classic vanilla scoop",
                        99,
                        "Ice-cream",
                        "https://images.unsplash.com/photo-1597249536924-b226b1a1259d?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Strawberry Ice Cream",
                        "Fresh strawberry flavored ice cream",
                        109,
                        "Ice-cream",
                        "https://media.istockphoto.com/id/1264447447/photo/strawberry-ice-cream-with-fresh-strawberries.webp?a=1&b=1&s=612x612&w=0&k=20&c=SnKbjwwVzxt0K3NRTOTcsZTVzNtoJYwqI1x0pbWKNxQ="
                ),

                createFood(
                        "Chocolate Ice Cream",
                        "Rich and creamy chocolate scoop",
                        119,
                        "Ice-cream",
                        "https://images.unsplash.com/photo-1642646689566-60c53a8c1ef4?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Mango Ice Cream",
                        "Seasonal mango flavored ice cream",
                        129,
                        "Ice-cream",
                        "https://images.unsplash.com/photo-1663904458920-f153c162fa79?w=600&auto=format&fit=crop&q=60"
                ),

                createFood(
                        "Butterscotch Ice Cream",
                        "Caramelized butterscotch flavored scoop",
                        139,
                        "Ice-cream",
                        "https://media.istockphoto.com/id/1323710064/photo/ice-cream-in-a-waffle-cone-isolated-on-white-background-there-is-free-space-for-text.webp?a=1&b=1&s=612x612&w=0&k=20&c=KHIVuSWyUTdb_sxC1t7DKw28mIY7nXXR8dVq4gq8IyU="
                )
        );

        foodRepository.saveAll(foods);

        System.out.println(
                "Successfully initialized " +
                        foods.size() +
                        " food items."
        );
    }

    private FoodEntity createFood(
            String name,
            String description,
            double price,
            String category,
            String imageUrl
    ) {

        return FoodEntity.builder()
                .name(name)
                .description(description)
                .price(price)
                .category(category)
                .imageUrl(imageUrl)
                .build();
    }
}