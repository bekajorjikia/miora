import { createItem } from "@/lib/seed/create-item";
import type { Category, MenuItem } from "@/lib/types";

export const sushiRollsCategoryId = "sushi-rolls";
export const nigiriCategoryId = "nigiri";
export const sashimiCategoryId = "sashimi";
export const makiCategoryId = "maki";
export const gunkanCategoryId = "gunkan";
export const coldAppetizersCategoryId = "cold-appetizers";
export const hotAppetizersCategoryId = "hot-appetizers";
export const mainsCategoryId = "mains";
export const dessertsCategoryId = "desserts";

export function createFoodCategories(restaurantId: string): Category[] {
  return [
    {
      id: coldAppetizersCategoryId,
      restaurantId,
      name: { en: "Cold Appetizers", ka: "ცივი აპეტაიზერი" },
      sortOrder: 1,
    },
    {
      id: hotAppetizersCategoryId,
      restaurantId,
      name: { en: "Hot Appetizers", ka: "ცხელი აპეტაიზერი" },
      sortOrder: 2,
    },
    {
      id: sushiRollsCategoryId,
      restaurantId,
      name: { en: "Sushi Rolls", ka: "სუში როლები" },
      sortOrder: 3,
    },
    {
      id: nigiriCategoryId,
      restaurantId,
      name: { en: "Nigiri", ka: "ნიგირი" },
      sortOrder: 4,
    },
    {
      id: sashimiCategoryId,
      restaurantId,
      name: { en: "Sashimi", ka: "საშიმი" },
      sortOrder: 5,
    },
    {
      id: makiCategoryId,
      restaurantId,
      name: { en: "Maki", ka: "მაკი" },
      sortOrder: 6,
    },
    {
      id: gunkanCategoryId,
      restaurantId,
      name: { en: "Gunkan", ka: "გუნკანი" },
      sortOrder: 7,
    },
    {
      id: mainsCategoryId,
      restaurantId,
      name: { en: "Main Courses", ka: "მთავარი კერძი" },
      sortOrder: 8,
    },
    {
      id: dessertsCategoryId,
      restaurantId,
      name: { en: "Desserts", ka: "დესერტი" },
      sortOrder: 9,
    },
  ];
}

