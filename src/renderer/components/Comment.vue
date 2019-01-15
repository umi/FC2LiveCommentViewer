<template>
	<div id="comment">
		<input ref="slider" type="range" v-model="nameWidth" min="0" :max="sliderWidth">
		<ul @scroll="onScroll" ref="comment" class="comments" v-bind:style="configStyle.comment_box">
			<li v-for="comment in comments">
				<div v-if="comment.type.indexOf('tip') !== -1 || comment.type.indexOf('gift') !== -1" class="comment_head" v-bind:style="configStyle.system_head">
					<div class="hash" v-bind:style="configStyle.system_hash">{{ comment.hash }}</div>
					<div class="time" v-bind:style="configStyle.system_time">{{ comment.time }}</div>
				</div>
				<div v-else class="comment_head" v-bind:style="configStyle.comment_head">
					<div class="hash" v-bind:style="configStyle.hash">{{ comment.hash }}</div>
					<div class="time" v-bind:style="configStyle.time">{{ comment.time }}</div>
				</div>
				<div v-if="comment.type.indexOf('tip') !== -1 || comment.type.indexOf('gift') !== -1" class="comment_body" v-bind:style="configStyle.system_body">
					<div class="comment_text" v-bind:style="[configStyle.system_comment_text]">{{ comment.comment }}</div>
				</div>
				<div v-else class="comment_body" v-bind:style="configStyle.comment_body">
					<div class="user_name" v-bind:class="{ ng_name: comment.type.indexOf('ngName') !== -1 }" v-bind:style="[userNameStyle, configStyle.user_name]">{{ comment.user_name }}</div>
					<div class="comment_text" v-bind:class="{ ng_keyword: comment.type.indexOf('ngKeyword') !== -1, ng_user: comment.type.indexOf('ngUser') !== -1 }" v-bind:style="[configStyle.comment_text]">{{ comment.comment }}</div>
				</div>
			</li>
		</ul>
		<div @click="currentScroll" v-if="!autoScroll" class="current_scroll">
			現在のコメントへ戻る
		</div>
		<Menu page="comment">
			<li>
				<a @click="syncStop" v-if="syncStatus">
					<svg role="image" class="icon">
						<use xlink:href="#icon-btnPause"></use>
					</svg>
				</a>
				<a @click="sync" v-else>
					<svg role="image" class="icon sync">
						<use xlink:href="#icon-btnSync"></use>
					</svg>
				</a>
			</li>
		</Menu>
		<Modal @change="modalChange" :checked="!modal">
			<h2>{{ modalTitle }}</h2>
			<div>{{ modalBody }}</div>
		</Modal>
	</div>
</template>

