import repos from './repos.json';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

function App() {
	const repoList = repos.filter((r) => r.homepage);
	repoList.sort((a, b) => {
		const pushA = new Date(a.pushed_at).getTime();
		const pushB = new Date(b.pushed_at).getTime();
		const updateA = new Date(a.updated_at).getTime();
		const updateB = new Date(b.updated_at).getTime();
		const createdA = new Date(a.created_at).getTime();
		const createdB = new Date(b.created_at).getTime();

		// Sort by pushed_at, then updated_at, then created_at
		if (pushB - pushA !== 0) {
			return pushB - pushA;
		}

		if (updateB - updateA !== 0) {
			return updateB - updateA;
		}

		return createdB - createdA;
	});

	return (
		<div className="container mx-auto p-6">
			<header className="text-center py-8">
				<h1 className="text-4xl font-bold">
					<a
						href="https://github.com/parsehex"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-blue-500"
					>
						parsehex
					</a>
					's Sites
				</h1>
				<p className="text-lg mt-2 text-gray-600">
					A list of my projects that have a GitHub pages site.
				</p>
			</header>

			<main className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{repoList.map((repo) => (
					<div
						key={repo.id}
						className="bg-white shadow-md rounded p-4 hover:shadow-xl transition"
					>
						<h2 className="text-2xl font-semibold mb-2">
							<a
								href={repo.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-500"
							>
								{repo.name}
							</a>
						</h2>
						<p className="text-gray-700 mb-4">
							{repo.description || 'No description provided.'}
						</p>

						<div className="text-sm text-gray-500 mb-4 space-y-1">
							{repo.created_at && (
								<div className="flex items-center">
									<FaCalendarAlt className="mr-1" />
									<span>Created: {formatDate(repo.created_at)}</span>
								</div>
							)}
							{repo.updated_at && (
								<div className="flex items-center">
									<FaClock className="mr-1" />
									<span>Updated: {formatDate(repo.updated_at)}</span>
								</div>
							)}
							{repo.pushed_at && (
								<div className="flex items-center">
									<FaClock className="mr-1" />
									<span>Pushed: {formatDate(repo.pushed_at)}</span>
								</div>
							)}
						</div>

						<a
							href={repo.homepage || repo.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 font-bold hover:border-b"
						>
							Go to {repo.homepage || repo.html_url}
						</a>
					</div>
				))}
			</main>
		</div>
	);
}

export default App;
