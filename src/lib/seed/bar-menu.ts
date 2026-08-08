import { createItem } from "@/lib/seed/create-item";
import type { Category, MenuItem } from "@/lib/types";

export const whiskeyCategoryId = "whiskey";
export const tequilaCategoryId = "tequila-mezcal";
export const cognacCategoryId = "cognac-brandy";
export const rumCategoryId = "rum";
export const ginCategoryId = "gin";
export const vermouthCategoryId = "vermouth";
export const liqueurCategoryId = "liqueur";
export const vodkaChachaCategoryId = "vodka-chacha";
export const champagneCategoryId = "champagne";
export const sakeCategoryId = "sake";
export const beerCategoryId = "beer";
export const softDrinksCategoryId = "soft-drinks";
export const coffeeTeaCategoryId = "coffee-tea";

export function createBarCategories(restaurantId: string): Category[] {
  return [
    {
      id: whiskeyCategoryId,
      restaurantId,
      name: { en: "Whiskey", ka: "ვისკი" },
      sortOrder: 13,
    },
    {
      id: tequilaCategoryId,
      restaurantId,
      name: { en: "Tequila / Mezcal", ka: "ტეკილა / მეზკალი" },
      sortOrder: 14,
    },
    {
      id: cognacCategoryId,
      restaurantId,
      name: { en: "Cognac / Brandy", ka: "კონიაკი / ბრენდი" },
      sortOrder: 15,
    },
    {
      id: rumCategoryId,
      restaurantId,
      name: { en: "Rum", ka: "რომი" },
      sortOrder: 16,
    },
    {
      id: ginCategoryId,
      restaurantId,
      name: { en: "Gin", ka: "ჯინი" },
      sortOrder: 17,
    },
    {
      id: vermouthCategoryId,
      restaurantId,
      name: { en: "Vermouth", ka: "ვერმუტი" },
      sortOrder: 18,
    },
    {
      id: liqueurCategoryId,
      restaurantId,
      name: { en: "Liqueur", ka: "ლიქიორი" },
      sortOrder: 19,
    },
    {
      id: vodkaChachaCategoryId,
      restaurantId,
      name: { en: "Vodka / Chacha", ka: "არაყი / ჭაჭა" },
      sortOrder: 20,
    },
    {
      id: champagneCategoryId,
      restaurantId,
      name: { en: "Champagne & Sparkling", ka: "შამპანიური" },
      sortOrder: 21,
    },
    {
      id: sakeCategoryId,
      restaurantId,
      name: { en: "Sake", ka: "საკე" },
      sortOrder: 22,
    },
    {
      id: beerCategoryId,
      restaurantId,
      name: { en: "Beer", ka: "ლუდი" },
      sortOrder: 23,
    },
    {
      id: softDrinksCategoryId,
      restaurantId,
      name: { en: "Soft Drinks", ka: "ცივი სასმელები" },
      sortOrder: 24,
    },
    {
      id: coffeeTeaCategoryId,
      restaurantId,
      name: { en: "Coffee / Tea", ka: "ყავა / ჩაი" },
      sortOrder: 25,
    },
  ];
}

