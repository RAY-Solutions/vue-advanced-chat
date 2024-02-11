<template>
	<transition name="vac-slide-up">
		<div v-if="messageReply" class="vac-reply-container">
			<div class="vac-reply-box">
				<div class="vac-reply-info">
					<div class="vac-reply-username">
						{{ messageReply.username }}
					</div>
					<div class="vac-reply-content">
						<format-message
							:message-id="messageReply._id"
							:content="messageReply.content"
							:users="room.users"
							:text-formatting="textFormatting"
							:link-options="linkOptions"
							:reply="true"
						/>
					</div>
				</div>

				<img v-if="isImage" :src="firstFile.url" class="vac-image-reply" />

				<video v-else-if="isVideo" controls class="vac-image-reply">
					<source :src="firstFile.url" />
				</video>

				<audio-player
					v-else-if="isAudio"
					:src="firstFile.url"
					:message-selection-enabled="false"
					class="vac-audio-reply"
				>
					<template v-for="(idx, name) in $slots" #[name]="data">
						<slot :name="name" v-bind="data" />
					</template>
				</audio-player>

				<div v-else-if="isOtherFile" class="vac-image-reply vac-file-container">
					<div>
						<slot name="file-icon">
							<svg-icon name="file" />
						</slot>
					</div>
					<div class="vac-text-ellipsis">
						{{ ellipsisInMiddle(firstFile.name) }}
					</div>
					<div
						v-if="firstFile.extension || firstFile.size"
						class="vac-text-ellipsis vac-text-extension"
					>
						{{ fileMetaData(firstFile) }}
					</div>
				</div>
			</div>

			<div class="vac-icon-reply">
				<div class="vac-svg-button" @click="$emit('reset-message')">
					<slot name="reply-close-icon">
						<svg-icon name="close-outline" />
					</slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../../components/FormatMessage/FormatMessage'

import AudioPlayer from '../../RoomMessage/AudioPlayer/AudioPlayer'

import {
	isAudioFile,
	isImageFile,
	isVideoFile
} from '../../../../utils/media-file'
import { ellipsisInMiddle } from '../../../../utils/ellipsis-in-middle'
import { humanFileSize } from '../../../../utils/human-file-size'

export default {
	name: 'RoomMessageReply',
	components: {
		SvgIcon,
		FormatMessage,
		AudioPlayer
	},

	props: {
		room: { type: Object, required: true },
		messageReply: { type: Object, default: null },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true }
	},

	emits: ['reset-message'],

	computed: {
		firstFile() {
			return this.messageReply?.files?.length ? this.messageReply.files[0] : {}
		},
		isImage() {
			return isImageFile(this.firstFile)
		},
		isVideo() {
			return isVideoFile(this.firstFile)
		},
		isAudio() {
			return isAudioFile(this.firstFile)
		},
		isOtherFile() {
			return (
				this.messageReply?.files?.length &&
				!this.isAudio &&
				!this.isVideo &&
				!this.isImage
			)
		}
	},

	methods: {
		fileMetaData(file) {
			if (file.extension && file.size) {
				return `${ellipsisInMiddle(file.extension)} | ${humanFileSize(
					file.size
				)}`
			} else if (file.extension) {
				return ellipsisInMiddle(file.extension)
			} else if (file.size) {
				return humanFileSize(file.size)
			}
		},
		ellipsisInMiddle: ellipsisInMiddle
	}
}
</script>
