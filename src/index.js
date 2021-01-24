import renderChat from "./chat/chat.js";
import { createChatBotMessage, createClientMessage } from "./utils.js";
import stateManager from "./state/state.js";

let current;

const renderChatbot = (rootEl, config, messageParser, actionProvider) => {
  const intialState = { messages: [...config.initialMessages] };
  const [state, updater, registerListeners] = stateManager(intialState);

  const actionProviderInstance = new actionProvider(
    createChatBotMessage,
    updater,
    createClientMessage
  );
  const messageParserInstance = new messageParser(actionProviderInstance);

  registerListeners((newState) =>
    render(rootEl, newState, messageParserInstance, config, updater)
  );

  render(rootEl, state, messageParserInstance, config, updater);
};

const render = (rootEl, state, messageParserInstance, config, updater) => {
  if (current) {
    rootEl.removeChild(current);
  }

  const chat = renderChat(config, state, messageParserInstance, updater);
  current = chat;
  rootEl.appendChild(chat);
};

window.vanillaJsChatbot = { renderChatbot, createChatBotMessage };
