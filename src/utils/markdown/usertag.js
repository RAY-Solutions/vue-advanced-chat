import { visit } from 'unist-util-visit'
export default function usertag(users) {
	return tree => {
		visit(tree, 'text', (node, index, parent) => {
			const matches = [] // Use a regex to find all occurrences of your custom syntax
			const regex = /<#([a-zA-Z0-9]+)>/g
			let match

			while ((match = regex.exec(node.value)) !== null) {
				matches.push({
					index: match.index,
					lastIndex: regex.lastIndex,
					userId: match[1]
				})
			}

			if (matches.length > 0) {
				// Split the text node into multiple nodes, inserting your custom nodes for user tags
				const nodes = []
				let startIndex = 0

				matches.forEach(match => {
					if (startIndex !== match.index) {
						// Add the text before the match as a new text node
						nodes.push({
							type: 'text',
							value: node.value.slice(startIndex, match.index)
						})
					}

					// Add your custom node for the user tag
					const user = users.find(user => user._id === match.userId)
					const username = user ? user.username : match.userId
					nodes.push({
						type: 'html',
						value: `<span class="vac-text-tag" data-user-id="${match.userId}">@${username}</span>`
					})

					startIndex = match.lastIndex
				})
				// Add any remaining text as a new text node
				if (startIndex < node.value.length) {
					nodes.push({ type: 'text', value: node.value.slice(startIndex) })
				}

				// Replace the original text node with the sequence of new nodes
				parent.children.splice(index, 1, ...nodes)
			}
		})
	}
}
