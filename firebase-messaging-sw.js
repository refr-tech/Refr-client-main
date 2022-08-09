importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyC1dPYtopKROtR01CORXpWc2GHvrgznc0g",
    authDomain: "refr-india.firebaseapp.com",
    projectId: "refr-india",
    storageBucket: "refr-india.appspot.com",
    messagingSenderId: "471641178783",
    appId: "1:471641178783:web:43c8aa09c584db065f18aa"
});

const messaging = firebase.messaging();