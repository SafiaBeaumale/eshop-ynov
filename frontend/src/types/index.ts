// Product types (Catalog API)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageFile: string;
  categories: string[];
}

export interface ProductsResponse {
  products: Product[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

// Shopping Cart types (Basket API)
export interface ShoppingCartItem {
  quantity: number;
  color: string;
  productName: string;
  price: number;
  productId: string;
  imageFile: string;
}

export interface ShoppingCart {
  userName: string;
  items: ShoppingCartItem[];
  total: number;
  totalAfterDiscount?: number;
}

// Order types (Ordering API)
export interface Address {
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
}

export interface Payment {
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  Pending = 1,
  Submitted = 2,
  Confirmed = 3,
  Shipped = 4,
  Completed = 5,
  Cancelled = 6,
}

export interface Order {
  id: string;
  customerId: string;
  orderName: string;
  shippingAddress: Address;
  billingAddress: Address;
  payment: Payment;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  totalPrice?: number;
}

export interface OrdersResponse {
  orders: Order[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

// Discount types (Discount API)
export interface Discount {
  id: number;
  productName: string;
  description: string;
  amount: number;
  type: number; // 0 = percentage, 1 = fixed amount
  isGlobal: boolean;
}

// Checkout DTO
export interface CheckoutDto {
  userName: string;
  customerId: string;
  totalPrice: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: number;
}
