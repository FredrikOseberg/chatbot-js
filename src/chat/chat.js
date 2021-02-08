import { createClientMessage } from "../utils.js";

const DEFAULT_MESSAGE_LOADING_TIME = 750;

const renderChat = (
  config,
  state,
  messageParserInstance,
  updater,
  widgetRegistry
) => {
  const chatContainer = document.createElement("div");
  chatContainer.classList.add("vanilla-chatbot-kit-chat-container");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("vanilla-chatbot-kit-chat-inner-container");

  innerContainer.appendChild(createHeader(config));
  innerContainer.appendChild(
    createMessageContainer(state.messages, widgetRegistry, state, updater)
  );
  innerContainer.appendChild(createForm(messageParserInstance, updater));

  chatContainer.appendChild(innerContainer);
  return chatContainer;
};

const createHeader = (config) => {
  const header = document.createElement("div");
  header.textContent = `Conversation with ${config.botName}`;
  header.classList.add("vanilla-chatbot-kit-chat-header");

  return header;
};

const createMessageContainer = (
  messages,
  widgetRegistry,
  state,
  updater
) => {
  const container = document.createElement("div");
  container.classList.add("vanilla-chatbot-kit-chat-message-container");

  messages.forEach((mes) => {
    const { message, type } = mes;

    if (type === "bot") {
      const botMessage = createBotChatMessage(
        mes,
        widgetRegistry,
        state,
        updater
      );
      container.appendChild(botMessage);
    } else {
      const userMessage = createUserChatMessage(message);
      container.appendChild(userMessage);
    }
  });

  return container;
};

const createForm = (messageParserInstance, updater) => {
  const container = document.createElement("div");
  container.classList.add("vanilla-chatbot-kit-chat-input-container");

  const form = document.createElement("form");
  form.classList.add("vanilla-chatbot-kit-chat-input-form");

  const input = document.createElement("input");
  input.classList.add("vanilla-chatbot-kit-chat-input");
  input.placeholder = "Write your message here";

  const btn = document.createElement("button");
  btn.classList.add("vanilla-chatbot-kit-chat-btn-send");

  const handleSubmit = (e) => {
    e.preventDefault();
    const { value } = input;
    const message = createClientMessage(value);
    updater((state) => {
      return { ...state, messages: [...state.messages, message] };
    });
    messageParserInstance.parse(value);
    input.value = "";
  };

  form.onsubmit = handleSubmit;

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

export const createBotChatMessage = (
  mes,
  widgetRegistry,
  state,
  updater
) => {
  const { message, widget, loading, id } = mes;
  console.log(mes);

  const outerContainer = document.createElement("div");

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

  if (loading) {
    const loader = createLoader();
    messageContainer.appendChild(loader);

    setTimeout(() => {
      updater((state) => {
        const newMessage = state.messages.find((mes) => mes.id === id);
        newMessage.loading = false;

        return state;
      });
    }, DEFAULT_MESSAGE_LOADING_TIME);
  } else {
    messageContainer.textContent = message;
  }

  const arrow = document.createElement("div");
  arrow.classList.add("vanilla-chatbot-kit-chat-bot-message-arrow");

  messageContainer.appendChild(arrow);
  avatarContainer.appendChild(paragraph);

  container.appendChild(avatarContainer);
  container.appendChild(messageContainer);

  outerContainer.appendChild(container);

  const widgetContainer = document.createElement("div");

  if (widget) {
    const widgetMarkup = widgetRegistry.getWidget(widget, state);
    widgetContainer.appendChild(widgetMarkup);
  }

  outerContainer.appendChild(widgetContainer);

  return outerContainer;
};

const createLoader = () => {
  const container = document.createElement("div");
  container.classList.add("chatbot-loader-container");
  container.innerHTML = `<svg
        id="dots"
        width="50px"
        height="21px"
        viewBox="0 0 132 58"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" fill="none">
          <g id="chatbot-loader" fill="#fff">
            <circle id="chatbot-loader-dot1" cx="25" cy="30" r="13"></circle>
            <circle id="chatbot-loader-dot2" cx="65" cy="30" r="13"></circle>
            <circle id="chatbot-loader-dot3" cx="105" cy="30" r="13"></circle>
          </g>
        </g>
      </svg>`;

  return container;
};

export default renderChat;
