<template>
	<div>
		<svg xmlns="http://www.w3.org/2000/svg" class="svgHide">
			<symbol id="icon-tabCommentDot" viewBox="0 0 60 60">
				<title>icon-tabCommentDot</title>
				<ellipse cx="20.5" cy="29" rx="4" ry="4"></ellipse>
				<ellipse cx="30.5" cy="29" rx="4" ry="4"></ellipse>
				<ellipse cx="40.5" cy="29" rx="4" ry="4"></ellipse>
			</symbol>
			<symbol id="icon-tabCommentBalloon" viewBox="0 0 60 60">
				<title>icon-tabCommentBalloon</title>
				<rect x="10.5" y="15" width="40" height="28" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></rect>
				<path stroke-width="6" stroke-linecap="round" stroke-linejoin="round" d="M 19.5 44 L 19.5 50 L 25 43.7"></path>
			</symbol>
			<symbol id="icon-tabSetting" viewBox="0 0 80 80">
				<title>icon-tabSetting</title>
				<rect x="16" y="18" rx="4" ry="4" height="10" width="50"/>
				<rect x="16" y="36" rx="4" ry="4" height="10" width="50"/>
				<rect x="16" y="54" rx="4" ry="4" height="10" width="50"/>
			</symbol>
			<symbol id="icon-btnPause" viewBox="0 0 80 80">
				<title>icon-btnPause</title>
				<rect x="22" y="20" rx="4" ry="4" height="40" width="12"/>
				<rect x="48" y="20" rx="4" ry="4" height="40" width="12"/>
			</symbol>
			<symbol id="icon-btnSync" viewBox="0 0 50 50">
				<title>icon-btnSync</title>
				<path stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="1" d="M 22 8 L 22 28 L 38 18 L 22 8 Z" transform="matrix(1 0 0 1 -2 8)"></path>
			</symbol>
		</svg>
		<ul class="menu">
			<slot></slot>
			<li class="grow"></li>
			<li v-bind:class="{isActive: page === 'comment'}">
				<router-link to="/">
					<svg role="image" class="icon">
						<use xlink:href="#icon-tabCommentDot"></use>
						<use xlink:href="#icon-tabCommentBalloon" class="balloon"></use>
					</svg>
				</router-link>
			</li>
			<li v-bind:class="{isActive: page === 'config'}">
				<router-link to="/config">
					<svg role="image" class="icon">
						<use xlink:href="#icon-tabSetting"></use>
					</svg>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'menu-component',
		props: ['page'],
		data: () => {
			return {}
		},
		created: () => {
		}
	}
</script>

<style lang="scss">
	svg.svgHide {
		display: none;
	}
	ul.menu {
		display: flex;
		justify-content: space-between;
		list-style-type: none;
		align-items: center;
		margin: 0;
		padding: 0;
		height: 50px;
		background: #ddd;

		li {
			width: 50px;
			margin: 0;
			padding: 0;
			height: 100%;
			flex: 0 0 60px;

			&.grow {
				flex: 1 0 0;
			}

			&.isActive {
				background: #eee;
			}

			a {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				width: 100%;
				cursor: pointer;
				user-select: none;

				.icon {
					fill: #666;
					height: 100%;
				}
				.balloon {
					fill: none;
					stroke: #666;
				}
				.sync {
					fill: none;
					stroke: #666;
				}

				&:hover {
					.icon {
						fill: #ef5763;
					}
					.balloon {
						stroke: #ef5763; 
					}
					.sync {
						fill: none;
						stroke: #ef5763;
					}
				}
			}
		}
	}
</style>
