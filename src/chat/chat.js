const renderChat = (config, state) => {
  const chatContainer = document.createElement("div");
  chatContainer.classList.add("vanilla-chatbot-kit-chat-container");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("vanilla-chatbot-kit-chat-inner-container");

  innerContainer.appendChild(createHeader(config));
  innerContainer.appendChild(createMessageContainer(state.messages));
  innerContainer.appendChild(createForm());

  chatContainer.appendChild(innerContainer);
  return chatContainer;
};

const createHeader = (config) => {
  const header = document.createElement("div");
  header.textContent = `Conversation with ${config.botName}`;
  header.classList.add("vanilla-chatbot-kit-chat-header");

  return header;
};

const createMessageContainer = (messages) => {
  const container = document.createElement("div");
  container.classList.add("vanilla-chatbot-kit-chat-message-container");

  messages.forEach((mes) => {
    const { message, type } = mes;

    if (type === "bot") {
      const botMessage = createBotChatMessage(message);
      container.appendChild(botMessage);
    } else {
      const userMessage = createUserChatMessage(message);
      container.appendChild(userMessage);
    }
  });

  return container;
};

const createForm = () => {
  const container = document.createElement("div");
  container.classList.add("vanilla-chatbot-kit-chat-input-container");

  const form = document.createElement("form");
  form.classList.add("vanilla-chatbot-kit-chat-input-form");

  const input = document.createElement("input");
  input.classList.add("vanilla-chatbot-kit-chat-input");
  input.placeholder = "Write your message here";

  const btn = document.createElement("button");
  btn.classList.add("vanilla-chatbot-kit-chat-btn-send");

  const img = document.createElement("img");
  img.src = "/assets/icons/paper-plane.svg";
  img.alt = "paper plane";
  img.classList.add("vanilla-chatbot-kit-chat-btn-send-icon");

  btn.appendChild(img);
  form.appendChild(input);
  form.appendChild(btn);
  container.appendChild(form);

  return container;
};

const createUserChatMessage = (message) => {
  const container = document.createElement("div");
  container.classList.add(
    "vanilla-chatbot-kit-user-chat-message-container"
  );

  const avatarContainer = document.createElement("div");
  avatarContainer.classList.add(
    "vanilla-chatbot-kit-user-avatar-container"
  );

  const img = document.createElement("img");
  img.classList.add("vanilla-chatbot-kit-user-avatar-icon");
  img.src = "/assets/icons/user-alt.svg";
  img.alt = "user";

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("vanilla-chatbot-kit-user-chat-message");
  messageContainer.textContent = message;

  const arrow = document.createElement("div");
  arrow.classList.add("vanilla-chatbot-kit-user-chat-message-arrow");

  messageContainer.appendChild(arrow);
  avatarContainer.appendChild(img);

  container.appendChild(messageContainer);
  container.appendChild(avatarContainer);

  return container;
};

const createBotChatMessage = (message) => {
  const container = document.createElement("div");
  container.classList.add(
    "vanilla-chatbot-kit-chat-bot-message-container"
  );

  const avatarContainer = document.createElement("div");
  avatarContainer.classList.add(
    "vanilla-chatbot-kit-chat-bot-avatar-container"
  );

  const paragraph = document.createElement("p");
  paragraph.textContent = "B";
  paragraph.classList.add("vanilla-chatbot-kit-chat-bot-avatar-letter");

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("vanilla-chatbot-kit-chat-bot-message");
  messageContainer.textContent = message;

  const arrow = document.createElement("div");
  arrow.classList.add("vanilla-chatbot-kit-chat-bot-message-arrow");

  messageContainer.appendChild(arrow);
  avatarContainer.appendChild(paragraph);

  container.appendChild(avatarContainer);
  container.appendChild(messageContainer);

  return container;
};

export default renderChat;
