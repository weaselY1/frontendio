// เป็น serviceworker ของ firebase-message ใช้ได้เฉพาะการเชื่อมต่อแบบ HTTPS
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCn8WDyWzB_VBX_SXbOnRiyMI_0Z5aI2kA",
  authDomain: "testjs-d42fd.firebaseapp.com",
  databaseURL: "https://testjs-d42fd.firebaseio.com",
  projectId: "testjs-d42fd",
  storageBucket: "testjs-d42fd.appspot.com",
  messagingSenderId: "771616290082",
  appId: "1:771616290082:web:47983bf562f40e6eb8217b",
  messagingSenderId: '771616290082'
};
firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  // Customize notification here
  const title = 'Background Message Title';
  const options = {
    body: payload.data.status
    // icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(title, options);
});