<script>
	import Menu from './Common/Menu'
	import Modal from './Common/Modal'
	import BouyomiSocket from '@/lib/bouyomiSocket'
	import {remote} from 'electron'

	const dialog = remote.dialog
	const win = remote.getCurrentWindow()
	const _ = require('lodash')
	const bouyomiSocket = new BouyomiSocket()

	export default {
		name: 'comment-page',
		components: { Menu, Modal },
		data: () => {
			return {
				index: -1,
				nameWidth: 70,
				width: window.innerWidth,
				timer: 0,
				syncStatus: 0,
				autoScroll: 1,
				maxLength: 1000,
				platform: require('os').platform(),
				generatorLoopLock: false,
				generatorList: [],
				modal: false,
				modalTitle: '',
				modalBody: ''
			}
		},
		computed: {
			channel () {
				return this.$store.getters['Config/channel']
			},
			token () {
				return this.$store.getters['Config/token']
			},
			bouyomi () {
				return this.$store.getters['Config/bouyomi']
			},
			bouyomiPort () {
				return this.$store.getters['Config/bouyomi_port']
			},
			comments () {
				return this.$store.getters['Comment/commentList']
			},
			userNameStyle () {
				return {
					width: this.nameWidth - 5 + 'px',
					minWidth: this.nameWidth - 5 + 'px'
				}
			},
			sliderWidth () {
				return this.width - 10
			},
			configStyle () {
				return {
					comment_box: {
						background: '#' + this.$store.getters['Config/style'].lineBg
					},
					comment_head: {
						background: '#' + this.$store.getters['Config/style'].lineBg
					},
					comment_body: {
						background: '#' + this.$store.getters['Config/style'].lineBg
					},
					user_name: {
						color: '#' + this.$store.getters['Config/style'].nameColor
					},
					comment_text: {
						color: '#' + this.$store.getters['Config/style'].commentColor
					},
					hash: {
						color: '#' + this.$store.getters['Config/style'].hashColor
					},
					time: {
						color: '#' + this.$store.getters['Config/style'].timeColor
					},
					system_head: {
						background: '#' + this.$store.getters['Config/style'].systemBg
					},
					system_body: {
						background: '#' + this.$store.getters['Config/style'].systemBg
					},
					system_comment_text: {
						color: '#' + this.$store.getters['Config/style'].systemComment
					},
					system_hash: {
						color: '#' + this.$store.getters['Config/style'].systemHash
					},
					system_time: {
						color: '#' + this.$store.getters['Config/style'].systemTime
					}
				}
			}
		},
		methods: {
			load () {
				return new Promise((resolve, reject) => {
					this.$store.dispatch('Comment/loadComments', {channel: this.channel, token: this.token}).then(([comments, count]) => {
						resolve([comments, count])
						if (comments.length && this.autoScroll) {
							this.currentScroll()
						} else if (this.comments.length > this.maxLength) {
							const deleteLength = this.comments.length - this.maxLength
							const commentListElms = this.$refs.comment.children
							let scroll = 0
							for (let i = 0; i < deleteLength; i++) {
								scroll += commentListElms[i].clientHeight
							}
							this.$refs.comment.scrollTop -= scroll
							this.$store.dispatch('Comment/trimComments', deleteLength)
						}
					}).catch(err => {
						reject(err)
					})
				})
			},
			sync () {
				this.syncStatus = 1
				clearTimeout(this.timer)
				this.load().then(([comments, count]) => {
					if (count > 1 && comments.length && this.platform === 'win32' && this.bouyomi === 1) {
						try {
							let gen = this.bouyomiGenerator(comments)
							this.addGenerator(gen)
						} catch (e) {
							console.warn(e.message, 'test')
							this.$store.dispatch('Config/setBouyomi', 0)
						}
					}
					this.timer = setTimeout(() => {
						if (this.syncStatus === 1) {
							this.sync()
						}
					}, 1000)
				}).catch(err => {
					let options = {
						type: 'info',
						buttons: ['閉じる', '設定を開く'],
						title: 'エラーが発生しました',
						message: '',
						detail: '設定を確認してください。'
					}
					switch (err.message) {
						case '10':
							if (this.token === '' && this.channel === '') {
								options.message = 'channelとtokenが設定されていません。'
							} else if (this.token === '') {
								options.message = 'tokenが設定されていません。'
							} else if (this.channel === '') {
								options.message = 'channelが設定されていません。'
							} else {
								options.message = `パラメーターエラーが発生しました。(${err.message})`
							}
							break
						case '11':
							options.message = `該当するユーザーがいません。(${err.message})`
							break
						case '12':
							options.message = `該当するチャンネルがありません。(${err.message})`
							break
						case '13':
							options.title = ''
							options.message = 'エラーが発生しました'
							options.detail = `未入室チャンネルです。(${err.message})`
							options.buttons = ['閉じる']
							break
						case '98':
						case '99':
						default:
							options.title = ''
							options.message = 'エラーが発生しました'
							options.detail = `システムエラーが発生しました。(${err.message})`
							options.buttons = ['閉じる']
							break
					}

					this.showMessage(options).then((index) => {
						if (index === 1) {
							this.$router.push('Config')
						}
					})

					this.syncStop()
				})
			},
			syncStop () {
				this.syncStatus = 0
				clearTimeout(this.timer)
			},
			setWindowWidth: _.debounce(function () {
				this.width = this.$refs.slider.clientWidth
				this.currentScroll()
			}, 300),
			currentScroll () {
				this.$refs.comment.scrollTop = this.$refs.comment.scrollHeight
				this.autoScroll = 1
			},
			onScroll: _.debounce(function () {
				if (this.$refs.comment.scrollHeight - this.$refs.comment.scrollTop - this.$refs.comment.clientHeight > 100) {
					this.autoScroll = 0
				} else {
					this.autoScroll = 1
				}
			}, 100),
			bouyomiGenerator: async function* (comments) {
				try {
					for (let comment of comments) {
						if (this.$store.getters['Config/bouyomi'] !== 1) {
							break
						}
						if (comment.ng_comment_keyword || comment.ng_comment_user || comment.comment === '') {
							continue
						}
						let res = await bouyomiSocket.send(comment.comment, this.bouyomiPort)
						yield res
					}
				} catch (e) {
					if (e) {
						this.$store.dispatch('Config/setBouyomi', 0)
						// this.showModal('エラー', '棒読みちゃんに接続出来ませんでした。')
						this.showMessage({
							title: 'エラーが発生しました',
							message: '棒読みちゃんに接続出来ませんでした',
							detail: '棒読みちゃんの設定を解除しました。',
							buttons: ['閉じる']
						})
					}
				}
			},
			async generatorLoop () {
				if (this.generatorLoopLock) {
					return
				}
				this.generatorLoopLock = true
				let res
				let gen = this.generatorList.shift()
				while (gen) {
					do {
						res = await gen.next()
					} while (!res.done)
					gen = this.generatorList.shift()
				}
				this.generatorLoopLock = false
			},
			addGenerator (gen) {
				this.generatorList.push(gen)
				this.generatorLoop()
			},
			showModal (title, body) {
				this.modalTitle = title
				this.modalBody = body
				this.modal = true
			},
			modalChange (check) {
				this.modal = check
			},
			showMessage (options) {
				const promise = new Promise((resolve, reject) => {
					dialog.showMessageBox(win, options, (index) => {
						resolve(index)
					})
				})

				return promise
			}
		},
		created: function () {
			window.addEventListener('resize', this.setWindowWidth, false)
		},
		mounted: function () {
			this.$nextTick(function () {
				this.width = this.$refs.slider.clientWidth
				this.currentScroll()
				this.sync()
			})
		},
		beforeDestroy: function () {
			window.removeEventListener('resize', this.setWindowWidth, false)
			this.syncStop()
		}
	}
