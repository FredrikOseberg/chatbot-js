import renderChat from "./chat/chat.js";
import { createChatBotMessage } from "./utils.js";
import stateManager from "./state/state.js";

const rootEl = document.querySelector(".vanilla-chatbot");
let current;

const renderChatbot = (rootEl, config, messageParser, actionProvider) => {
  const intialState = { messages: [...config.initialMessages] };
  const [state, updater, registerListeners] = stateManager(intialState);

  render(rootEl, state);

  registerListeners((newState) => render(rootEl, newState));

  updater((state) => {
    return {
      ...state,
      messages: [...state.messages, createChatBotMessage(`State updated`)],
    };
  });
  updater((state) => {
    return {
      ...state,
      messages: [...state.messages, { message: "hello", type: "user" }],
    };
  });
};

const render = (rootEl, state) => {
  if (current) {
    rootEl.removeChild(current);
  }

  const chat = renderChat(config, state);
  current = chat;
  rootEl.appendChild(chat);
};

const config = {
  botName: "Vanillabot",
  initialMessages: [createChatBotMessage(`Hello world`)],
};

renderChatbot(rootEl, config);
