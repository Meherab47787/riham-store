export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = "riham-cart";

function dispatch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToCart(item: Omit<CartItem, "quantity">): void {
  const cart = getCartItems();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatch();
}

export function removeFromCart(productId: string): void {
  const cart = getCartItems().filter((i) => i.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatch();
}

export function updateCartQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = getCartItems().map((i) =>
    i.productId === productId ? { ...i, quantity } : i
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatch();
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  dispatch();
}

export function getCartCount(): number {
  return getCartItems().reduce((sum, i) => sum + i.quantity, 0);
}
