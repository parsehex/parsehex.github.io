import { useState, useEffect } from 'react';
import repos from './repos.json';
import {
	FaCalendarAlt,
	FaClock,
	FaSort,
	FaSortDown,
	FaSortUp,
} from 'react-icons/fa';

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const sortOptions = [
	{ key: 'pushed_at', label: 'Last Pushed' },
	{ key: 'updated_at', label: 'Last Updated' },
	{ key: 'created_at', label: 'Created' },
];

function App() {
	// Load saved sort settings or default to uninitialized
	const [sortBy, setSortBy] = useState<string | null>(
		() => localStorage.getItem('sortBy') || null
	);
	const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>(
		() => (localStorage.getItem('sortOrder') as '' | 'asc' | 'desc') || ''
	);

	// Save sorting state to localStorage whenever it changes
	useEffect(() => {
		if (sortBy) {
			localStorage.setItem('sortBy', sortBy);
		} else {
			localStorage.removeItem('sortBy');
		}
		localStorage.setItem('sortOrder', sortOrder);
	}, [sortBy, sortOrder]);

	const handleSortChange = (key: string) => {
		if (sortBy === key) {
			// Cycle between 'asc', 'desc', and '' (no sorting)
			setSortOrder((prev) =>
				prev === 'desc' ? 'asc' : prev === 'asc' ? '' : 'desc'
			);
		} else {
			setSortBy(key);
			// Preserve existing sortOrder unless it's uninitialized
			setSortOrder((prev) => (prev === '' ? 'desc' : prev));
		}
	};

	const repoList = repos.filter((r) => r.homepage);
	if (sortBy && sortOrder) {
		repoList.sort((a, b) => {
			const timeA = new Date(a[sortBy]).getTime();
			const timeB = new Date(b[sortBy]).getTime();
			return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
		});
	}

	return (
		<div className="container mx-auto p-6">
			<header className="text-center py-8 flex items-center justify-center">
				<img
					src="https://github.com/parsehex.png"
					alt="GitHub Avatar"
					className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600"
				/>
				<div className="flex flex-col text-left pl-4">
					<h1 className="text-4xl font-bold">
						<a
							href="https://github.com/parsehex"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-500 dark:hover:text-blue-400"
						>
							parsehex
						</a>
						's Sites
					</h1>
					<p className="text-lg mt-2 text-gray-600 dark:text-gray-400">
						A list of my projects that have a GitHub Pages site.
					</p>
				</div>
			</header>

			<div className="flex justify-end mb-4">
				<button
					onClick={() => handleSortChange(sortBy || 'pushed_at')}
					className="flex items-center py-1 px-2 mr-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
				>
					{!sortOrder ? (
						<FaSort />
					) : sortOrder === 'asc' ? (
						<FaSortUp />
					) : (
						<FaSortDown />
					)}
				</button>

				<label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
					<span>Sort by:</span>
					<select
						value={sortBy || ''}
						onChange={(e) => handleSortChange(e.target.value)}
						className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
					>
						{sortOptions.map((option) => (
							<option key={option.key} value={option.key}>
								{option.label}
							</option>
						))}
					</select>
				</label>
			</div>

			<main className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{repoList.map((repo) => (
					<div
						key={repo.id}
						className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 hover:shadow-xl dark:hover:shadow-lg transition flex flex-col"
					>
						<h2 className="text-2xl font-semibold mb-2">
							<a
								href={repo.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-500 dark:hover:text-blue-400"
							>
								{repo.name}
							</a>
						</h2>
						<p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
							{repo.description || 'No description provided.'}
						</p>

						<div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
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
							className="text-blue-500 dark:text-blue-400 font-bold hover:border-b self-start"
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