export function createFoodItems(restaurantId: string): MenuItem[] {
  const item = (
    seed: Parameters<typeof createItem>[1],
    sortOrder: number,
  ) => createItem(restaurantId, seed, sortOrder);

  return [
    item(
      {
        id: "philadelphia-royale",
        categoryId: sushiRollsCategoryId,
        name: { en: "Philadelphia Royale", ka: "ფილადელფია როიალი" },
      },
      1,
    ),
    item(
      {
        id: "dragon-classic",
        categoryId: sushiRollsCategoryId,
        name: { en: "Dragon Classic", ka: "დრაგონი კლასიკი" },
      },
      2,
    ),
    item(
      {
        id: "dragon-shrimp",
        categoryId: sushiRollsCategoryId,
        name: { en: "Dragon with Shrimp", ka: "დრაგონი კრევეტებით" },
      },
      3,
    ),
    item(
      {
        id: "philadelphia-classic",
        categoryId: sushiRollsCategoryId,
        name: { en: "Philadelphia Classic", ka: "ფილადელფია კლასიკი" },
      },
      4,
    ),
    item(
      {
        id: "new-philadelphia",
        categoryId: sushiRollsCategoryId,
        name: { en: "New Philadelphia", ka: "ნიუ ფილადელფია" },
      },
      5,
    ),
    item(
      {
        id: "california",
        categoryId: sushiRollsCategoryId,
        name: { en: "California", ka: "კალიფორნია" },
      },
      6,
    ),
    item(
      {
        id: "salmon-caviar-roll",
        categoryId: sushiRollsCategoryId,
        name: { en: "Salmon with Caviar", ka: "ორაგული ხიზილალით" },
      },
      7,
    ),
    item(
      {
        id: "crunch-roll",
        categoryId: sushiRollsCategoryId,
        name: { en: "Crunch Roll", ka: "ქრანჩ როლი" },
      },
      8,
    ),
    item(
      {
        id: "hot-california",
        categoryId: sushiRollsCategoryId,
        name: { en: "Hot California", ka: "ცხელი კალიფორნია" },
      },
      9,
    ),
    item(
      {
        id: "ebi-roll",
        categoryId: sushiRollsCategoryId,
        name: { en: "Ebi Roll", ka: "ები როლი" },
      },
      10,
    ),
    item(
      {
        id: "spicy-salmon-roll",
        categoryId: sushiRollsCategoryId,
        name: { en: "Spicy Salmon Roll", ka: "ცხარე ორაგულის როლი" },
        tags: ["spicy"],
      },
      11,
    ),
    item(
      {
        id: "philadelphia-sesame",
        categoryId: sushiRollsCategoryId,
        name: { en: "Philadelphia with Sesame", ka: "ფილადელფია სეზამით" },
      },
      12,
    ),
    item(
      {
        id: "veggie-roll",
        categoryId: sushiRollsCategoryId,
        name: { en: "Veggie Roll", ka: "ვეჯი როლი" },
        tags: ["vegetarian"],
      },
      13,
    ),
    item(
      {
        id: "rainbow-roll",
        categoryId: sushiRollsCategoryId,
        name: { en: "Rainbow Roll", ka: "ცისარტყელა როლი" },
      },
      14,
    ),
    item(
      {
        id: "tataki-roll",
        categoryId: sushiRollsCategoryId,
        name: { en: "Tataki Roll", ka: "ტატაკი როლი" },
      },
      15,
    ),

    item(
      {
        id: "salmon-nigiri",
        categoryId: nigiriCategoryId,
        name: { en: "Salmon Nigiri", ka: "ორაგულის ნიგირი" },
      },
      1,
    ),
    item(
      {
        id: "hot-salmon-nigiri",
        categoryId: nigiriCategoryId,
        name: { en: "Hot Salmon Nigiri", ka: "ცხელი ორაგულის ნიგირი" },
      },
      2,
    ),
    item(
      {
        id: "unagi-nigiri",
        categoryId: nigiriCategoryId,
        name: { en: "Unagi Nigiri", ka: "უნაგი ნიგირი" },
      },
      3,
    ),
    item(
      {
        id: "tuna-nigiri",
        categoryId: nigiriCategoryId,
        name: { en: "Tuna Nigiri", ka: "ტუნა ნიგირი" },
      },
      4,
    ),
    item(
      {
        id: "ebi-nigiri",
        categoryId: nigiriCategoryId,
        name: { en: "Ebi Nigiri", ka: "ები ნიგირი" },
      },
      5,
    ),
    item(
      {
        id: "nigiri-mix",
        categoryId: nigiriCategoryId,
        name: { en: "Nigiri Mix", ka: "ნიგირი მიქსი" },
      },
      6,
    ),

    item(
      {
        id: "salmon-sashimi",
        categoryId: sashimiCategoryId,
        name: { en: "Salmon Sashimi", ka: "ორაგულის საშიმი" },
      },
      1,
    ),
    item(
      {
        id: "tuna-sashimi",
        categoryId: sashimiCategoryId,
        name: { en: "Tuna Sashimi", ka: "ტუნა საშიმი" },
      },
      2,
    ),
    item(
      {
        id: "unagi-sashimi",
        categoryId: sashimiCategoryId,
        name: { en: "Unagi Sashimi", ka: "უნაგი საშიმი" },
      },
      3,
    ),
    item(
      {
        id: "sashimi-mix",
        categoryId: sashimiCategoryId,
        name: { en: "Sashimi Mix", ka: "საშიმი მიქსი" },
      },
      4,
    ),

    item(
      {
        id: "sake-maki",
        categoryId: makiCategoryId,
        name: { en: "Sake Maki", ka: "საკე მაკი" },
      },
      1,
    ),
    item(
      {
        id: "teka-maki",
        categoryId: makiCategoryId,
        name: { en: "Tekka Maki", ka: "ტეკა მაკი" },
      },
      2,
    ),
    item(
      {
        id: "unagi-maki",
        categoryId: makiCategoryId,
        name: { en: "Unagi Maki", ka: "უნაგი მაკი" },
      },
      3,
    ),
    item(
      {
        id: "avocado-maki",
        categoryId: makiCategoryId,
        name: { en: "Avocado Maki", ka: "ავოკადო მაკი" },
        tags: ["vegetarian"],
      },
      4,
    ),

    item(
      {
        id: "spicy-salmon-gunkan",
        categoryId: gunkanCategoryId,
        name: {
          en: "Spicy Salmon Gunkan",
          ka: "ცხარე ორაგულის გუნკანი",
        },
        tags: ["spicy"],
      },
      1,
    ),
    item(
      {
        id: "unagi-gunkan",
        categoryId: gunkanCategoryId,
        name: { en: "Unagi Gunkan", ka: "უნაგი გუნკანი" },
      },
      2,
    ),
    item(
      {
        id: "salmon-caviar-gunkan",
        categoryId: gunkanCategoryId,
        name: {
          en: "Salmon with Caviar Gunkan",
          ka: "ორაგული ხიზილალით გუნკანი",
        },
      },
      3,
    ),

    item(
      {
        id: "kimchi",
        categoryId: coldAppetizersCategoryId,
        name: { en: "Kimchi", ka: "კიმჩი" },
        tags: ["spicy", "vegetarian"],
      },
      1,
    ),
    item(
      {
        id: "hiyashi-salad",
        categoryId: coldAppetizersCategoryId,
        name: { en: "Hiyashi Salad", ka: "ჰიაში სალათი" },
      },
      2,
    ),
    item(
      {
        id: "smoked-salmon-salad",
        categoryId: coldAppetizersCategoryId,
        name: {
          en: "Smoked Salmon Salad",
          ka: "შებოლილი ორაგულის სალათი",
        },
      },
      3,
    ),
    item(
      {
        id: "salmon-tataki",
        categoryId: coldAppetizersCategoryId,
        name: { en: "Salmon Tataki", ka: "ორაგულის ტატაკი" },
      },
      4,
    ),
    item(
      {
        id: "chicken-poke",
        categoryId: coldAppetizersCategoryId,
        name: { en: "Chicken Poke", ka: "პოკე ქათმის" },
      },
      5,
    ),
    item(
      {
        id: "salmon-poke",
        categoryId: coldAppetizersCategoryId,
        name: { en: "Salmon Poke", ka: "ორაგულის პოკე" },
      },
      6,
    ),
    item(
      {
        id: "shrimp-poke",
        categoryId: coldAppetizersCategoryId,
        name: { en: "Shrimp Poke", ka: "კრევეტების პოკე" },
      },
      7,
    ),

    item(
      {
        id: "chicken-spring-roll",
        categoryId: hotAppetizersCategoryId,
        name: { en: "Chicken Spring Roll", ka: "ქათმის სპრინგ როლი" },
      },
      1,
    ),
    item(
      {
        id: "shrimp-tempura",
        categoryId: hotAppetizersCategoryId,
        name: { en: "Shrimp Tempura", ka: "კრევეტების ტემპურა" },
      },
      2,
    ),
    item(
      {
        id: "edamame",
        categoryId: hotAppetizersCategoryId,
        name: { en: "Edamame", ka: "ედამამე" },
        tags: ["vegetarian", "vegan"],
      },
      3,
    ),
    item(
      {
        id: "mozzarella-sticks",
        categoryId: hotAppetizersCategoryId,
        name: {
          en: "Mozzarella Sticks",
          ka: "მოცარელას ყველის ჩხირები",
        },
        tags: ["vegetarian"],
      },
      4,
    ),
    item(
      {
        id: "chicken-udon-sweet-sour",
        categoryId: hotAppetizersCategoryId,
        name: {
          en: "Chicken Udon Sweet & Sour",
          ka: "უდონი ქათმით ტკბილ-მჟავე",
        },
      },
      5,
    ),
    item(
      {
        id: "chicken-udon-sweet-spicy",
        categoryId: hotAppetizersCategoryId,
        name: {
          en: "Chicken Udon Sweet & Spicy",
          ka: "უდონი ქათმით ტკბილ-ცხარე",
        },
        tags: ["spicy"],
      },
      6,
    ),
    item(
      {
        id: "shrimp-udon",
        categoryId: hotAppetizersCategoryId,
        name: { en: "Shrimp Udon", ka: "უდონი კრევეტით" },
      },
      7,
    ),
    item(
      {
        id: "beef-udon",
        categoryId: hotAppetizersCategoryId,
        name: { en: "Beef Udon", ka: "უდონი საქონლის" },
      },
      8,
    ),
    item(
      {
        id: "veggie-udon",
        categoryId: hotAppetizersCategoryId,
        name: { en: "Veggie Udon", ka: "უდონი ვეჯი" },
        tags: ["vegetarian"],
      },
      9,
    ),
    item(
      {
        id: "rice-chicken-egg",
        categoryId: hotAppetizersCategoryId,
        name: {
          en: "Rice with Chicken & Egg",
          ka: "ბრინჯი ქათმით და კვერცხით",
        },
      },
      10,
    ),
    item(
      {
        id: "steam-rice",
        categoryId: hotAppetizersCategoryId,
        name: {
          en: "Steamed Rice",
          ka: "ორთქლზე მომზადებული ბრინჯი",
        },
        description: {
          en: "Steam rice",
          ka: "სთიმ რაისი",
        },
        tags: ["vegetarian", "vegan"],
      },
      11,
    ),

    item(
      {
        id: "chicken-ramen",
        categoryId: mainsCategoryId,
        name: { en: "Chicken Ramen", ka: "რამენი ქათმის" },
      },
      1,
    ),
    item(
      {
        id: "tom-yum-shrimp",
        categoryId: mainsCategoryId,
        name: { en: "Tom Yum with Shrimp", ka: "ტომ იამი კრევეტებით" },
        tags: ["spicy"],
      },
      2,
    ),
    item(
      {
        id: "salmon-steak",
        categoryId: mainsCategoryId,
        name: { en: "Salmon Steak", ka: "ორაგულის სტეიკი" },
      },
      3,
    ),
    item(
      {
        id: "beef-sukiyaki-steak",
        categoryId: mainsCategoryId,
        name: {
          en: "Beef Sukiyaki Steak",
          ka: "საქონლის სუკი სტეიკი",
        },
      },
      4,
    ),
    item(
      {
        id: "chicken-sweet-sour",
        categoryId: mainsCategoryId,
        name: {
          en: "Chicken in Sweet & Sour Sauce",
          ka: "ქათამი ტკბილ-მჟავე სოუსით",
        },
      },
      5,
    ),
    item(
      {
        id: "green-curry",
        categoryId: mainsCategoryId,
        name: { en: "Green Curry", ka: "მწვანე ქარი" },
        tags: ["spicy"],
      },
      6,
    ),
    item(
      {
        id: "dorado",
        categoryId: mainsCategoryId,
        name: { en: "Dorado", ka: "დორადო" },
      },
      7,
    ),

    item(
      {
        id: "basque-cheesecake",
        categoryId: dessertsCategoryId,
        name: { en: "Basque Cheesecake", ka: "ბასკური ჩიზქეიქი" },
        tags: ["vegetarian"],
      },
      1,
    ),
    item(
      {
        id: "tiramisu",
        categoryId: dessertsCategoryId,
        name: { en: "Tiramisu", ka: "ტირამისუ" },
        tags: ["vegetarian"],
      },
      2,
    ),
    item(
      {
        id: "banana-spring-roll",
        categoryId: dessertsCategoryId,
        name: { en: "Banana Spring Roll", ka: "ბანანის სპრინგ როლი" },
        tags: ["vegetarian"],
      },
      3,
    ),
    item(
      {
        id: "exotic-fruit-assortment",
        categoryId: dessertsCategoryId,
        name: {
          en: "Exotic Fruit Assortment",
          ka: "ეგზოტიკური ხილის ასორტი",
        },
        tags: ["vegetarian", "vegan"],
      },
      4,
    ),
  ];
}
