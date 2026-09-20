import { apiFetch } from "./client.jsx";

export function fetchMessages(token, chatId) {
  return apiFetch(`/message/${chatId}`, {
    token,
  });
}

export function sendMessage(token, chatId, content) {
  return apiFetch(`/message/${chatId}`, {
    method: "POST",
    token,
    body: JSON.stringify({
      content,
    }),
  });
}