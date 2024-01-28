<template>
	<div class="vac-reply-message">
		<div class="vac-reply-username">
			{{ replyUsername }}
		</div>

		<div v-if="isImage" class="vac-image-reply-container">
			<div
				class="vac-message-image vac-message-image-reply"
				:style="{
					'background-image': `url('${firstFile.url}')`
				}"
			/>
		</div>

		<div v-else-if="isVideo" class="vac-video-reply-container">
			<video controls>
				<source :src="firstFile.url" />
			</video>
		</div>

		<audio-player
			v-else-if="isAudio"
			:src="firstFile.url"
			:message-selection-enabled="false"
			@update-progress-time="progressTime = $event"
			@hover-audio-progress="hoverAudioProgress = $event"
		>
			<template v-for="(idx, name) in $slots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</audio-player>

		<div v-else-if="isOtherFile" class="vac-file-container">
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

		<div class="vac-reply-content">
			<format-message
				:message-id="message.replyMessage._id"
				:content="message.replyMessage.content"
				:users="roomUsers"
				:text-formatting="textFormatting"
				:link-options="linkOptions"
				:reply="true"
			/>
		</div>
	</div>
</template>

<script>
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'
import FormatMessage from '../../../../components/FormatMessage/FormatMessage'

import AudioPlayer from '../AudioPlayer/AudioPlayer'

import {
	isAudioFile,
	isImageFile,
	isVideoFile
} from '../../../../utils/media-file'
import { ellipsisInMiddle } from '../../../../utils/ellipsis-in-middle'
import { humanFileSize } from '../../../../utils/human-file-size'

export default {
	name: 'MessageReply',
	components: { AudioPlayer, SvgIcon, FormatMessage },

	props: {
		message: { type: Object, required: true },
		textFormatting: { type: Object, required: true },
		linkOptions: { type: Object, required: true },
		roomUsers: { type: Array, required: true }
	},

	computed: {
		replyUsername() {
			const { senderId } = this.message.replyMessage
			const replyUser = this.roomUsers.find(user => user._id === senderId)
			return replyUser ? replyUser.username : ''
		},
		firstFile() {
			return this.message.replyMessage?.files?.length
				? this.message.replyMessage.files[0]
				: {}
		},
		isAudio() {
			return isAudioFile(this.firstFile)
		},
		isImage() {
			return isImageFile(this.firstFile)
		},
		isVideo() {
			return isVideoFile(this.firstFile)
		},
		isOtherFile() {
			return (
				this.message.replyMessage.files?.length &&
				!this.isAudio &&
				!this.isVideo &&
				!this.isImage
			)
		}
	},

	methods: {
		fileMetaData(file) {
			if (file.extension && file.size) {
				return `${file.extension} | ${humanFileSize(file.size)}`
			} else if (file.extension) {
				return file.extension
			} else if (file.size) {
				return humanFileSize(file.size)
			}
		},
		ellipsisInMiddle: ellipsisInMiddle
	}
}
</script>
