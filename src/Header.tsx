import 'tippy.js/dist/tippy.css';

function Header() {
	const githubUsername: string =
		import.meta.env.VITE_GITHUB_ACTOR || 'your_username';

	return (
		<header className="text-center py-4 flex items-center justify-center">
			<img
				src="/avatar.png"
				alt="GitHub Avatar"
				className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center"
			/>
			<div className="flex flex-col text-left pl-4">
				<h1 className="text-4xl font-bold">
					<a
						href={`https://github.com/${githubUsername}`}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-blue-500 dark:hover:text-blue-400"
					>
						{githubUsername}
					</a>
					's Sites
				</h1>
				<p className="text-lg mt-2 text-gray-600 dark:text-gray-400">
					A list of my projects that have a GitHub Pages site.
				</p>
			</div>
		</header>
	);
}

export default Header;
