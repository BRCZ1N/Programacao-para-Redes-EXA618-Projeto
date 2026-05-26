export async function apiFetch(url: string, options: RequestInit = {}) {
  const doRequest = () =>
    fetch(url, {
      ...options,
      credentials: "include",
    });

  let response = await doRequest();

  if (response.status === 401) {
    const refresh = await fetch(
      "https://programacao-para-redes-exa618-projeto.onrender.com/api/auth/refresh/",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (refresh.ok) {
      response = await doRequest();
    }
  }

  return response;
}