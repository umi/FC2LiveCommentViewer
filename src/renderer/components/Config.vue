<template>
	<div id="config">
		<div class="contents">
			<div class="title">
				Settings
			</div>

			<div class="settings">
				<div class="input_group">
					<div class="label">channel</div>
					<input ref="channel" @change="changeChannel" type="text" v-bind:value="channel">
				</div>

				<div class="input_group">
					<div class="label">token</div>
					<input ref="token" @change="changeToken" type="text" v-bind:value="token">
				</div>

				<div v-if="platform === 'win32'" class="check_group">
					<label for="bouyomi_checkbox">
						<input @change="changeBouyomi" type="checkbox" id="bouyomi_checkbox" name="bouyomi_checkbox" v-model="check_bouyomi">
						<span>Bouyomi chan</span>
					</label>
				</div>
			</div>

			<div class="title">
				Styles
			</div>

			<div class="radio_group">
				<label>
					<input ref="theme1" @change="changeStyleType" type="radio" name="theme" value="1" v-model="radio_style_type">
					<span>normal</span>
				</label>
				<label>
					<input ref="theme2" @change="changeStyleType" type="radio" name="theme" value="2" v-model="radio_style_type">
					<span>dark</span>
				</label>
				<label>
					<input ref="theme3" @change="changeStyleType" type="radio" name="theme" value="3" v-model="radio_style_type">
					<span>custom</span>
				</label>
			</div>

			<div v-show="radio_style_type === '3'" class="styles">
				<div class="input_group color">
					<div class="label">hash color</div>
					<input ref="hashColor" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.hashColor">
				</div>

				<div class="input_group color">
					<div class="label">time color</div>
					<input ref="timeColor" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.timeColor">
				</div>

				<div class="input_group color">
					<div class="label">name color</div>
					<input ref="nameColor" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.nameColor">
				</div>

				<div class="input_group color">
					<div class="label">comment color</div>
					<input ref="commentColor" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.commentColor">
				</div>

				<div class="input_group color">
					<div class="label">background color</div>
					<input ref="lineBg" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.lineBg">
				</div>

				<div class="input_group color">
					<div class="label">tip hash color</div>
					<input ref="tipHash" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.tipHash">
				</div>

				<div class="input_group color">
					<div class="label">tip time color</div>
					<input ref="tipTime" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.tipTime">
				</div>

				<div class="input_group color">
					<div class="label">tip comment color</div>
					<input ref="tipComment" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.tipComment">
				</div>

				<div class="input_group color">
					<div class="label">tip background color</div>
					<input ref="tipBg" @change="changeStyle" type="text" maxlength="6" v-bind:value="style.tipBg">
				</div>
			</div>

			<ul class="comments">
				<li>
					<div class="comment_head" v-bind:style="configStyle.comment_head">
						<div class="hash" v-bind:style="configStyle.hash">00000000000000000000000000000000</div>
						<div class="time" v-bind:style="configStyle.time">00:00:00</div>
					</div>
					<div class="comment_body" v-bind:style="configStyle.comment_body">
						<div class="user_name" style="width: 60px" v-bind:style="configStyle.user_name">匿名(1)</div>
						<div class="comment_text" v-bind:style="configStyle.comment_text">コメントコメントコメント</div>
					</div>
				</li>
				<li>
					<div class="comment_head" v-bind:style="configStyle.tip_head">
						<div class="hash" v-bind:style="configStyle.tip_hash">00000000000000000000000000000000</div>
						<div class="time" v-bind:style="configStyle.tip_time">00:00:00</div>
					</div>
					<div class="comment_body" v-bind:style="configStyle.tip_body">
						<div class="comment_text" v-bind:style="configStyle.tip_comment_text">100 pt を匿名(1)さんがチップしました。</div>
					</div>
				</li>
			</ul>


			<div class="btn_group">
				<button @click="clearData">初期化</button>
			</div>
		</div>
		<Menu page="config"></Menu>
	</div>
</template>

<script>
	import Menu from './Common/Menu'
	export default {
		name: 'config-page',
		components: { Menu },
		data: () => {
			return {
				radio_style_type: '1',
				platform: require('os').platform(),
				check_bouyomi: false
			}
		},
		computed: {
			channel () {
				return this.$store.getters['Config/channel']
			},
			token () {
				return this.$store.getters['Config/token']
			},
			style () {
				return this.$store.getters['Config/style']
			},
			configStyle () {
				return {
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
					tip_head: {
						background: '#' + this.$store.getters['Config/style'].tipBg
					},
					tip_body: {
						background: '#' + this.$store.getters['Config/style'].tipBg
					},
					tip_comment_text: {
						color: '#' + this.$store.getters['Config/style'].tipComment
					},
					tip_hash: {
						color: '#' + this.$store.getters['Config/style'].tipHash
					},
					tip_time: {
						color: '#' + this.$store.getters['Config/style'].tipTime
					}
				}
			}
		},
		methods: {
			changeChannel () {
				this.$store.dispatch('Config/setChannel', ~~this.$refs.channel.value)
				this.$store.dispatch('Comment/clear')
			},
			changeToken () {
				this.$store.dispatch('Config/setToken', this.$refs.token.value)
				this.$store.dispatch('Comment/clear')
			},
			changeStyle () {
				this.$store.dispatch('Config/setStyle', {
					lineBg: this.$refs.lineBg.value,
					nameColor: this.$refs.nameColor.value,
					commentColor: this.$refs.commentColor.value,
					hashColor: this.$refs.hashColor.value,
					timeColor: this.$refs.timeColor.value,
					tipBg: this.$refs.tipBg.value,
					tipComment: this.$refs.tipComment.value,
					tipHash: this.$refs.tipHash.value,
					tipTime: this.$refs.tipTime.value
				})
				this.radio_style_type = '3'
				this.changeStyleType()
			},
			changeStyleType () {
				this.$store.dispatch('Config/setStyleType', this.radio_style_type)
			},
			changeBouyomi () {
				this.$store.dispatch('Config/setBouyomi', this.check_bouyomi)
			},
			clearData () {
				this.$store.dispatch('Config/clear')
				this.$store.dispatch('Comment/clear')
				this.radio_style_type = '1'
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				const style = this.$store.getters['Config/style_type']
				const bouyomi = this.$store.getters['Config/bouyomi']
				this.$refs['theme' + style].checked = true
				this.radio_style_type = style
				this.check_bouyomi = bouyomi === 1
			})
		}
	}
