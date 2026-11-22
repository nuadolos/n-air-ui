import axios from "axios";
let sessionToken = "";
export const client = axios.create({
  baseURL: "https://api.sondahub.com/v1/flights",
  timeout: 15000,
});
// Перехватчики передают токен сессии в запросах и обновляют его после записи на сервер
client.interceptors.request.use((config) => {
  if (sessionToken) config.headers.set("X-Sondahub-Session", sessionToken);
  return config;
});
client.interceptors.response.use((response) => {
  const token = response.headers["x-sondahub-session"];
  if (typeof token === "string" && token && response.config.method !== "get") {
    sessionToken = token;
  }
  return response;
});
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409)
      return "Рейс недоступен для бронирования или свободные места закончились.";
    if (error.response?.status === 429)
      return "Слишком много запросов. Попробуйте позже.";
    if (!error.response)
      return "Не удалось связаться с сервером. Проверьте подключение и повторите запрос.";
    return "Сервер не смог выполнить запрос. Попробуйте ещё раз.";
  }
  return error instanceof Error ? error.message : "Не удалось выполнить запрос";
}
