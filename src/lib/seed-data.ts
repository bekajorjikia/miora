import {
  createBarCategories,
  createBarItems,
} from "@/lib/seed/bar-menu";
import {
  createFoodCategories,
  createFoodItems,
} from "@/lib/seed/food-menu";
import type { Category, MenuItem, Restaurant } from "@/lib/types";

export const restaurant: Restaurant = {
  id: "miora",
  name: "MIORA",
  defaultLanguage: "en",
  supportedLanguages: ["en", "ka"],
  currency: "GEL",
};

const classicCocktailsCategoryId = "classic-cocktails";
const mixCocktailsCategoryId = "mix-cocktails";
const specialCocktailsCategoryId = "special-cocktails";

const cocktailCategories: Category[] = [
  {
    id: classicCocktailsCategoryId,
    restaurantId: restaurant.id,
    name: {
      en: "Classic Cocktails",
      ka: "კლასიკური კოქტეილები",
    },
    sortOrder: 10,
  },
  {
    id: mixCocktailsCategoryId,
    restaurantId: restaurant.id,
    name: {
      en: "Mix Cocktails",
      ka: "მიქს კოქტეილები",
    },
    sortOrder: 11,
  },
  {
    id: specialCocktailsCategoryId,
    restaurantId: restaurant.id,
    name: {
      en: "Special Cocktails",
      ka: "სპეშელ კოქტეილები",
    },
    sortOrder: 12,
  },
];

export const categories: Category[] = [
  ...createFoodCategories(restaurant.id),
  ...cocktailCategories,
  ...createBarCategories(restaurant.id),
];

interface CocktailSeed {
  id: string;
  categoryId: string;
  name: {
    en: string;
    ka: string;
  };
  method?: {
    en: "Build" | "Shake" | "Stir";
    ka: string;
  };
  ingredients: {
    en: string[];
    ka: string[];
  };
}

function createCocktail(
  { id, categoryId, name, method, ingredients }: CocktailSeed,
  sortOrder: number,
): MenuItem {
  const descriptionEn = method
    ? [`Method: ${method.en}`, ...ingredients.en].join("\n")
    : ingredients.en.join("\n");
  const descriptionKa = method
    ? [`მეთოდი: ${method.ka}`, ...ingredients.ka].join("\n")
    : ingredients.ka.join("\n");

  return {
    id,
    restaurantId: restaurant.id,
    categoryId,
    name,
    description: {
      en: descriptionEn,
      ka: descriptionKa,
    },
    tags: [],
    available: true,
    sortOrder,
  };
}

const build = { en: "Build" as const, ka: "ჭიქაში მომზადება" };
const shake = { en: "Shake" as const, ka: "შეიქერში შერევა" };
const stir = { en: "Stir" as const, ka: "მორევა" };

