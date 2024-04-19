const user = document.querySelector('.sender__info__name');
const message = document.getElementById('message');
const messageTitle = document.querySelectorAll('.message__title');
const usersNavbar = document.querySelector('.users__navbar__list');
const usersList = document.querySelector('.users__list');
const element = document.querySelector('.message__list');
const form = document.getElementById('formMessage');

const socket = io('ws://localhost:3000');

socket.on('connect', () => {
    socket.emit('user_connected', `${user.dataset.account} est connecté`);
    console.log('client: ' + socket.id);
});

usersNavbar.addEventListener('click', (e) => {
    document.querySelector('.isSelected').classList.remove('isSelected');
    e.target.classList.add('isSelected');

    document.querySelector('.isHidden').classList.remove('isHidden');

    if (e.target.dataset.category === 'all') {
        document.querySelector('.group__list').classList.add('isHidden');
    } else {
        document.querySelector('.users__list').classList.add('isHidden');
    }
});

function handleUser(userId, res) {
    const decodeRes = decodeURIComponent(res);
    const parseRes = JSON.parse(decodeRes);

    if (parseRes.id) {
        let senderId = parseInt(userId);
        let receiverId = parseInt(parseRes.id);
        let roomId = null;

        if (senderId > receiverId) roomId = `room_${receiverId}_${senderId}`;
        else roomId = `room_${senderId}_${receiverId}`;

        socket.emit('join-room', roomId);

        //Change informations in dashboard
        messageTitle.forEach((item) => {
            item.textContent = parseRes.name;
        });

        document.querySelector('.receiver__image').srcset = parseRes.image;
        document.querySelector('.receiver__info__email__text').innerHTML =
            parseRes.email;

        element.textContent = '';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (messageTitle[0].textContent === 'Rejoindre un salon') {
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
