export const env = {
  SERVER: process.env.EXPO_PUBLIC_SERVER || "http://10.0.2.2:3000",
  API: (process.env.EXPO_PUBLIC_SERVER || "http://10.0.2.2:3000").replace(/\/$/, "") + "/api",
  TOKEN_KEY: process.env.EXPO_PUBLIC_TOKEN_KEY || "jwt",
};