const cocktailItems: MenuItem[] = [
  createCocktail(
    {
      id: "gin-tonic",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Gin Tonic", ka: "ჯინ-ტონიკი" },
      method: build,
      ingredients: {
        en: [
          "Tanqueray Dry — 50 ml",
          "Tonic — 1 bottle",
          "Garnish: lime — 15 gr",
        ],
        ka: [
          "Tanqueray Dry — 50 მლ",
          "ტონიკი — 1 ბოთლი",
          "გარნირი: ლაიმი — 15 გ",
        ],
      },
    },
    1,
  ),
  createCocktail(
    {
      id: "long-energy",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Long Energy", ka: "ლონგ ენერჯი" },
      method: build,
      ingredients: {
        en: [
          "Absolut — 15 ml",
          "Havana Club 3 — 15 ml",
          "Olmeca Silver — 15 ml",
          "Cointreau — 15 ml",
          "Tanqueray Dry — 15 ml",
          "Red Bull — 1 bottle",
          "Garnish: lime — 15 gr",
        ],
        ka: [
          "Absolut — 15 მლ",
          "Havana Club 3 — 15 მლ",
          "Olmeca Silver — 15 მლ",
          "Cointreau — 15 მლ",
          "Tanqueray Dry — 15 მლ",
          "Red Bull — 1 ბოთლი",
          "გარნირი: ლაიმი — 15 გ",
        ],
      },
    },
    2,
  ),
  createCocktail(
    {
      id: "margarita",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Margarita", ka: "მარგარიტა" },
      method: shake,
      ingredients: {
        en: [
          "Olmeca Silver — 50 ml",
          "Cointreau — 20 ml",
          "Lime fresh — 25 ml",
          "Sugar syrup — 10 ml",
          "Garnish: dry lime wheel — 15 gr",
        ],
        ka: [
          "Olmeca Silver — 50 მლ",
          "Cointreau — 20 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "შაქრის სიროფი — 10 მლ",
          "გარნირი: გამხმარი ლაიმის რგოლი — 15 გ",
        ],
      },
    },
    3,
  ),
  createCocktail(
    {
      id: "mojito",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Mojito", ka: "მოჰიტო" },
      method: build,
      ingredients: {
        en: [
          "Havana Club 3 — 50 ml",
          "Sugar syrup — 10 ml",
          "Lime slice — 45 gr",
          "Mint — 10 gr",
        ],
        ka: [
          "Havana Club 3 — 50 მლ",
          "შაქრის სიროფი — 10 მლ",
          "ლაიმის ნაჭერი — 45 გ",
          "პიტნა — 10 გ",
        ],
      },
    },
    4,
  ),
  createCocktail(
    {
      id: "corpse-reviver-2",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Corpse Reviver #2", ka: "კორპს რივაივერ #2" },
      method: shake,
      ingredients: {
        en: [
          "Tanqueray Dry — 25 ml",
          "Cointreau — 25 ml",
          "Martini Bianco — 25 ml",
          "Lemon fresh — 25 ml",
          "Absinthe — 0.3 ml",
          "Garnish: lemon zest — 5 gr",
        ],
        ka: [
          "Tanqueray Dry — 25 მლ",
          "Cointreau — 25 მლ",
          "Martini Bianco — 25 მლ",
          "ლიმონის ფრეში — 25 მლ",
          "აბსენტი — 0.3 მლ",
          "გარნირი: ლიმონის ცედრა — 5 გ",
        ],
      },
    },
    5,
  ),
  createCocktail(
    {
      id: "aperol-spritz",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Aperol Spritz", ka: "აპეროლ შპრიცი" },
      method: build,
      ingredients: {
        en: [
          "Aperol — 50 ml",
          "Prosecco Brut — 120 ml",
          "Tonic — 30 ml",
          "Garnish: orange slice — 15 gr",
        ],
        ka: [
          "Aperol — 50 მლ",
          "Prosecco Brut — 120 მლ",
          "ტონიკი — 30 მლ",
          "გარნირი: ფორთოხლის ნაჭერი — 15 გ",
        ],
      },
    },
    6,
  ),
  createCocktail(
    {
      id: "negroni",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Negroni", ka: "ნეგრონი" },
      method: stir,
      ingredients: {
        en: [
          "Tanqueray Dry — 30 ml",
          "Campari — 30 ml",
          "Martini Rosso — 30 ml",
          "Garnish: orange zest — 5 gr",
        ],
        ka: [
          "Tanqueray Dry — 30 მლ",
          "Campari — 30 მლ",
          "Martini Rosso — 30 მლ",
          "გარნირი: ფორთოხლის ცედრა — 5 გ",
        ],
      },
    },
    7,
  ),
  createCocktail(
    {
      id: "manhattan",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Manhattan", ka: "მანჰეტენი" },
      method: stir,
      ingredients: {
        en: [
          "Four Roses — 50 ml",
          "Martini Rosso — 25 ml",
          "Garnish: Amarena cherry — 10 gr",
        ],
        ka: [
          "Four Roses — 50 მლ",
          "Martini Rosso — 25 მლ",
          "გარნირი: Amarena ალუბალი — 10 გ",
        ],
      },
    },
    8,
  ),
  createCocktail(
    {
      id: "old-fashioned",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Old Fashioned", ka: "ოლდ ფეშენდი" },
      method: stir,
      ingredients: {
        en: [
          "Four Roses — 50 ml",
          "Sugar syrup — 10 ml",
          "Soda water — 10 ml",
          "Angostura bitters — 2 dashes",
          "Garnish: orange zest — 5 gr",
        ],
        ka: [
          "Four Roses — 50 მლ",
          "შაქრის სიროფი — 10 მლ",
          "სოდა — 10 მლ",
          "Angostura ბიტერი — 2 დეში",
          "გარნირი: ფორთოხლის ცედრა — 5 გ",
        ],
      },
    },
    9,
  ),
  createCocktail(
    {
      id: "vesper-martini",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Vesper Martini", ka: "ვესპერ მარტინი" },
      method: stir,
      ingredients: {
        en: [
          "Tanqueray Dry — 60 ml",
          "Absolut — 20 ml",
          "Martini Bianco — 15 ml",
          "Garnish: orange zest — 5 gr",
        ],
        ka: [
          "Tanqueray Dry — 60 მლ",
          "Absolut — 20 მლ",
          "Martini Bianco — 15 მლ",
          "გარნირი: ფორთოხლის ცედრა — 5 გ",
        ],
      },
    },
    10,
  ),
  createCocktail(
    {
      id: "cuba-libre",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Cuba Libre", ka: "კუბა ლიბრე" },
      method: build,
      ingredients: {
        en: [
          "Havana Club 3 — 50 ml",
          "Coke — 1 bottle",
          "Lime fresh — 5 ml",
          "Garnish: dry lime",
        ],
        ka: [
          "Havana Club 3 — 50 მლ",
          "კოლა — 1 ბოთლი",
          "ლაიმის ფრეში — 5 მლ",
          "გარნირი: გამხმარი ლაიმი",
        ],
      },
    },
    11,
  ),
  createCocktail(
    {
      id: "gin-breezy",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Gin Breezy", ka: "ჯინ ბრიზი" },
      method: shake,
      ingredients: {
        en: [
          "Tanqueray — 50 ml",
          "Lime fresh — 25 ml",
          "Sugar syrup — 20 ml",
          "Cucumber, muddled — 20 gr",
          "Mint, muddled — 10 gr",
          "Garnish: cucumber",
        ],
        ka: [
          "Tanqueray — 50 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "შაქრის სიროფი — 20 მლ",
          "დაჭყლეტილი კიტრი — 20 გ",
          "დაჭყლეტილი პიტნა — 10 გ",
          "გარნირი: კიტრი",
        ],
      },
    },
    12,
  ),
  createCocktail(
    {
      id: "espresso-martini",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Espresso Martini", ka: "ესპრესო მარტინი" },
      method: shake,
      ingredients: {
        en: [
          "Absolut — 50 ml",
          "Espresso — 30 ml",
          "Kahlúa — 25 ml",
          "Sugar syrup — 10 ml",
          "Garnish: coffee — 3 gr",
        ],
        ka: [
          "Absolut — 50 მლ",
          "ესპრესო — 30 მლ",
          "Kahlúa — 25 მლ",
          "შაქრის სიროფი — 10 მლ",
          "გარნირი: ყავა — 3 გ",
        ],
      },
    },
    13,
  ),
  createCocktail(
    {
      id: "mai-tai",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Mai Tai", ka: "მაი ტაი" },
      method: shake,
      ingredients: {
        en: [
          "Havana Club 3 — 50 ml",
          "Captain Morgan Dark — 25 ml",
          "Cointreau — 15 ml",
          "Amaretto — 10 ml",
          "Pineapple purée — 30 ml",
          "Garnish: dry pineapple — 10 gr",
        ],
        ka: [
          "Havana Club 3 — 50 მლ",
          "Captain Morgan Dark — 25 მლ",
          "Cointreau — 15 მლ",
          "Amaretto — 10 მლ",
          "ანანასის პიურე — 30 მლ",
          "გარნირი: გამხმარი ანანასი — 10 გ",
        ],
      },
    },
    14,
  ),
  createCocktail(
    {
      id: "mule",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Mule", ka: "მიული" },
      method: build,
      ingredients: {
        en: [
          "Absolut — 50 ml",
          "Ginger syrup — 15 ml",
          "Lime fresh — 25 ml",
          "Sugar syrup — 10 ml",
          "Tonic Up — 1 bottle",
          "Garnish: dry lime wheel — 10 gr",
        ],
        ka: [
          "Absolut — 50 მლ",
          "ჯანჯაფილის სიროფი — 15 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "შაქრის სიროფი — 10 მლ",
          "Tonic Up — 1 ბოთლი",
          "გარნირი: გამხმარი ლაიმის რგოლი — 10 გ",
        ],
      },
    },
    15,
  ),
  createCocktail(
    {
      id: "whiskey-sour",
      categoryId: classicCocktailsCategoryId,
      name: { en: "Whiskey Sour", ka: "ვისკი საუერი" },
      method: shake,
      ingredients: {
        en: [
          "Four Roses — 50 ml",
          "Lemon fresh — 25 ml",
          "Sugar syrup — 20 ml",
          "Angostura bitters — 2–3 dashes",
          "Inani foam — 2 ml",
          "Garnish: lemon zest — 5 gr",
        ],
        ka: [
          "Four Roses — 50 მლ",
          "ლიმონის ფრეში — 25 მლ",
          "შაქრის სიროფი — 20 მლ",
          "Angostura ბიტერი — 2–3 დეში",
          "Inani ქაფი — 2 მლ",
          "გარნირი: ლიმონის ცედრა — 5 გ",
        ],
      },
    },
    16,
  ),

  createCocktail(
    {
      id: "vodka-energy",
      categoryId: mixCocktailsCategoryId,
      name: { en: "Vodka Energy", ka: "ვოდკა ენერჯი" },
      ingredients: {
        en: [
          "Absolut — 50 ml",
          "Red Bull — 1 bottle",
          "Garnish: lemon slice — 5 gr",
        ],
        ka: [
          "Absolut — 50 მლ",
          "Red Bull — 1 ბოთლი",
          "გარნირი: ლიმონის ნაჭერი — 5 გ",
        ],
      },
    },
    1,
  ),
  createCocktail(
    {
      id: "jager-energy",
      categoryId: mixCocktailsCategoryId,
      name: { en: "Jager Energy", ka: "იაგერ ენერჯი" },
      ingredients: {
        en: [
          "Jägermeister — 50 ml",
          "Red Bull — 1 bottle",
          "Garnish: orange slice — 10 gr",
        ],
        ka: [
          "Jägermeister — 50 მლ",
          "Red Bull — 1 ბოთლი",
          "გარნირი: ფორთოხლის ნაჭერი — 10 გ",
        ],
      },
    },
    2,
  ),
  createCocktail(
    {
      id: "vodka-juice",
      categoryId: mixCocktailsCategoryId,
      name: { en: "Vodka Juice", ka: "ვოდკა ჯუისი" },
      ingredients: {
        en: ["Absolut — 50 ml", "Juice — 1 bottle"],
        ka: ["Absolut — 50 მლ", "წვენი — 1 ბოთლი"],
      },
    },
    3,
  ),
  createCocktail(
    {
      id: "jager-juice",
      categoryId: mixCocktailsCategoryId,
      name: { en: "Jager Juice", ka: "იაგერ ჯუისი" },
      ingredients: {
        en: ["Jägermeister — 50 ml", "Juice — 1 bottle"],
        ka: ["Jägermeister — 50 მლ", "წვენი — 1 ბოთლი"],
      },
    },
    4,
  ),

  createCocktail(
    {
      id: "lillet",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Lillet *", ka: "ლილე *" },
      method: shake,
      ingredients: {
        en: [
          "Havana Club 3 — 50 ml",
          "Passion fruit — 35 ml",
          "Honey syrup — 20 ml",
          "Lemon fresh — 25 ml",
          "Merlet peach / orgeat syrup — 10 ml",
          "Inani foam — 1 ml",
          "Garnish: dry lime wheel — 5 gr",
        ],
        ka: [
          "Havana Club 3 — 50 მლ",
          "პასიონ ფრუტი — 35 მლ",
          "თაფლის სიროფი — 20 მლ",
          "ლიმონის ფრეში — 25 მლ",
          "Merlet peach / orgeat სიროფი — 10 მლ",
          "Inani ქაფი — 1 მლ",
          "გარნირი: გამხმარი ლაიმის რგოლი — 5 გ",
        ],
      },
    },
    1,
  ),
  createCocktail(
    {
      id: "one-piece",
      categoryId: specialCocktailsCategoryId,
      name: { en: "One Piece *", ka: "უან ფისი *" },
      method: shake,
      ingredients: {
        en: [
          "Havana Club 3 — 25 ml",
          "Beach House Pink — 25 ml",
          "Amaretto syrup — 15 ml",
          "Pineapple purée — 40 ml",
          "Lemon fresh — 25 ml",
          "Garnish: dry pineapple — 10 gr",
        ],
        ka: [
          "Havana Club 3 — 25 მლ",
          "Beach House Pink — 25 მლ",
          "Amaretto სიროფი — 15 მლ",
          "ანანასის პიურე — 40 მლ",
          "ლიმონის ფრეში — 25 მლ",
          "გარნირი: გამხმარი ანანასი — 10 გ",
        ],
      },
    },
    2,
  ),
  createCocktail(
    {
      id: "chido",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Chido *", ka: "ჩიდო *" },
      method: shake,
      ingredients: {
        en: [
          "Olmeca Silver — 50 ml",
          "Koch El — 5 ml",
          "Honey syrup — 20 ml",
          "Lime fresh — 25 ml",
          "Passion fruit — 40 ml",
          "Tabasco — 2 dashes",
          "Garnish: spice rim",
        ],
        ka: [
          "Olmeca Silver — 50 მლ",
          "Koch El — 5 მლ",
          "თაფლის სიროფი — 20 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "პასიონ ფრუტი — 40 მლ",
          "Tabasco — 2 დეში",
          "გარნირი: სანელებლების რგოლი",
        ],
      },
    },
    3,
  ),
  createCocktail(
    {
      id: "miora-vibe",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Miora Vibe", ka: "მიორა ვაიბი" },
      method: shake,
      ingredients: {
        en: [
          "Tanqueray — 50 ml",
          "Raspberry / grenadine syrup — 20 ml",
          "Lemon fresh — 25 ml",
          "Inani foam — 1 ml",
          "Garnish: rose flower",
        ],
        ka: [
          "Tanqueray — 50 მლ",
          "ჟოლოს / გრენადინის სიროფი — 20 მლ",
          "ლიმონის ფრეში — 25 მლ",
          "Inani ქაფი — 1 მლ",
          "გარნირი: ვარდის ყვავილი",
        ],
      },
    },
    4,
  ),
  createCocktail(
    {
      id: "siesta",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Siesta", ka: "სიესტა" },
      method: shake,
      ingredients: {
        en: [
          "Tanqueray — 30 ml",
          "Martini Bianco — 20 ml",
          "Cointreau — 15 ml",
          "Berry purée — 10 ml",
          "Lime fresh — 25 ml",
          "Honey syrup — 5 ml",
          "Absinthe — 2 ml",
          "Garnish: dry lime wheel",
        ],
        ka: [
          "Tanqueray — 30 მლ",
          "Martini Bianco — 20 მლ",
          "Cointreau — 15 მლ",
          "კენკრის პიურე — 10 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "თაფლის სიროფი — 5 მლ",
          "აბსენტი — 2 მლ",
          "გარნირი: გამხმარი ლაიმის რგოლი",
        ],
      },
    },
    5,
  ),
  createCocktail(
    {
      id: "same-breezy",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Same Breezy", ka: "სეიმ ბრიზი" },
      method: shake,
      ingredients: {
        en: [
          "Tanqueray — 50 ml",
          "Lime fresh — 25 ml",
          "Sugar syrup — 20 ml",
          "Tarragon, muddled — 5 gr",
          "Kiwi, muddled — 120 gr",
          "Garnish: tarragon — 1 gr",
        ],
        ka: [
          "Tanqueray — 50 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "შაქრის სიროფი — 20 მლ",
          "დაჭყლეტილი ტარხუნა — 5 გ",
          "დაჭყლეტილი კივი — 120 გ",
          "გარნირი: ტარხუნა — 1 გ",
        ],
      },
    },
    6,
  ),
  createCocktail(
    {
      id: "pine-house",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Pine House", ka: "ფაინ ჰაუსი" },
      method: shake,
      ingredients: {
        en: [
          "Havana Club 3 — 50 ml",
          "Lime fresh — 25 ml",
          "Pineapple purée — 40 ml",
          "Ginger syrup — 25 ml",
          "Peychaud's bitters — 2 dashes",
        ],
        ka: [
          "Havana Club 3 — 50 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "ანანასის პიურე — 40 მლ",
          "ჯანჯაფილის სიროფი — 25 მლ",
          "Peychaud's ბიტერი — 2 დეში",
        ],
      },
    },
    7,
  ),
  createCocktail(
    {
      id: "hound-dog",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Hound Dog *", ka: "ჰაუნდ დოგი *" },
      method: shake,
      ingredients: {
        en: [
          "Bulleit Kentucky — 50 ml",
          "Ginger syrup — 25 ml",
          "Lemon fresh — 30 ml",
          "Merlet Peach — 20 ml",
        ],
        ka: [
          "Bulleit Kentucky — 50 მლ",
          "ჯანჯაფილის სიროფი — 25 მლ",
          "ლიმონის ფრეში — 30 მლ",
          "Merlet Peach — 20 მლ",
        ],
      },
    },
    8,
  ),
  createCocktail(
    {
      id: "momo",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Momo *", ka: "მომო *" },
      method: shake,
      ingredients: {
        en: [
          "Vodka — 40 ml",
          "Aperol — 25 ml",
          "Lime fresh — 25 ml",
          "Peach syrup — 20 ml",
          "Passion fruit — 10 ml",
          "Sugar syrup — 5 ml",
          "Orange bitters — 2 dashes",
          "Inani foam — 1 ml",
          "Garnish: dry orange — 10 gr",
        ],
        ka: [
          "ვოდკა — 40 მლ",
          "Aperol — 25 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "ატმის სიროფი — 20 მლ",
          "პასიონ ფრუტი — 10 მლ",
          "შაქრის სიროფი — 5 მლ",
          "ფორთოხლის ბიტერი — 2 დეში",
          "Inani ქაფი — 1 მლ",
          "გარნირი: გამხმარი ფორთოხალი — 10 გ",
        ],
      },
    },
    9,
  ),
  createCocktail(
    {
      id: "geysha",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Geysha *", ka: "გეიშა *" },
      method: shake,
      ingredients: {
        en: [
          "Tanqueray — 50 ml",
          "Cointreau — 10 ml",
          "Martini Bianco — 10 ml",
          "Strawberry purée / syrup — 10 ml",
          "Honey syrup — 10 ml",
          "Lemon fresh — 25 ml",
          "Inani foam — 1 ml",
          "Garnish: strawberry half — 10 gr",
        ],
        ka: [
          "Tanqueray — 50 მლ",
          "Cointreau — 10 მლ",
          "Martini Bianco — 10 მლ",
          "მარწყვის პიურე / სიროფი — 10 მლ",
          "თაფლის სიროფი — 10 მლ",
          "ლიმონის ფრეში — 25 მლ",
          "Inani ქაფი — 1 მლ",
          "გარნირი: მარწყვის ნახევარი — 10 გ",
        ],
      },
    },
    10,
  ),
  createCocktail(
    {
      id: "basil-smash",
      categoryId: specialCocktailsCategoryId,
      name: { en: "Basil Smash", ka: "ბაზილ სმაში" },
      method: shake,
      ingredients: {
        en: [
          "Tanqueray — 50 ml",
          "Lime fresh — 25 ml",
          "Sugar syrup — 20 ml",
          "Basil, muddled — 12 gr",
          "Garnish: basil — 5 gr",
        ],
        ka: [
          "Tanqueray — 50 მლ",
          "ლაიმის ფრეში — 25 მლ",
          "შაქრის სიროფი — 20 მლ",
          "დაჭყლეტილი ბაზილიკო — 12 გ",
          "გარნირი: ბაზილიკო — 5 გ",
        ],
      },
    },
    11,
  ),
];

export const menuItems: MenuItem[] = [
  ...cocktailItems,
  ...createBarItems(restaurant.id),
  ...createFoodItems(restaurant.id),
];
