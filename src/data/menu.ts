import paneerTikka from "@/assets/food/paneer-tikka.jpg";
import chickenWings from "@/assets/food/chicken-wings.jpg";
import butterChicken from "@/assets/food/butter-chicken.jpg";
import paneerButterMasala from "@/assets/food/paneer-butter-masala.jpg";
import dalMakhani from "@/assets/food/dal-makhani.jpg";
import garlicNaan from "@/assets/food/garlic-naan.jpg";
import biryani from "@/assets/food/biryani.jpg";
import gulabJamun from "@/assets/food/gulab-jamun.jpg";
import mangoLassi from "@/assets/food/mango-lassi.jpg";

export type Category = "starters" | "mains" | "breads-rice" | "desserts-drinks";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in ₹
  image: string;
  category: Category;
  veg: boolean;
  spicy?: boolean;
  signature?: boolean;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Mains" },
  { id: "breads-rice", label: "Breads & Rice" },
  { id: "desserts-drinks", label: "Desserts & Drinks" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    description: "Char-grilled cottage cheese skewers, mint chutney, lime",
    price: 249,
    image: paneerTikka,
    category: "starters",
    veg: true,
    spicy: true,
  },
  {
    id: "peri-chicken-wings",
    name: "Peri-Peri Chicken Wings",
    description: "Crispy fried wings tossed in fiery peri-peri glaze",
    price: 279,
    image: chickenWings,
    category: "starters",
    veg: false,
    spicy: true,
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    description: "Tandoori chicken in silky tomato gravy, cream & kasuri methi",
    price: 389,
    image: butterChicken,
    category: "mains",
    veg: false,
    signature: true,
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in rich cashew-tomato cream",
    price: 329,
    image: paneerButterMasala,
    category: "mains",
    veg: true,
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    description: "Black lentils slow-cooked overnight with butter & cream",
    price: 249,
    image: dalMakhani,
    category: "mains",
    veg: true,
    signature: true,
  },
  {
    id: "garlic-naan",
    name: "Butter Garlic Naan",
    description: "Tandoor-fresh naan, garlic butter, coriander",
    price: 59,
    image: garlicNaan,
    category: "breads-rice",
    veg: true,
  },
  {
    id: "chicken-biryani",
    name: "Hyderabadi Chicken Biryani",
    description: "Saffron basmati dum-cooked with marinated chicken, raita",
    price: 349,
    image: biryani,
    category: "breads-rice",
    veg: false,
    spicy: true,
    signature: true,
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Warm syrup-soaked dumplings, pistachio & rose",
    price: 129,
    image: gulabJamun,
    category: "desserts-drinks",
    veg: true,
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    description: "Thick sweet yogurt shake with Alphonso mango & saffron",
    price: 119,
    image: mangoLassi,
    category: "desserts-drinks",
    veg: true,
  },
];

export const GST_RATE = 0.05;

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
