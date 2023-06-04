
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
class Chat {
    constructor(whatsappClient) {
        this.whatsappClient = whatsappClient
    }

    async sendSingleMessage(req, res) {
        console.log(`Body : ${JSON.stringify(req.body)}`)
        const body = req.body
        const validate = this.validatePhoneNumber(body.phoneNumber, body.countryCodeAlpha)
        if (validate.error) {
            res.status(200).send({ error: `${validate.error}` })
        } else {
            const response = await this.send(validate.number, body.message)
            res.status(200).send(JSON.stringify(response))
        }
    }

    validatePhoneNumber(phoneNumber, countryCodeAlpha) {
        const number = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCodeAlpha);
        const isValid = phoneUtil.isValidNumber(number);
        return { number: number, error: (isValid) ? null : new Error(`Recipient phone number invalid : ${phoneNumber} using country code : ${countryCodeAlpha}`) }
    }

    async send(phoneNumber, message) {
        const INDIVIDUAL = '@s.whatsapp.net'
        const translated_number = phoneUtil.format(phoneNumber, PNF.E164);
        let final_number = translated_number;
        if (translated_number.charAt(0) === '+') final_number = translated_number.slice(1);
        const id = `${final_number}${INDIVIDUAL}`;
        return await this.sendTextMessage(id, final_number, message)
    }

    async sendTextMessage(id, recipient_number, message) {
        console.log('Text Message');
        console.log('Message/Caption : ' + message);
        const response = {
            status: 'success',
            error: null,
            message: message,
            message_type: "TEXT"
        };
        try {
            await this.whatsappClient.sendMessage(id, message)
            return response;
        } catch (err) {
            return { status: 'failed', error: JSON.stringify(err), recipient_number: recipient_number }
        }
    };


    add(numbers) {
        return numbers
            .split(',')
            .map(x => parseInt(x))
            .reduce((a, b) => a + b)
    }
}

module.exports = Chat


