import { apiFetch } from "./Fetcher";

export const verifyAuth = async () => {
  try {
    const res = await apiFetch(
      "https://programacao-para-redes-exa618-projeto.onrender.com/api/user/me/",
    );

    if (res.ok) {
  
      return res;
      
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};
