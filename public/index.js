const user = document.querySelector('.sender__info__name');
const message = document.getElementById('message');
const messageTitle = document.querySelector('.message__title');
const usersList = document.querySelector('.users__list');
const element = document.querySelector('.message__list');
const form = document.getElementById('formMessage');

const socket = io('ws://localhost:3000');

socket.on('connect', () => {
    socket.emit('user_connected', `${user.dataset.account} est connecté`);
    console.log('client: ' + socket.id);
});

function handleUser(e) {
    if (e.dataset.id) {
        let senderId = parseInt(e.parentNode.dataset.account);
        let receiverId = parseInt(e.dataset.id);
        let roomId = null;

        if (senderId > receiverId) roomId = `room_${receiverId}_${senderId}`;
        else roomId = `room_${senderId}_${receiverId}`;

        socket.emit('join-room', roomId);
        messageTitle.textContent = e.querySelector('.name').textContent;
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (messageTitle.textContent === 'Rejoindre un salon') {
        alert('Veuillez rejoindre un salon');
    } else {
        const li = document.createElement('li');
        li.textContent = message.value;
        li.classList.add('message__list__sender', 'message');
        element.appendChild(li);
        socket.emit('send', message.value);
    }
});

message.addEventListener('keyup', () => {
    socket.emit('isTyping', usersList.dataset.account);
});

socket.on('isConnected', (msg) => {
    console.log(msg);
});

socket.on('receive', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    li.classList.add('message__list__receiver', 'message');
    element.appendChild(li);
});

let typeTimer = null;

socket.on('userTyping', (msg) => {
    let userListAccount = document.querySelector(
        `.users__list__account[data-id="${msg}"]`,
    );
    userListAccount.querySelector('.typing').textContent = 'Typing...';

    clearTimeout(typeTimer);
    typeTimer = setTimeout(() => {
        userListAccount.querySelector('.typing').textContent = '';
    }, 2000);
});
