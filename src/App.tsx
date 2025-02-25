import { useState, useEffect } from 'react';
import repos from './repos.json';
import langColors from './colors.json';
import {
	FaCalendarAlt,
	FaClock,
	FaSort,
	FaSortDown,
	FaSortUp,
	FaStar,
	FaCodeBranch,
	FaLink,
} from 'react-icons/fa';
import { formatDistanceToNow, parseISO, isBefore, subWeeks } from 'date-fns';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

interface LangColor {
	color: string;
	url: string;
}

interface Repo {
	id: number;
	name: string;
	description: string;
	language: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	homepage: string;
	pulls_url: string;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	latest_update?: {
		label: string;
		value: string;
	};
	[key: string]: unknown;
}

const getColor = (lang: string) => {
	// @ts-expect-error n/a
	const c = langColors[lang] as LangColor;
	return c.color;
};

// https://stackoverflow.com/a/11868398
// http://24ways.org/2010/calculating-color-contrast
const getContrastYIQ = (hexcolor: string) => {
	const r = parseInt(hexcolor.substring(1, 3), 16);
	const g = parseInt(hexcolor.substring(3, 5), 16);
	const b = parseInt(hexcolor.substring(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? 'black' : 'white';
};

const formatDate = (dateStr: string, long = false) => {
	const date = new Date(dateStr);
	const cfg = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	} as Intl.DateTimeFormatOptions;
	if (long) {
		Object.assign(cfg, {
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: 'short',
		});
	}
	return date.toLocaleDateString(undefined, cfg);
};

const relativeDate = (dateStr: string) => {
	return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
};

const showRelativeTime = (dateStr: string) => {
	const date = new Date(dateStr);
	return isBefore(date, subWeeks(new Date(), 1))
		? formatDate(dateStr)
		: relativeDate(dateStr);
};

const sortOptions = [
	{ key: 'pushed_at', label: 'Last Pushed' },
	{ key: 'updated_at', label: 'Last Updated' },
	{ key: 'created_at', label: 'Created' },
];

function App() {
	const [sortBy, setSortBy] = useState<string | null>(
		() => localStorage.getItem('sortBy') || null
	);
	const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>(
		() => (localStorage.getItem('sortOrder') as '' | 'asc' | 'desc') || ''
	);

	useEffect(() => {
		if (sortBy) {
			localStorage.setItem('sortBy', sortBy);
		} else {
			localStorage.removeItem('sortBy');
		}
		localStorage.setItem('sortOrder', sortOrder);
	}, [sortBy, sortOrder]);

	useEffect(() => {
		tippy('[data-tooltip]', {
			content: (el) => el.getAttribute('data-tooltip') as string,
		});
	}, []);

	const handleSortChange = (key: string) => {
		if (sortBy === key) {
			setSortOrder((prev) =>
				prev === 'desc' ? 'asc' : prev === 'asc' ? '' : 'desc'
			);
		} else {
			setSortBy(key);
			setSortOrder((prev) => (prev === '' ? 'desc' : prev));
		}
	};

	const repoList = repos.filter((r) => r.homepage) as Repo[];
	if (sortBy && sortOrder) {
		repoList.sort((a, b) => {
			const timeA = new Date(a[sortBy] as string).getTime();
			const timeB = new Date(b[sortBy] as string).getTime();
			return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
		});
	}

	// TODO restructure to do better
	for (const repo of repoList) {
		const updated = new Date(repo.updated_at);
		const pushed = new Date(repo.pulls_url);
		if (isBefore(updated, pushed)) {
			repo.latest_update = {
				label: 'Last Push',
				value: repo.pushed_at,
			};
		} else {
			repo.latest_update = {
				label: 'Last Update',
				value: repo.updated_at,
			};
		}
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
				<button
					onClick={() => handleSortChange(sortBy || 'pushed_at')}
					className="flex items-center py-1 px-2 ml-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
				>
					{!sortOrder ? (
						<FaSort />
					) : sortOrder === 'asc' ? (
						<FaSortUp />
					) : (
						<FaSortDown />
					)}
				</button>
			</div>

			<main className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{repoList.map((repo) => (
					<div
						key={repo.id}
						className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 hover:shadow-xl dark:hover:shadow-lg transition flex flex-col"
					>
						<h2 className="flex items-center text-2xl font-semibold mb-2">
							<a
								href={repo.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-500 dark:hover:text-blue-400"
							>
								{repo.name}
							</a>

							{repo.language && (
								<span
									className="inline-flex items-center px-2 py-1 ml-4 text-xs font-semibold rounded bg-gray-200 dark:bg-gray-700"
									style={{
										backgroundColor: getColor(repo.language),
										color: getContrastYIQ(getColor(repo.language)),
									}}
								>
									{repo.language}
								</span>
							)}
						</h2>
						<p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
							{repo.description || 'No description provided.'}
						</p>

						<div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
							<div className="flex items-center gap-2 flex-wrap">
								<FaClock />
								<span
									data-tooltip={formatDate(repo.pushed_at, true)}
									className="relative"
								>
									{repo.latest_update?.label}:{' '}
									{repo.latest_update &&
										showRelativeTime(repo.latest_update.value)}
								</span>
							</div>

							{repo.created_at && (
								<div className="flex items-center gap-2 flex-wrap">
									<FaCalendarAlt />
									<span
										data-tooltip={formatDate(repo.created_at, true)}
										className="relative"
									>
										Created: {showRelativeTime(repo.created_at)}
									</span>
								</div>
							)}
						</div>

						<div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 text-sm mt-auto">
							{repo.stargazers_count > 0 && (
								<div className="flex items-center gap-1">
									<FaStar className="text-yellow-500" />
									<span>{repo.stargazers_count}</span>
								</div>
							)}
							{repo.forks_count > 0 && (
								<div className="flex items-center gap-1">
									<FaCodeBranch />
									<span>{repo.forks_count}</span>
								</div>
							)}
							{repo.homepage && (
								<a
									href={repo.homepage}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:border-b"
								>
									<FaLink />
									<span>{repo.homepage}</span>
								</a>
							)}
						</div>
					</div>
				))}
			</main>
		</div>
	);
}

export default App;