export function createBarItems(restaurantId: string): MenuItem[] {
  const item = (
    seed: Parameters<typeof createItem>[1],
    sortOrder: number,
  ) => createItem(restaurantId, seed, sortOrder);

  return [
    item(
      {
        id: "jameson",
        categoryId: whiskeyCategoryId,
        name: { en: "Jameson", ka: "ჯეიმსონი" },
      },
      1,
    ),
    item(
      {
        id: "glenmorangie",
        categoryId: whiskeyCategoryId,
        name: { en: "Glenmorangie", ka: "გლენმორანჟი" },
      },
      2,
    ),
    item(
      {
        id: "talisker",
        categoryId: whiskeyCategoryId,
        name: { en: "Talisker", ka: "ტალისკერი" },
      },
      3,
    ),
    item(
      {
        id: "ardbeg-5",
        categoryId: whiskeyCategoryId,
        name: { en: "Ardbeg 5", ka: "არდბეგი 5" },
      },
      4,
    ),
    item(
      {
        id: "four-roses",
        categoryId: whiskeyCategoryId,
        name: { en: "Four Roses", ka: "ფორ როუსი" },
      },
      5,
    ),
    item(
      {
        id: "chivas-regal",
        categoryId: whiskeyCategoryId,
        name: { en: "Chivas Regal", ka: "ჩივას რეგალი" },
      },
      6,
    ),
    item(
      {
        id: "hakushu",
        categoryId: whiskeyCategoryId,
        name: { en: "Hakushu", ka: "ჰაკუშუ" },
      },
      7,
    ),
    item(
      {
        id: "hibiki",
        categoryId: whiskeyCategoryId,
        name: { en: "Hibiki", ka: "ჰიბიკი" },
      },
      8,
    ),
    item(
      {
        id: "nobushi",
        categoryId: whiskeyCategoryId,
        name: { en: "Nobushi", ka: "ნობუში" },
      },
      9,
    ),
    item(
      {
        id: "monkey-shoulder",
        categoryId: whiskeyCategoryId,
        name: { en: "Monkey Shoulder", ka: "მანქი შოულდერი" },
      },
      10,
    ),

    item(
      {
        id: "koch-el",
        categoryId: tequilaCategoryId,
        name: { en: "Koch El", ka: "კოჩელი" },
      },
      1,
    ),
    item(
      {
        id: "olmeca-silver",
        categoryId: tequilaCategoryId,
        name: { en: "Olmeca Silver", ka: "ოლმეკა სილვერი" },
      },
      2,
    ),
    item(
      {
        id: "olmeca-gold",
        categoryId: tequilaCategoryId,
        name: { en: "Olmeca Gold", ka: "ოლმეკა გოლდი" },
      },
      3,
    ),
    item(
      {
        id: "volcan-gold-silver",
        categoryId: tequilaCategoryId,
        name: { en: "Volcán Gold / Silver", ka: "ვოლკანი გოლდი / სილვერი" },
      },
      4,
    ),

    item(
      {
        id: "sarajishvili-vsop",
        categoryId: cognacCategoryId,
        name: { en: "Sarajishvili VSOP", ka: "სარაჯიშვილი VSOP" },
      },
      1,
    ),
    item(
      {
        id: "sarajishvili-xo",
        categoryId: cognacCategoryId,
        name: { en: "Sarajishvili XO", ka: "სარაჯიშვილი XO" },
      },
      2,
    ),
    item(
      {
        id: "hennessy-vs",
        categoryId: cognacCategoryId,
        name: { en: "Hennessy VS", ka: "ჰენესი VS" },
      },
      3,
    ),
    item(
      {
        id: "hennessy-xo",
        categoryId: cognacCategoryId,
        name: { en: "Hennessy XO", ka: "ჰენესი XO" },
      },
      4,
    ),

    item(
      {
        id: "bukman",
        categoryId: rumCategoryId,
        name: { en: "Bukman", ka: "ბუკმანი" },
      },
      1,
    ),
    item(
      {
        id: "captain-morgan-white",
        categoryId: rumCategoryId,
        name: { en: "Captain Morgan White", ka: "კაპიტან მორგანი თეთრი" },
      },
      2,
    ),
    item(
      {
        id: "beach-house-pink",
        categoryId: rumCategoryId,
        name: { en: "Beach House Pink", ka: "ბიჩ ჰაუს ფინქი" },
      },
      3,
    ),
    item(
      {
        id: "plantation-3-stars",
        categoryId: rumCategoryId,
        name: { en: "Plantation 3 Stars", ka: "Plantation 3 Stars" },
      },
      4,
    ),
    item(
      {
        id: "havana-club",
        categoryId: rumCategoryId,
        name: { en: "Havana Club", ka: "ჰავანა ქლაბი" },
      },
      5,
    ),
    item(
      {
        id: "captain-morgan-dark",
        categoryId: rumCategoryId,
        name: { en: "Captain Morgan Dark", ka: "კაპიტან მორგანი შავი" },
      },
      6,
    ),
    item(
      {
        id: "plantation-dark",
        categoryId: rumCategoryId,
        name: { en: "Plantation Dark", ka: "Plantation Dark" },
      },
      7,
    ),

    item(
      {
        id: "hendricks",
        categoryId: ginCategoryId,
        name: { en: "Hendrick's", ka: "ჰენდრიქსი" },
      },
      1,
    ),
    item(
      {
        id: "tanqueray-london-dry",
        categoryId: ginCategoryId,
        name: { en: "Tanqueray London Dry", ka: "თანქერეი ლონდონ დრაი" },
      },
      2,
    ),
    item(
      {
        id: "roku",
        categoryId: ginCategoryId,
        name: { en: "Roku", ka: "როკუ" },
      },
      3,
    ),

    item(
      {
        id: "martini-bianco",
        categoryId: vermouthCategoryId,
        name: { en: "Martini Bianco", ka: "მარტინი ბიანკო" },
      },
      1,
    ),
    item(
      {
        id: "martini-extra-dry",
        categoryId: vermouthCategoryId,
        name: { en: "Martini Extra Dry", ka: "მარტინი ექსტრა დრაი" },
      },
      2,
    ),
    item(
      {
        id: "martini-rosso",
        categoryId: vermouthCategoryId,
        name: { en: "Martini Rosso", ka: "მარტინი როსო" },
      },
      3,
    ),

    item(
      {
        id: "cointreau",
        categoryId: liqueurCategoryId,
        name: { en: "Cointreau", ka: "კუანტრო" },
      },
      1,
    ),
    item(
      {
        id: "triple-sec",
        categoryId: liqueurCategoryId,
        name: { en: "Triple Sec", ka: "ტრიპლ სეკი" },
      },
      2,
    ),
    item(
      {
        id: "operative",
        categoryId: liqueurCategoryId,
        name: { en: "Operative", ka: "Operative" },
      },
      3,
    ),
    item(
      {
        id: "jagermeister",
        categoryId: liqueurCategoryId,
        name: { en: "Jägermeister", ka: "იაგერი" },
      },
      4,
    ),
    item(
      {
        id: "kahlua",
        categoryId: liqueurCategoryId,
        name: { en: "Kahlúa", ka: "კალუა" },
      },
      5,
    ),
    item(
      {
        id: "campari",
        categoryId: liqueurCategoryId,
        name: { en: "Campari", ka: "კამპარი" },
      },
      6,
    ),
    item(
      {
        id: "aperol",
        categoryId: liqueurCategoryId,
        name: { en: "Aperol", ka: "აპეროლი" },
      },
      7,
    ),
    item(
      {
        id: "malibu",
        categoryId: liqueurCategoryId,
        name: { en: "Malibu", ka: "მალიბუ" },
      },
      8,
    ),
    item(
      {
        id: "disaronno",
        categoryId: liqueurCategoryId,
        name: { en: "Disaronno", ka: "დისარონო" },
      },
      9,
    ),
    item(
      {
        id: "st-germain",
        categoryId: liqueurCategoryId,
        name: {
          en: "St-Germain Elderflower",
          ka: "St-Germain Elderflower",
        },
      },
      10,
    ),
    item(
      {
        id: "feijoa-bergamot-liqueur",
        categoryId: liqueurCategoryId,
        name: {
          en: "Feijoa / Bergamot Liqueur",
          ka: "ფეიხოა ლიქიორი / ბერგამოტო",
        },
      },
      11,
    ),

    item(
      {
        id: "absolut",
        categoryId: vodkaChachaCategoryId,
        name: { en: "Absolut", ka: "აბსოლუტი" },
      },
      1,
    ),
    item(
      {
        id: "grey-goose",
        categoryId: vodkaChachaCategoryId,
        name: { en: "Grey Goose", ka: "გრეი გუსი" },
      },
      2,
    ),
    item(
      {
        id: "belvedere",
        categoryId: vodkaChachaCategoryId,
        name: { en: "Belvedere", ka: "ბელვედერი" },
      },
      3,
    ),
    item(
      {
        id: "chateau-mukhrani",
        categoryId: vodkaChachaCategoryId,
        name: { en: "Château Mukhrani", ka: "შატო მუხრანი" },
      },
      4,
    ),
    item(
      {
        id: "house-chacha",
        categoryId: vodkaChachaCategoryId,
        name: { en: "House Chacha", ka: "სახლის ჭაჭა" },
      },
      5,
    ),

    item(
      {
        id: "prosecco-house-brut",
        categoryId: champagneCategoryId,
        name: {
          en: "Prosecco House Brut",
          ka: "პროსეკო სამუშაო ბრუტი",
        },
      },
      1,
    ),
    item(
      {
        id: "prosecco",
        categoryId: champagneCategoryId,
        name: { en: "Prosecco", ka: "პროსეკო" },
      },
      2,
    ),
    item(
      {
        id: "moet",
        categoryId: champagneCategoryId,
        name: { en: "Moët", ka: "მოეტი" },
      },
      3,
    ),

    item(
      {
        id: "ozeki-sake",
        categoryId: sakeCategoryId,
        name: { en: "Ozeki Sake", ka: "ოზეკი საკე" },
      },
      1,
    ),
    item(
      {
        id: "yuzu-sake",
        categoryId: sakeCategoryId,
        name: { en: "Yuzu Sake", ka: "იუზუ საკე" },
      },
      2,
    ),

    item(
      {
        id: "black-lion-beer",
        categoryId: beerCategoryId,
        name: { en: "Black Lion", ka: "შავი ლომი" },
        description: {
          en: "IPA / APA / Helles",
          ka: "IPA / APA / ჰელესი",
        },
      },
      1,
    ),
    item(
      {
        id: "estrella",
        categoryId: beerCategoryId,
        name: { en: "Estrella", ka: "Estrella" },
      },
      2,
    ),
    item(
      {
        id: "draft-beer",
        categoryId: beerCategoryId,
        name: { en: "Draft Beer", ka: "ჩამოსასხმელი ლუდი" },
        description: {
          en: "3 styles — filtered / unfiltered Helles / IPA",
          ka: "3 სახეობა — გაფილტრული / გაუფილტრავი ჰელესი / IPA",
        },
      },
      3,
    ),

    item(
      {
        id: "coca-cola",
        categoryId: softDrinksCategoryId,
        name: { en: "Coca-Cola", ka: "კოკა-კოლა" },
        description: {
          en: "Classic / Zero",
          ka: "კლასიკი / ზერო",
        },
      },
      1,
    ),
    item(
      {
        id: "tonic",
        categoryId: softDrinksCategoryId,
        name: { en: "Tonic", ka: "ტონიკი" },
      },
      2,
    ),
    item(
      {
        id: "still-water",
        categoryId: softDrinksCategoryId,
        name: { en: "Water", ka: "წყალი" },
      },
      3,
    ),
    item(
      {
        id: "sparkling-water",
        categoryId: softDrinksCategoryId,
        name: { en: "Sparkling Water / Kobi", ka: "გაზიანი წყალი / კობი" },
      },
      4,
    ),
    item(
      {
        id: "fresh-juice",
        categoryId: softDrinksCategoryId,
        name: { en: "Fresh Juice", ka: "ფრეში" },
        description: {
          en: "Orange, grapefruit",
          ka: "ფორთოხალი, გრეიფრუტი",
        },
      },
      5,
    ),
    item(
      {
        id: "nabeghlavi",
        categoryId: softDrinksCategoryId,
        name: { en: "Nabeghlavi", ka: "ნაბეღლავი" },
      },
      6,
    ),
    item(
      {
        id: "red-bull",
        categoryId: softDrinksCategoryId,
        name: { en: "Red Bull", ka: "რედბული" },
      },
      7,
    ),
    item(
      {
        id: "house-lemonade",
        categoryId: softDrinksCategoryId,
        name: { en: "House Lemonade", ka: "სახლის ლიმონათი" },
        description: {
          en: "Mint-lemon / berry / peach–passion fruit / pomegranate",
          ka: "პიტნა-ლიმონი / კენკრა / ატამი–მარაკუია / ბროწეული",
        },
      },
      8,
    ),

    item(
      {
        id: "espresso",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Espresso", ka: "ესპრესო" },
      },
      1,
    ),
    item(
      {
        id: "americano",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Americano", ka: "ამერიკანო" },
      },
      2,
    ),
    item(
      {
        id: "cappuccino",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Cappuccino", ka: "კაპუჩინო" },
      },
      3,
    ),
    item(
      {
        id: "latte",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Latte / Iced Latte", ka: "ლატე / ცივი ლატე" },
      },
      4,
    ),
    item(
      {
        id: "iced-coffee",
        categoryId: coffeeTeaCategoryId,
        name: {
          en: "Iced Coffee / with Ice Cream",
          ka: "ცივი ყავა / ნაყინით",
        },
      },
      5,
    ),
    item(
      {
        id: "matcha-latte",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Matcha Latte", ka: "Matcha ლატე" },
      },
      6,
    ),
    item(
      {
        id: "tea-black",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Black Tea", ka: "შავი ჩაი" },
      },
      7,
    ),
    item(
      {
        id: "tea-green",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Green Tea", ka: "მწვანე ჩაი" },
      },
      8,
    ),
    item(
      {
        id: "tea-jasmine",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Jasmine Tea", ka: "ჟასმინის ჩაი" },
      },
      9,
    ),
    item(
      {
        id: "tea-berry",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Berry Tea", ka: "კენკრის ჩაი" },
      },
      10,
    ),
    item(
      {
        id: "tea-mint",
        categoryId: coffeeTeaCategoryId,
        name: { en: "Mint Tea", ka: "პიტნის ჩაი" },
      },
      11,
    ),
  ];
}
