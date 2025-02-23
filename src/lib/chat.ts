export function addChatMessage(message: string, sender: "bot" | "user") {
  const chatEvent = new CustomEvent("chat-message", { detail: { message, sender } });
  window.dispatchEvent(chatEvent);
}