</script>

<style lang="scss" scoped>
	#config {
		height: 100%;
		display: flex;
		flex-direction: column;

		.contents {
			margin: 0;
			padding: 10px;
			height: 100%;
			overflow-y: auto;
			overflow-x: hidden;
			background-color: #eee;

			.title {
				margin: 10px 0 15px 0;
				position: relative;
				padding: 2px 18px;
				border-top: solid 2px #aaa;
				border-bottom: solid 2px #aaa;
				clear: both;
				font-size: 1.2em;
				color: #999;
				width: 80px;
				text-align: center;
				user-select: none;

				&:before,
				&:after{
					content: '';
					position: absolute;
					top: -7px;
					width: 2px;
					height: -webkit-calc(100% + 14px);
					height: calc(100% + 14px);
					background-color: #aaa;
				}

				&:before {left: 7px;}
				&:after {right: 7px;}
			}

			.settings {
				margin: -10px -10px 20px;
				float: left;
				overflow: auto;
			}

			input[type="checkbox"],
			input[type="radio"] {
				margin: 0;
				padding: 0;
				background: none;
				border: none;
				border-radius: 0;
				outline: none;
				appearance: none;
			}

			.check_group {
				position: relative;
				padding: 10px;
				clear: both;

				label {
					position: relative;
					display: inline-block;
					cursor: pointer;
					white-space: nowrap;
					margin-bottom: 10px;
					color: #666;
				}

				label span {
					display: inline-block;
					padding: 0 10px 0 30px; 
					user-select: none;
				}

				label input[type="checkbox"] {
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0;

					& + span::before,
					& + span::after {
						position: absolute;
						top: -3px;
						left: 0;
						display: inline-block;
						content: '';
						box-sizing: border-box;
					}

					& + span::before {
						z-index: 0;
						background-color: transparent;
						width: 22px;
						height: 22px;
						border: 2px #999 solid;
						border-radius: 5px;
					}

					& + span::after {
						z-index: 1;
						margin: 5px 8px;
						width: 6px;
						height: 9px;
					}

					&:checked + span::before {
						background-color: #999;
					}

					&:checked + span::after {
						border: 2px solid #fff;
						border-width: 0 2px 2px 0;
						transform: rotate(45deg);
					}
				}
			}

			.radio_group {
				position: relative;
				clear: both;

				label {
					position: relative;
					display: inline-block;
					cursor: pointer;
					white-space: nowrap;
					margin-bottom: 10px;
					color: #666;
				}

				label span {
					// display: inline-block;
					position: relative;
					padding: 0 10px 0 30px; 
					user-select: none;
				}
				label input[type="radio"] {
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0;
				}
				label input[type="radio"] + span::before {
					position: absolute;
					display: inline-block;
					content: '';
					box-sizing: border-box;
					border-radius: 22px;
				}
				label input[type="radio"] + span::before {
					z-index: 0;
					top: -2px;
					left: 0;
					background-color: transparent;
					width: 22px;
					height: 22px;
					border: 2px #999 solid;
				}
				label input[type="radio"]:checked + span::before {
					border-width: 6px;
				}
			}

			.styles {
				margin: -10px -10px 10px;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.input_group {
					flex: 1 0 170px;
				}
			}

			.input_group {
				position: relative;
				margin: 10px 10px 0;

				.label {
					display: inline-block;
					color: white;
					background-color: #999;
					padding: 2px 8px 0;
					border-radius: 4px 4px 0 0;
					user-select: none;
				}

				input {
					padding: 5px 10px;
					font-size: 1.3em;
					color: #aaa;
					border: solid 1px #999;
					margin: 0;
					width: 100%;
					box-sizing: border-box;
					border-radius: 0 4px 4px;
				}

				&.color:before {
					content: '#';
					position: absolute;
					font-size: 1.3em;
					font-weight: bold;
					color: #aaa;
					top: 26px;
					left: 10px;
				}

				&.color input {
					padding-left: 25px;
				}
			}

			.btn_group {
				text-align: right;

				button {
					padding: 10px;
					color: #eee;
					border: solid 1px #999;
					margin: 0 0 20px;
					background-color: #999;
					box-sizing: border-box;
					user-select: none;
					cursor: pointer;

					&.blue {
						color: #eee;
						background-color: #4774dc;
					}
				}
			}

			.comments {
				margin: 0;
				padding: 0;
				list-style-type: none;
				overflow-y: auto;
				overflow-x: hidden;
				margin-bottom: 10px;
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
			}
			.comment_text {
				color: #333;
				overflow: hidden;
			}
		}
	}
</style>