</script>

<style lang="scss" scoped>
	#comment {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	input[type=range] {
		-webkit-appearance:none;
		background:#eee;
		height:10px;
		width:100%;
		margin: 0;
	}
	input[type=range]:focus {
		outline: 0;
	}
	input[type=range]::-webkit-slider-thumb{
		cursor: pointer;
		-webkit-appearance:none;
		background:#999;
		height:10px;
		width:10px;
	}
	.comments {
		margin: 0;
		padding: 0;
		list-style-type: none;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.comments div.comment_head,
	.comments div.comment_body {
		padding: 0 5px;
		display: flex;
	}
	.comments div.comment_head {
		color: gray;
		font-size: 0.8em;
		padding-top: 3px;
	}
	.comments div.comment_body {
		padding-bottom: 3px;
	}
	.hash {
		flex-grow: 1;
		overflow: hidden;
	}
	.time {
		flex-grow: 0;
		text-align: right;
		margin-left: 20px;
	}
	.user_name {
		color: #555;
		font-weight: bold;
		margin-right: 10px;
		overflow: hidden;
		white-space: nowrap;

		&.ng_name {
			font-weight: bold;
			opacity: 0.6;
		}
	}
	.comment_text {
		color: #333;
		overflow: hidden;

		&.ng_keyword,
		&.ng_user {
			font-weight: bold;
			white-space: nowrap;
			overflow: hidden;
			opacity: 0.6;
		}
	}
	.current_scroll {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 50px;
		width: 100%;
		height: 50px;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		font-weight: bold;
		cursor: pointer;
		user-select: none;
	}
</style>
