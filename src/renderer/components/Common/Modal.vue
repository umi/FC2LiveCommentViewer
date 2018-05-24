<template>
	<div class="modal">
		<input @change="$emit('change', checked)" type="checkbox" class="modal-check" id="modal-check" v-bind:checked="checked">
		<div class="modal-body">
			<div class="modal-window">
				<label class="modal-label" for="modal-check">
					<svg width="16" height="16">
						<polygon points="14.4,3.1 12.9,1.6 8,6.6 3.1,1.6 1.6,3.1 6.6,8 1.6,12.9 3.1,14.4 8,9.4 12.9,14.4 14.4,12.9 9.4,8 "></polygon>
					</svg>
				</label>
				<div class="modal-inner">
					<div class="modal-content">
						<slot></slot>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'modal-component',
		props: [
			'checked'
		],
		data: () => {
			return {
				// checked: 'checked'
			}
		},
		created: () => {
		}
	}
</script>

<style lang="scss">
	.modal {
		.modal-check {
			display: none;

			&:checked + .modal-body {
				// animation: fadeout .2s 1 forwards, hide .1s .2s 1 forwards;
				display: none;
			}
			&:checked + .modal-body .modal-window {
				// animation: zoomout .2s 1 forwards;
				display: none;
			}
		}

		.modal-body {
			position: fixed;
			display: flex;
			align-items: center;
			justify-content: center;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, 0.3);
			z-index: 100000;
		}

		.modal-window {
			position: relative;
			z-index: 100001;
			animation: fadein .3s 1, zoomin .3s 1;

			.modal-label {
				position: absolute;
				top: -20px;
				right: 5px;
				display: flex;
				align-items: center;
				justify-content: center;
				line-height: 1;
				background: #999;
				border-radius: 50%;
				width: 40px;
				height: 40px;
				cursor: pointer;
				transition: all .2s ease;

				svg {
					display: flex;
					align-items: center;
					fill: #fff;
				}
			}

			.modal-inner {
				width: 80vw;
				max-width: 500px;
				background: #fff;
				border-radius: 3px;
				box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

				.modal-content {
					color: #666;
					padding: 16px 20px 20px;

					h2 {
						margin: 10px 0;
					}
				}
			}
		}
	}

	@keyframes fadein {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes fadeout {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes zoomin {
		0% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes zoomout {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0.9);
		}
	}
	@keyframes hide {
		0% {
			visibility: visible;
		}
		100% {
			visibility: hidden;
		}
	}
</style>
