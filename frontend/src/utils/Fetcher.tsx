export async function apiFetch(url: string, options: RequestInit = {}) {
  const doRequest = () =>
    fetch(url, {
      ...options,
      credentials: "include",
    });

  let response = await doRequest();

  if (response.status === 401) {
    const refresh = await fetch(
      "http://127.0.0.1:8000/api/auth/refresh/",
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