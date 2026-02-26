export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
    REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
  },

  ADMIN: {
    // ✅ New recommended base
    USERS: "/api/admin/users",

    
    USER: {
      CREATE: "/api/admin/users",
    },
  PIZZA: {
  GET_ALL: "/api/pizzas",
  CREATE: "/api/pizzas",
  DELETE: (id: string) => `/api/pizzas/${id}`,
},
},

ORDERS: {
  CREATE: "/api/orders",
  MY: "/api/orders/my",
  CANCEL: (id: string) => `/api/orders/${id}/cancel`, // ✅ add
  ADMIN_ALL: "/api/admin/orders",
  ADMIN_UPDATE_STATUS: (id: string) => `/api/admin/orders/${id}/status`,
},
};
