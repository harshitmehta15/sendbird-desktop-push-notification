console.log('Loaded service worker!');

self.addEventListener('push', ev => {
  const data = ev.data.json();
  console.log('Got push3', data);
 const abc = self.registration.showNotification(data.title, {
    body: 'Message Filtered',
    icon: 'https://6cro14eml0v2yuvyx3v5j11j-wpengine.netdna-ssl.com/wp-content/themes/sendbird-sb/assets/img/ic-sendbird-symbol.svg'
  });
  console.log(abc);
});