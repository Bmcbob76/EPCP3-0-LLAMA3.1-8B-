// Demo: Replace with actual API endpoints for full stack!
const THREADS_API = '/api/threads';
const MESSAGES_API = '/api/messages';

document.addEventListener('DOMContentLoaded', () => {
    loadThreads();
    document.getElementById('newThreadBtn').onclick = createThread;
    document.getElementById('sendMessageForm').onsubmit = sendMessage;
});

function loadThreads() {
    fetch(THREADS_API)
        .then(r => r.json())
        .then(threads => {
            const list = document.getElementById('threadList');
            list.innerHTML = '';
            threads.forEach(thread => {
                const li = document.createElement('li');
                li.textContent = `${thread.icon} ${thread.name} (${thread.messageCount} messages • ${thread.lastActive})`;
                li.onclick = () => loadThread(thread.id);
                if (thread.active) li.classList.add('active-thread');
                list.appendChild(li);
            });
        });
}

function loadThread(threadId) {
    fetch(`${MESSAGES_API}?thread=${threadId}`)
        .then(r => r.json())
        .then(({thread, messages}) => {
            document.getElementById('chatHeader').textContent = `${thread.icon} ${thread.name}`;
            const chat = document.getElementById('chatMessages');
            chat.innerHTML = '';
            messages.forEach(msg => {
                const div = document.createElement('div');
                div.className = msg.role === 'user' ? 'msg-user' : 'msg-assistant';
                div.innerHTML = `<span class="msg-author">${msg.author}</span><span class="msg-time">${msg.time}</span><div class="msg-content">${msg.text}</div>`;
                chat.appendChild(div);
            });
            chat.scrollTop = chat.scrollHeight;
            document.getElementById('sendMessageForm').dataset.threadId = threadId;
        });
}

function createThread() {
    const name = prompt('Name for new thread?');
    if (!name) return;
    fetch(THREADS_API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
    }).then(() => loadThreads());
}

function sendMessage(e) {
    e.preventDefault();
    const threadId = e.target.dataset.threadId;
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    fetch(MESSAGES_API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({threadId, text})
    }).then(() => {
        loadThread(threadId);
        input.value = '';
    });
}