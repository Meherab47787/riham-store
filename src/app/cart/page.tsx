import { Metadata } from "next";
import CartClient from "@/components/cart/CartClient";

export const metadata: Metadata = { title: "Your Bag" };

export default function CartPage() {
  return <CartClient />;
}
