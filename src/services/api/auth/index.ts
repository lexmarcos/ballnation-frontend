import { post } from "@/services/methods";

export const auth = {
  login: async (username: string, password: string) => {
    console.log(username, password);
    const res = await post("http://localhost:9000/auth/login", { username, password });
    return res;
  },

  signup: async (email: string, username: string, password: string) => {
    console.log(email, username, password);
    const res = await post("http://localhost:9000/auth/signup", { email, username, password });
    return res;
  },
};
