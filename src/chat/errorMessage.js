import { createBotChatMessage } from "./chat.js";

export const createErrorMessage = (message) => {
  const container = document.createElement("div");
  container.classList.add("vanilla-chatbot-kit-error");

  const header = document.createElement("h1");
  header.textContent = "Ooops. Something is missing.";

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("vanilla-chatbot-kit-error-container");

  const messageObject = {
    message,
    loading: false,
    id: 1,
  };

  const botMessage = createBotChatMessage(messageObject);

  innerContainer.appendChild(botMessage);

  const link = document.createElement("a");
  link.href = "https://fredrikoseberg.github.io/react-chatbot-kit-docs/";
  link.rel = "noopener norefferer";
  link.target = "_blank";
  link.classList.add("vanilla-chatbot-kit-error-docs");
  link.textContent = "View the docs";

  container.appendChild(header);
  container.appendChild(innerContainer);
  container.appendChild(link);

  return container;
};
