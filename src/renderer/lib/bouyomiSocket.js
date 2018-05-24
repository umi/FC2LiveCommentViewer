const net = require('net')
const client = new net.Socket()

export default class {
	constructor () {
		this.promise = Promise.resolve()
		this.resolve = () => {}
		this.reject = () => {}

		client.on('connect', () => {
			client.write(this.buffer)
			client.end()
		})
		client.on('close', () => {
			this.resolve()
		})
		client.on('error', (e) => {
			this.reject(new Error(e.message))
		})
	}

	send (msg, port = 50001) {
		this.reject()
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject

			const messageBuffer = Buffer.from(this._jsonStrDecode(msg), 'utf8')
			this.buffer = Buffer.alloc(15 + messageBuffer.length)
			this.buffer.writeUInt16LE(0x0001, 0)
			this.buffer.writeUInt16LE(0xFFFF, 2)
			this.buffer.writeUInt16LE(0xFFFF, 4)
			this.buffer.writeUInt16LE(0xFFFF, 6)
			this.buffer.writeUInt16LE(0x0000, 8)
			this.buffer.writeUInt8(0x0000, 10)
			this.buffer.writeUInt32LE(messageBuffer.length, 11)
			messageBuffer.copy(this.buffer, 15, 0, messageBuffer.length)

			client.connect(port, 'localhost')
		})

		return this.promise
	}

	_jsonStrDecode (str) {
		const r = /\\u([\d\w]{4})/gi
		const decode = str.replace(r, (match, grp) => {
			return String.fromCharCode(parseInt(grp, 16))
		})

		return unescape(decode)
	}
}
