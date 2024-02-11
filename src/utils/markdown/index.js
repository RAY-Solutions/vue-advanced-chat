import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeHighlight from 'rehype-highlight'
import usertag from './usertag'

export default (text, { textFormatting }) => {
	if (textFormatting) {
		const markdown = unified()
			.use(remarkParse)
			.use(usertag, textFormatting.users)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeMinifyWhitespace, { newlines: true })
			.use(rehypeStringify, {
				allowDangerousHtml: true
			})
			.use(remarkGfm)
			.use(remarkMath)
			.use(rehypeKatex)
			.use(rehypeHighlight)
			.use(rehypeExternalLinks, {
				target: '_blank',
				rel: ['noopener', 'noreferrer']
			})
			.processSync(
				text.replaceAll('<usertag>', '<#').replaceAll('</usertag>', '>')
			)
		if (textFormatting.singleLine) {
			const element = document.createElement('div')

			element.innerHTML = markdown.value

			return [
				{
					types: [],
					value: element.innerText
				}
			]
		}
		return [
			{
				types: ['markdown'],
				value: markdown.value
			}
		]
	}

	return [
		{
			types: [],
			value: text
		}
	]
}
