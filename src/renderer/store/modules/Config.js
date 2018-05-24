const _ = require('lodash')

function nvl (obj, def) {
	return (obj == null) ? def : obj
}

const defaultStyle = {
	lineBg: 'ffffff',
	nameColor: '555555',
	commentColor: '333333',
	hashColor: '808080',
	timeColor: '808080',
	tipBg: 'fceeb6',
	tipHash: '808080',
	tipTime: '808080',
	tipComment: '333333'
}
const darkStyle = {
	lineBg: '222222',
	nameColor: 'eeeeee',
	commentColor: 'eeeeee',
	hashColor: '999999',
	timeColor: '999999',
	tipBg: '555555',
	tipHash: '808050',
	tipTime: '808050',
	tipComment: 'eeee66'
}

var storedStyle = null
try {
	storedStyle = JSON.parse(localStorage.getItem('config_style'))
} catch (e) {
}

const state = {
	channel: nvl(localStorage.getItem('config_channel'), ''),
	token: nvl(localStorage.getItem('config_token'), ''),
	style: _.defaults(_.omitBy(storedStyle, (obj) => _.isEmpty(obj)), defaultStyle),
	style_type: nvl(localStorage.getItem('config_style_type'), 1),
	bouyomi: ~~nvl(localStorage.getItem('config_bouyomi'), 0),
	bouyomi_port: ~~nvl(localStorage.getItem('config_bouyomi_port'), 50001)
}

const mutations = {
	SET_CHANNEL (state, channel) {
		state.channel = channel
	},
	SET_TOKEN (state, token) {
		state.token = token
	},
	SET_STYLE (state, style) {
		state.style = style
	},
	SET_STYLE_TYPE (state, type) {
		state.style_type = type
	},
	SET_BOUYOMI (state, type) {
		state.bouyomi = type
	},
	SET_BOUYOMI_PORT (state, port) {
		state.bouyomi_port = port
	}
}

const actions = {
	setChannel (state, channel) {
		state.commit('SET_CHANNEL', channel)
		localStorage.setItem('config_channel', channel)
	},
	setToken (state, token) {
		state.commit('SET_TOKEN', token)
		localStorage.setItem('config_token', token)
	},
	setStyle (state, style) {
		const jsonObj = _.omitBy(style, (obj) => _.isEmpty(obj))
		const styleObj = _.defaults(_.omitBy(style, (obj) => _.isEmpty(obj)), defaultStyle)
		state.commit('SET_STYLE', styleObj)
		localStorage.setItem('config_style', JSON.stringify(jsonObj))
	},
	setStyleType (state, type) {
		switch (type) {
			case '1':
				state.dispatch('setStyle', defaultStyle)
				state.commit('SET_STYLE_TYPE', type)
				localStorage.setItem('config_style_type', type)
				break
			case '2':
				state.dispatch('setStyle', darkStyle)
				state.commit('SET_STYLE_TYPE', type)
				localStorage.setItem('config_style_type', type)
				break
			default:
				state.commit('SET_STYLE_TYPE', '3')
				localStorage.setItem('config_style_type', '3')
				break
		}
	},
	setBouyomi (state, type) {
		const useBouyomi = type ? 1 : 0
		state.commit('SET_BOUYOMI', useBouyomi)
		localStorage.setItem('config_bouyomi', useBouyomi)
	},
	setBouyomiPort (state, port) {
		const bouyomiPort = port !== '' ? ~~port : 50001
		console.log(bouyomiPort, port)
		state.commit('SET_BOUYOMI_PORT', bouyomiPort)
		localStorage.setItem('config_bouyomi_port', bouyomiPort)
	},
	clear (state) {
		state.commit('SET_CHANNEL', '')
		state.commit('SET_TOKEN', '')
		state.commit('SET_STYLE', defaultStyle)
		state.commit('SET_STYLE_TYPE', '1')
		state.commit('SET_BOUYOMI', 0)
		state.commit('SET_BOUYOMI_PORT', 50001)
		localStorage.clear()
	}
}

const getters = {
	channel (state) { return state.channel },
	token (state) { return state.token },
	style (state) { return state.style },
	style_type (state) { return state.style_type },
	bouyomi (state) { return state.bouyomi },
	bouyomi_port (state) { return state.bouyomi_port }
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
