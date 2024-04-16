const user = document.querySelector('.users__title');
const message = document.getElementById('message');
const messageTitle = document.querySelector('.message__title');
const messageError = document.querySelector('.message__error');
const usersList = document.querySelector('.users__list');
const element = document.querySelector('.message__list');
const form = document.getElementById('formMessage');

const socket = io('ws://localhost:3000');

socket.on('connect', () => {
    socket.emit('user_connected', `${user.dataset.account} est connecté`);
    console.log('client: ' + socket.id);
});

usersList.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
        let senderId = parseInt(e.target.parentNode.dataset.account);
        let receiverId = parseInt(e.target.dataset.id);
        let roomId = null;

        if (senderId > receiverId) roomId = `room_${receiverId}_${senderId}`;
        else roomId = `room_${senderId}_${receiverId}`;

        socket.emit('join-room', roomId);
        messageTitle.textContent = `En discussion avec ${e.target.textContent}`;
        messageError.textContent = '';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (messageTitle.textContent === '') {
        messageError.textContent = 'Veuillez rejoindre une discussion';
    } else {
        messageError.textContent = '';
        const li = document.createElement('li');
        li.textContent = message.value;
        element.appendChild(li);
        socket.emit('send', message.value);
    }
});

socket.on('isConnected', (msg) => {
    console.log(msg);
});

socket.on('receive', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    li.classList.add('receiver');
    element.appendChild(li);
});
