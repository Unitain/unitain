export function addChatMessage(message: string, sender: "bot" | "user") {
  const chatEvent = new CustomEvent("chat-message", { 
    detail: { 
      message, 
      sender,
      timestamp: new Date()
    } 
  });
  window.dispatchEvent(chatEvent);
}