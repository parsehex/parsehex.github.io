import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
	const [footerConfig, setFooterConfig] = useState<any>({});

	useEffect(() => {
		const loadConfig = async () => {
			let configData: any = null;
			try {
				// Try to load config.user.json first
				const userConfigResponse = await fetch('/config.user.json');
				if (userConfigResponse.ok) {
					configData = await userConfigResponse.json();
				}
				// oxlint-disable-next-line no-unused-vars
			} catch (error) {
				// Fall back to config.json
				try {
					const configResponse = await fetch('/config.json');
					if (configResponse.ok) {
						configData = await configResponse.json();
					}
				} catch (error) {
					console.error('Error loading config:', error);
				}
			}
			setFooterConfig(configData?.footer || {});
		};

		loadConfig();
	}, []);

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
						href="https://github.com/GitCase-app/GitCase"
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
