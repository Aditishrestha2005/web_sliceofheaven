import api from "./axios";
import { API } from "./endpoint";

export type PizzaCategory = "All" | "Veg" | "Non-Veg";

export interface Pizza {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string; // "/uploads/pizzas/..."
  category: PizzaCategory;
  createdAt: string;
  updatedAt: string;
}

export async function getAllPizzas(): Promise<Pizza[]> {
  const res = await api.get(API.ADMIN.PIZZA.GET_ALL);
  return res.data.data as Pizza[];
}

export async function deletePizza(id: string) {
  const res = await api.delete(API.ADMIN.PIZZA.DELETE(id));
  return res.data;
}

// For later (Add Pizza page). Uses multipart/form-data.
export async function createPizza(formData: FormData) {
  const res = await api.post(API.ADMIN.PIZZA.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export function pizzaImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}
