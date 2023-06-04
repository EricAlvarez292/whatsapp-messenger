const Chat = require('../controllers/chats')
class ChatRouter {
    constructor(router, whatsappClient) {
        this.router = router
        this.whatsappClient = whatsappClient
        this.chat = new Chat(this.whatsappClient)
    }

    initRoute() {
        this.router.post('/chat', this.chat.sendSingleMessage.bind(this.chat))
    }
}
module.exports = ChatRouter





