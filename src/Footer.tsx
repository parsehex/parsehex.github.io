import React from 'react';
import config from '../config.json';

const Footer: React.FC = () => {
	// Get footer settings from config.
	const footerConfig = config.footer || {};
	// Optional custom text to display on its own line if provided.
	const footerText = footerConfig.text || '';
	// Whether to include the GitCase link
	const includeGitCaseLink = footerConfig.includeGitCaseLink !== false;

	return (
		<footer className="mt-8 text-center text-gray-600 dark:text-gray-400">
			{footerText && <p>{footerText}</p>}
			<p className="text-xs">
				Showcase your GitHub repositories with{' '}
				{includeGitCaseLink ? (
					<a
						href="https://github.com/gitcase"
						target="_blank"
						rel="noopener noreferrer"
						className="underline hover:text-blue-500"
					>
						GitCase
					</a>
				) : (
					'GitCase'
				)}
			</p>
		</footer>
	);
};

export default Footer;
