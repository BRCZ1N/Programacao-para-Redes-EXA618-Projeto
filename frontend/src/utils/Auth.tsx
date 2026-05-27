import { apiFetch } from "./Fetcher";

export const verifyAuth = async () => {
  try {
    const res = await apiFetch(
      "https://programacao-para-redes-exa618-projeto.onrender.com/api/user/me/",
    );

    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
