const jsonp = require('jsonp')
class CommentManager {
	constructor () {
		this.channel = ''
		this.index = -1
		this.loadCount = 0
		this.cancel = function () {}
		this.reject = function () {}
		this.anonymousList = []
		this.anonymousNum = 1
	}
	loadData (channel, token) {
		if (this.channel !== channel) {
			this.clear()
			this.channel = channel
		}

		const promise = new Promise((resolve, reject) => {
			this.cancel()
			this.reject('cancel')
			this.cancel = jsonp('https://live.fc2.com/api/getChannelComment.php?channel_id=' + channel + '&token=' + token + '&last_comment_index=' + this.index, null, (err, data) => {
				this.cancel = function () {}
				this.reject = function () {}
				if (err) {
					reject(new Error('9999'))
				} else {
					if (data.status === 0) {
						this.loadCount++
						let comments = []
						if (data.comments.length > 0) {
							this.index = data.last_comment_index
							data.comments.forEach((comment) => {
								comment.type = []
								if (comment.anonymous) {
									comment.user_name = `匿名(${this.getAnonymousNum(comment.hash)})`
								} else if (comment.ng_name) {
									comment.type.push('ngName')
									comment.user_name = '-NG-'
								}
								if (comment.system_comment) {
									if (comment.system_comment.type === 'tip') {
										comment.type.push('tip')
										comment.user_name = ''
										comment.comment = `${comment.system_comment.tip_amount} pt を${comment.user_name}さんがチップしました。`
									}
								}
								if (comment.ng_comment_keyword) {
									comment.type.push('ngKeyword')
									comment.comment = '--NGｷｰﾜｰﾄﾞが含まれるｺﾒﾝﾄです--'
								} else if (comment.ng_comment_user) {
									comment.type.push('ngUser')
									comment.comment = '--NGﾕｰｻﾞｰのｺﾒﾝﾄです--'
								}

								comment.time = this.getTime(comment.timestamp)
								comments.push(comment)
							})
						}
						resolve(comments)
					} else {
						reject(new Error(data.status))
					}
				}
			})
			this.reject = reject
		})

		return promise
	}
	getAnonymousNum (id) {
		if (id in this.anonymousList) {
			return this.anonymousList[id]
		}
		this.anonymousList[id] = this.anonymousNum++

		return this.anonymousList[id]
	}
	getTime (timestamp) {
		const date = new Date(timestamp)
		const hour = ('0' + date.getHours()).slice(-2)
		const minute = ('0' + date.getMinutes()).slice(-2)
		const second = ('0' + date.getSeconds()).slice(-2)
		return `${hour}:${minute}:${second}`
	}
	getLoadCount () {
		return this.loadCount
	}
	clear () {
		this.anonymousList = []
		this.anonymousNum = 1
		this.index = -1
		this.loadCount = 0
	}
}

const commentManager = new CommentManager()

const state = {
	commentList: []
}

const mutations = {
	ADD_COMMENT_LIST (state, list) {
		state.commentList = state.commentList.concat(list)
	},
	TRIM_COMMENT_LIST (state, length) {
		state.commentList = state.commentList.slice(length)
	},
	CLEAR_COMMENT_LIST (state) {
		state.commentList = []
	}
}

const actions = {
	loadComments ({commit, dispatch, state, rootState, getters, rootGetters}, payload) {
		return new Promise((resolve, reject) => {
			commentManager.loadData(payload.channel, payload.token).then((list) => {
				commit('ADD_COMMENT_LIST', list)
				resolve([list, commentManager.getLoadCount()])
			}).catch((err) => {
				reject(err)
			})
		})
	},
	trimComments ({commit}, payload) {
		commit('TRIM_COMMENT_LIST', payload)
	},
	clear ({commit}) {
		commit('CLEAR_COMMENT_LIST')
		commentManager.clear()
	}
}

const getters = {
	commentList (state) { return state.commentList }
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
