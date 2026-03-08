class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };
        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        chatbox.classList.toggle('chatbox--active', this.state);
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const text = textField.value.trim();
        if (!text) return;

        const userMsg = { name: 'User', message: text };
        this.messages.push(userMsg);
        this.updateChatText(chatbox);
        textField.value = '';

        // Uses $SCRIPT_ROOT set by the Jinja2 template (Flask deployment)
        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text }),
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(r => r.json())
        .then(r => {
            const botMsg = { name: 'Smith', message: r.answer };
            this.messages.push(botMsg);
            this.updateChatText(chatbox);
        })
        .catch(error => {
            console.error('Error:', error);
            const errMsg = { name: 'Smith', message: 'Sorry, I could not reach the server. Please try again.' };
            this.messages.push(errMsg);
            this.updateChatText(chatbox);
        });
    }

    updateChatText(chatbox) {
        let html = '';
        this.messages.slice().reverse().forEach(item => {
            if (item.name === 'Smith') {
                html += `<div class="messages__item messages__item--visitor">${item.message}</div>`;
            } else {
                html += `<div class="messages__item messages__item--operator">${item.message}</div>`;
            }
        });
        chatbox.querySelector('.chatbox__messages').innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
