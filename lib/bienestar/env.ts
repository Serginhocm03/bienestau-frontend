const PROD_URL = "https://bienestau-backend-90lq.onrender.com";

export const env = {
  SERVER: process.env.EXPO_PUBLIC_SERVER || PROD_URL,
  API: (process.env.EXPO_PUBLIC_SERVER || PROD_URL).replace(/\/$/, "") + "/api",
  TOKEN_KEY: process.env.EXPO_PUBLIC_TOKEN_KEY || "jwt",
};