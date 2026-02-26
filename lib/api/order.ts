import api from "./axios";
import { API } from "./endpoint";

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  pizzaId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: {
    pizzaId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: "COD";
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await api.post(API.ORDERS.CREATE, payload);
  return res.data.data as Order;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await api.get(API.ORDERS.MY);
  return res.data.data as Order[];
}

export async function getAllOrders(): Promise<Order[]> {
  const res = await api.get(API.ORDERS.ADMIN_ALL);
  return res.data.data as Order[];
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
) {
  const res = await api.patch(
    API.ORDERS.ADMIN_UPDATE_STATUS(id),
    { status }
  );
  return res.data.data as Order;
}

export async function cancelMyOrder(id: string): Promise<Order> {
  const res = await api.patch(API.ORDERS.CANCEL(id));
  return res.data.data as Order;
}