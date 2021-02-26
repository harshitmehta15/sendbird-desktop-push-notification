import { isEmpty, setCookie, getCookie } from './utils';
import { USER_ID, KEY_ENTER } from './const';

const userIdEl = document.querySelector('#user_id');
const nicknameEl = document.querySelector('#user_nickname');
const buttonEl = document.querySelector('#login-button');
const publicVapidKey = 'BAAazgdBplmyKQ-X-LnrucCF3IzkQ5DPlIw_Iy0DRcSG1xugM17Au8_9tZZnfZnXDdNVvd4k-ikbc2yIB2CeA8M';
document.addEventListener('DOMContentLoaded', () => {
  const cookieUserId = getCookie(USER_ID);
  if (cookieUserId) {
    userIdEl.value = cookieUserId;
  }
});

nicknameEl.addEventListener('keydown', e => {
  if (e.which === KEY_ENTER) {
    login();
  }
});

buttonEl.addEventListener('click', () => {
  login();
});

const login = () => {
  const userId = userIdEl.value.trim();
  const nickname = nicknameEl.value.trim();
  if (isEmpty(nickname)) {
    alert('Please enter user nickname');
    return;
  }
  userIdEl.value = '';
  nicknameEl.value = '';
  setCookie(USER_ID, userId);
  window.location.href = `chat.html?userid=${encodeURIComponent(userId)}&nickname=${encodeURIComponent(nickname)}`;
};

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
  console.log(registration);
  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      // The `urlBase64ToUint8Array()` function is the same as in
      // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  console.log('Registered push');
  
  console.log('Sending push');
  console.log(subscription);
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Sent push');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}