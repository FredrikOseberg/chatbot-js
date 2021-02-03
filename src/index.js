import renderChat from "./chat/chat.js";
import {
  createChatBotMessage,
  createClientMessage,
  getWidgets,
} from "./utils.js";
import stateManager from "./state/state.js";
import WidgetRegistry from "./widgetRegistry/widgetRegistry.js";

let current;

const renderChatbot = (rootEl, config, messageParser, actionProvider) => {
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
};

window.vanillaJsChatbot = { renderChatbot, createChatBotMessage };
