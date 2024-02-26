<template>
	<transition name="vac-slide-up">
		<div v-if="files.length">
			<div
				v-if="isFileLimitExceeded"
				class="vac-room-file_limit-exceeded-warning"
			>
				<svg-icon class="vac-icon-warning" name="warning" />
				Sorry, only {{ maxFiles }} files are allowed to be uploaded at a time.
				We've automatically adjusted your selection to fit this limit.
			</div>
			<div class="vac-room-files-container">
				<div class="vac-files-box">
					<div v-for="(file, i) in files" :key="i">
						<room-file
							:file="file"
							:index="i"
							@remove-file="$emit('remove-file', $event)"
						>
							<template v-for="(idx, name) in $slots" #[name]="data">
								<slot :name="name" v-bind="data" />
							</template>
						</room-file>
					</div>
				</div>

				<div class="vac-icon-close">
					<div class="vac-svg-button" @click="$emit('reset-message')">
						<slot name="files-close-icon">
							<svg-icon name="close-outline" />
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import SvgIcon from '../../../../components/SvgIcon/SvgIcon'

import RoomFile from './RoomFile/RoomFile'

export default {
	name: 'RoomFiles',
	components: {
		SvgIcon,
		RoomFile
	},

	props: {
		files: { type: Array, required: true },
		isFileLimitExceeded: { type: Boolean, required: true },
		maxFiles: { type: Number, required: true }
	},

	emits: ['remove-file', 'reset-message']
}
</script>
