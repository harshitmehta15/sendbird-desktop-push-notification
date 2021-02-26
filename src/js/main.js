import { getVariableFromUrl, isEmpty, redirectToIndex } from './utils';
import { SendBirdAction } from './SendBirdAction';
import { ChatLeftMenu } from './ChatLeftMenu';
import { Chat } from './Chat';
import { Spinner } from './components/Spinner';
import { body, UPDATE_INTERVAL_TIME } from './const';
import { SendBirdConnection } from './SendBirdConnection';
import { SendBirdEvent } from './SendBirdEvent';
import { LeftListItem } from './components/LeftListItem';

const publicVapidKey = 'BAAazgdBplmyKQ-X-LnrucCF3IzkQ5DPlIw_Iy0DRcSG1xugM17Au8_9tZZnfZnXDdNVvd4k-ikbc2yIB2CeA8M';

const sb = new SendBirdAction();

const chatLeft = new ChatLeftMenu();
const chat = new Chat();

Spinner.start(body);

const createConnectionHandler = () => {
  const connectionManager = new SendBirdConnection();
  connectionManager.onReconnectStarted = () => {
    Spinner.start(body);
    console.log('[SendBird JS SDK] Reconnect : Started');
    connectionManager.channel = chat.channel;
  };
  connectionManager.onReconnectSucceeded = () => {
    console.log('[SendBird JS SDK] Reconnect : Succeeded');
    chatLeft.clear();
    chatLeft.updateUserInfo(SendBirdAction.getInstance().getCurrentUser());
    chatLeft.getGroupChannelList(true);
    Spinner.start(body);
    chat.refresh(connectionManager.channel);
  };
  connectionManager.onReconnectFailed = () => {
    console.log('[SendBird JS SDK] Reconnect : Failed');
    connectionManager.remove();
    redirectToIndex('SendBird Reconnect Failed...');
  };
};

const createChannelEvent = () => {
  const channelEvent = new SendBirdEvent();
  channelEvent.onChannelChanged = channel => {
    if(channel._autoMarkAsRead) {
      channel.markAsRead();
    }
    chatLeft.updateItem(channel, true);
  };
  channelEvent.onUserEntered = (openChannel, user) => {
    if (SendBirdAction.getInstance().isCurrentUser(user)) {
      const handler = () => {
        chat.render(openChannel.url);
        ChatLeftMenu.getInstance().activeChannelItem(openChannel.url);
      };
      const item = new LeftListItem({ channel: openChannel, handler });
      chatLeft.addOpenChannelItem(item.element);
      chat.render(openChannel.url);
    }
  };
  channelEvent.onUserJoined = (groupChannel, user) => {
    const handler = () => {
      chat.render(groupChannel.url, false);
      ChatLeftMenu.getInstance().activeChannelItem(groupChannel.url);
    };
    const item = new LeftListItem({ channel: groupChannel, handler });
    chatLeft.addGroupChannelItem(item.element);
    chat.updateChatInfo(groupChannel);
  };
  channelEvent.onUserLeft = (groupChannel, user) => {
    if (SendBirdAction.getInstance().isCurrentUser(user)) {
      chatLeft.removeGroupChannelItem(groupChannel.url);
    } else {
      chatLeft.updateItem(groupChannel);
    }
    chat.updateChatInfo(groupChannel);
  };
  channelEvent.onChannelHidden = groupChannel => {
    chatLeft.removeGroupChannelItem(groupChannel.url);
  };
};

const updateGroupChannelTime = () => {
  setInterval(() => {
    LeftListItem.updateLastMessageTime();
  }, UPDATE_INTERVAL_TIME);
};

document.addEventListener('DOMContentLoaded', () => {
  const { userid, nickname } = getVariableFromUrl();
  if (isEmpty(userid) || isEmpty(nickname)) {
    redirectToIndex('UserID and Nickname must be required.');
  }
  sb
    .connect(userid, nickname)
    .then(user => {
      chatLeft.updateUserInfo(user);
      createConnectionHandler();
      createChannelEvent();
      updateGroupChannelTime();
      chatLeft.getGroupChannelList(true);
    })
    .catch(() => {
      redirectToIndex('SendBird connection failed.');
    });
});


//Push Notification Implementation

if ('serviceWorker' in navigator) {
  console.log('Registering service worker');

  run().catch(error => console.error(error));
}

async function run() {
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.
    register('/worker.js', {scope: '/'});
  console.log('Registered service worker');

  console.log('Registering push');
  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      // The `urlBase64ToUint8Array()` function is the same as in
      // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  console.log('Registered push');

  console.log('Sending push');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Sent push');
}
