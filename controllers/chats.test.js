const Chat = require('./chats')
describe('Chat Unit Test', () => {
    let chat;
    beforeEach(() => {
        chat = new Chat()
    })

    it(('should be 1'), () => {
        expect(new Chat().add('1')).toBe(1);
    })
})


