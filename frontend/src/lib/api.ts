import type {
  CheckoutDto,
  Order,
  Product,
  ShoppingCart,
  ShoppingCartItem,
} from "@/types";

// API Configuration
const API_CONFIG = {
  catalog: process.env.NEXT_PUBLIC_CATALOG_API_URL || "http://localhost:6060",
  basket: process.env.NEXT_PUBLIC_BASKET_API_URL || "http://localhost:6061",
  ordering: process.env.NEXT_PUBLIC_ORDERING_API_URL || "http://localhost:6063",
};

// Helper function for API calls
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

// ============ CATALOG API ============

export const catalogApi = {
  // Get all products with pagination
  async getProducts(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<Product[]> {
    return fetchApi<Product[]>(
      `${API_CONFIG.catalog}/products?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    return fetchApi<Product>(`${API_CONFIG.catalog}/products/${id}`);
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    return fetchApi<Product[]>(
      `${API_CONFIG.catalog}/products/category/${encodeURIComponent(category)}`,
    );
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await fetch(`${API_CONFIG.catalog}/health`);
      return true;
    } catch {
      return false;
    }
  },
};

// ============ BASKET API ============

export const basketApi = {
  // Get basket by username
  async getBasket(userName: string): Promise<ShoppingCart> {
    return fetchApi<ShoppingCart>(
      `${API_CONFIG.basket}/baskets/${encodeURIComponent(userName)}`,
    );
  },

  // Create basket
  async createBasket(
    userName: string,
    items: ShoppingCartItem[] = [],
  ): Promise<ShoppingCart> {
    return fetchApi<ShoppingCart>(
      `${API_CONFIG.basket}/baskets/${encodeURIComponent(userName)}`,
      {
        method: "POST",
        body: JSON.stringify({ cart: { userName, items } }),
      },
    );
  },

  // Add item to basket
  async addItem(
    userName: string,
    item: Omit<ShoppingCartItem, "productName"> & { productName?: string },
  ): Promise<ShoppingCart> {
    return fetchApi<ShoppingCart>(
      `${API_CONFIG.basket}/baskets/${encodeURIComponent(userName)}/items`,
      {
        method: "POST",
        body: JSON.stringify({
          userName: userName,
          item: item,
        }),
      },
    );
  },

  // Update item quantity
  async updateItemQuantity(
    userName: string,
    productId: string,
    quantity: number,
  ): Promise<ShoppingCart> {
    return fetchApi<ShoppingCart>(
      `${API_CONFIG.basket}/baskets/${encodeURIComponent(userName)}/items`,
      {
        method: "PUT",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      },
    );
  },

  // Remove item from basket
  async removeItem(userName: string, productId: string): Promise<void> {
    await fetchApi<void>(
      `${API_CONFIG.basket}/baskets/${encodeURIComponent(userName)}/items/${productId}`,
      { method: "DELETE" },
    );
  },

  // Delete entire basket
  async deleteBasket(userName: string): Promise<void> {
    await fetchApi<void>(
      `${API_CONFIG.basket}/baskets/${encodeURIComponent(userName)}`,
      { method: "DELETE" },
    );
  },

  // Checkout
  async checkout(checkoutDto: CheckoutDto): Promise<void> {
    await fetchApi<void>(
      `${API_CONFIG.basket}/baskets/${encodeURIComponent(checkoutDto.userName)}/checkout`,
      {
        method: "POST",
        body: JSON.stringify({ basketCheckoutDto: checkoutDto }),
      },
    );
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await fetch(`${API_CONFIG.basket}/health`);
      return true;
    } catch {
      return false;
    }
  },
};

// ============ ORDERING API ============

export const orderingApi = {
  // Get all orders with pagination
  async getOrders(
    pageIndex: number = 1,
    pageSize: number = 10,
  ): Promise<Order[]> {
    return fetchApi<Order[]>(
      `${API_CONFIG.ordering}/orders?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    return fetchApi<Order>(`${API_CONFIG.ordering}/orders/${orderId}`);
  },

  // Get orders by customer ID
  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return fetchApi<Order[]>(
      `${API_CONFIG.ordering}/orders/customer/${customerId}`,
    );
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: number): Promise<void> {
    await fetchApi<void>(`${API_CONFIG.ordering}/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await fetch(`${API_CONFIG.ordering}/health`);
      return true;
    } catch {
      return false;
    }
  },
};
