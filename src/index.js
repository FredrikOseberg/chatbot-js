import renderChat from "./chat/chat.js";
import {
  createChatBotMessage,
  createClientMessage,
  getWidgets,
  scrollIntoView,
  validateProps,
} from "./utils.js";
import { createErrorMessage } from "./chat/errorMessage.js";
import stateManager from "./state/state.js";
import WidgetRegistry from "./widgetRegistry/widgetRegistry.js";

let current;

const renderChatbot = (rootEl, config, messageParser, actionProvider) => {
  if (!config || !messageParser || !actionProvider) {
    return renderErrorMessage(
      rootEl,
      "I think you forgot to feed me some props. Did you remember to pass a config, a messageparser and an actionprovider?"
    );
  }

  const propsErrors = validateProps(config, messageParser);

  if (propsErrors.length) {
    const errorMessage = propsErrors.reduce((prev, cur) => {
      prev += cur;
      return prev;
    }, "");

    return renderErrorMessage(rootEl, errorMessage);
  }

  const intialState = {
    messages: [...config.initialMessages],
    ...config.state,
  };
  const [state, updater, registerListeners] = stateManager(intialState);

  const actionProviderInstance = new actionProvider(
    createChatBotMessage,
    updater,
    createClientMessage
  );
  const messageParserInstance = new messageParser(actionProviderInstance);

  const widgetRegistry = new WidgetRegistry(
    updater,
    actionProviderInstance
  );
  const widgets = getWidgets(config);
  widgets.forEach((widget) => widgetRegistry.addWidget(widget));

  registerListeners((newState) =>
    render(
      rootEl,
      newState,
      messageParserInstance,
      config,
      updater,
      widgetRegistry
    )
  );

  render(
    rootEl,
    state,
    messageParserInstance,
    config,
    updater,
    widgetRegistry
  );
};

const renderErrorMessage = (rootEl, message) => {
  if (current) {
    rootEl.removeChild(current);
  }

  const errorMessage = createErrorMessage(message);
  rootEl.appendChild(errorMessage);
};

const render = (
  rootEl,
  state,
  messageParserInstance,
  config,
  updater,
  widgetRegistry
) => {
  if (current) {
    rootEl.removeChild(current);
  }

  const chat = renderChat(
    config,
    state,
    messageParserInstance,
    updater,
    widgetRegistry
  );

  current = chat;
  rootEl.appendChild(chat);

  const inputField = document.querySelector(
    ".vanilla-chatbot-kit-chat-input"
  );

  inputField.focus();
  scrollIntoView();
};

console.log("Start ci");
window.vanillaJsChatbot = { renderChatbot, createChatBotMessage };

export { createChatBotMessage };
export default renderChatbot;
