/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown, { Components } from 'react-markdown';
import config from '../config.json';

const markdownComponents: Components = {
	h1: ({ node, ...props }) => (
		<h1 className="text-4xl font-bold my-4" {...props} />
	),
	h2: ({ node, ...props }) => (
		<h2 className="text-3xl font-semibold my-3" {...props} />
	),
	h3: ({ node, ...props }) => (
		<h3 className="text-2xl font-semibold my-2" {...props} />
	),
	p: ({ node, ...props }) => <p className="my-2 text-base" {...props} />,
	ul: ({ node, ...props }) => (
		<ul className="list-disc list-inside my-2" {...props} />
	),
	ol: ({ node, ...props }) => (
		<ol className="list-decimal list-inside my-2" {...props} />
	),
	li: ({ node, ...props }) => <li className="ml-6" {...props} />,
	a: ({ node, ...props }) => (
		<a
			className="text-blue-600 dark:text-blue-400 hover:underline"
			target="_blank"
			rel="noopener noreferrer"
			{...props}
		/>
	),
	// Blockquotes
	blockquote: ({ node, ...props }) => (
		<blockquote
			className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
			{...props}
		/>
	),
};

export function Hero({ source }: { source: string }) {
	return (
		<section
			className={`hero p-6 mx-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded${
				config.hero?.center ? ' text-center' : ''
			}`}
		>
			<ReactMarkdown
				components={markdownComponents}
				children={source}
			></ReactMarkdown>
		</section>
	);
}
