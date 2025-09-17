import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ReadmeModalProps {
	isOpen: boolean;
	onClose: () => void;
	repoName: string;
	readmeContent: string | null;
}

export function ReadmeModal({
	isOpen,
	onClose,
	repoName,
	readmeContent,
}: ReadmeModalProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
		} else {
			const timer = setTimeout(() => setIsVisible(false), 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!isVisible) return null;

	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
				isOpen ? 'opacity-100' : 'opacity-0'
			}`}
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						README - {repoName}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					{readmeContent ? (
						<div className="prose dark:prose-invert max-w-none">
							<ReactMarkdown>{readmeContent}</ReactMarkdown>
						</div>
					) : (
						<div className="text-center text-gray-500 dark:text-gray-400 py-8">
							<p>No README available for this repository.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
