import { apiFetch } from "./client.jsx";

export function fetchChats(token) {
  return apiFetch("/chat/getrecentChat", {
    token,
  });
}

export function createChat(token, model) {
  return apiFetch("/chat/createChat", {
    method: "POST",
    token,
    body: JSON.stringify({
      model: model,
    }),
  });
}

export function fetchChat(token, chatId) {
  return apiFetch(`/chat/${chatId}`, {
    token,
  });
}

export async function deleteChat(token, chatId) {
  return apiFetch(`/chat/${chatId}`, {
    method: "DELETE",
    token,
  });
}