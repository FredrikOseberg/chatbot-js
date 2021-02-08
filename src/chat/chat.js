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

  const imgContainer = document.createElement("div");
  imgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fff" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"/></svg>`;
  imgContainer.classList.add("vanilla-chatbot-kit-chat-btn-send-icon");

  btn.appendChild(imgContainer);
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

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("vanilla-chatbot-kit-user-avatar-icon");
  imgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fff" d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z"/></svg>`;

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("vanilla-chatbot-kit-user-chat-message");
  messageContainer.textContent = message;

  const arrow = document.createElement("div");
  arrow.classList.add("vanilla-chatbot-kit-user-chat-message-arrow");

  messageContainer.appendChild(arrow);
  avatarContainer.appendChild(imgContainer);

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
