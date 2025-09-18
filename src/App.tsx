import { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO, isBefore, subWeeks } from 'date-fns';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import {
	FaCalendarAlt,
	FaClock,
	FaSort,
	FaSortDown,
	FaSortUp,
	FaStar,
	FaCodeBranch,
	FaLink,
	FaThLarge,
	FaListUl,
	FaBook,
} from 'react-icons/fa';
import { Hero } from './Hero';
import repos from './repos.json';
import langColors from './lang-colors.json';
import config from '../config.json';
import Header from './Header';
import Footer from './Footer';
import { ReadmeModal } from './ReadmeModal';

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

interface ReadmeManifestItem {
	repo: string;
	path: string | null;
	success: boolean;
	timestamp: string;
	error?: string;
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
	{ key: 'pushed_at', label: 'Pushed' },
	{ key: 'updated_at', label: 'Updated' },
	{ key: 'created_at', label: 'Created' },
];

function App() {
	const githubUsername: string =
		import.meta.env.VITE_GITHUB_ACTOR || 'your_username';

	const [sortBy, setSortBy] = useState<string>(
		() => localStorage.getItem('sortBy') || 'latest_update'
	);
	const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>(
		() => (localStorage.getItem('sortOrder') as '' | 'asc' | 'desc') || ''
	);

	// New state: view mode for display
	const [view, setView] = useState<'grid' | 'list'>(() => {
		return (
			(localStorage.getItem('view') as 'grid' | 'list') ||
			(config.display?.view as 'grid' | 'list') ||
			'grid'
		);
	});

	const [heroMd, setHeroMd] = useState<string>('');
	const [readmeManifest, setReadmeManifest] = useState<ReadmeManifestItem[]>(
		[]
	);
	const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
	const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
	const [readmeContent, setReadmeContent] = useState<string | null>(null);

	useEffect(() => {
		tippy('[data-tooltip]', {
			content: (el) => el.getAttribute('data-tooltip') as string,
		});

		if (config.hero?.src) {
			fetch(config.hero.src)
				.then((res) => res.text())
				.then((text) => {
					setHeroMd(text);
				})
				.catch((err) => console.error('Failed to load hero markdown:', err));
		}

		// Load README manifest
		fetch('/readme-manifest.json')
			.then((res) => res.json())
			.then((data) => setReadmeManifest(data))
			.catch((err) => console.error('Failed to load README manifest:', err));
	}, []);

	useEffect(() => {
		document.title = `${githubUsername}'s Sites`;
	}, [githubUsername]);

	useEffect(() => {
		if (sortBy) {
			localStorage.setItem('sortBy', sortBy);
		} else {
			localStorage.removeItem('sortBy');
		}
		localStorage.setItem('sortOrder', sortOrder);
		localStorage.setItem('view', view);
	}, [sortBy, sortOrder, view]);

	const handleSortChange = (key: string) => {
		if (sortBy === key) {
			setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
		} else {
			setSortBy(key);
			setSortOrder((prev) => (prev === '' ? 'desc' : prev));
		}
	};

	const openReadmeModal = async (repo: Repo) => {
		setSelectedRepo(repo);
		const manifestItem = readmeManifest.find((item) => item.repo === repo.name);

		if (manifestItem?.path) {
			try {
				const response = await fetch(manifestItem.path);
				if (response.ok) {
					const content = await response.text();
					setReadmeContent(content);
				} else {
					setReadmeContent(null);
				}
			} catch (error) {
				console.error('Error loading README:', error);
				setReadmeContent(null);
			}
		} else {
			setReadmeContent(null);
		}

		setIsReadmeModalOpen(true);
	};

	const closeReadmeModal = () => {
		setIsReadmeModalOpen(false);
		setSelectedRepo(null);
		setReadmeContent(null);
	};

	const repoList = repos as Repo[];

	repoList.sort((a, b) => {
		let aVal = a[sortBy];
		let bVal = b[sortBy];
		if (sortBy === 'latest_update') {
			aVal = a[sortBy]?.value;
			bVal = b[sortBy]?.value;
		}
		const timeA = new Date(aVal as string).getTime();
		const timeB = new Date(bVal as string).getTime();
		return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
	});

	return (
		<div className="mx-auto p-4">
			{config.header && <Header />}

			{heroMd && <Hero source={heroMd} />}

			<div className="container mx-auto flex justify-between mb-4">
				<div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
					<label>
						Sort by:
						<select
							value={sortBy || 'latest_update'}
							onChange={(e) => handleSortChange(e.target.value)}
							className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-2"
						>
							{sortOptions.map((option) => (
								<option key={option.key} value={option.key}>
									{option.label}
								</option>
							))}
						</select>
					</label>
					<button
						onClick={() => handleSortChange(sortBy || 'latest_update')}
						className="flex items-center p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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

				<div className="flex items-center">
					<button
						onClick={() => setView('grid')}
						className={`py-1 px-2 rounded-l transition ${
							view === 'grid'
								? 'bg-blue-500 text-white'
								: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
						}`}
					>
						<FaThLarge />
					</button>
					<button
						onClick={() => setView('list')}
						className={`py-1 px-2 rounded-r transition ${
							view === 'list'
								? 'bg-blue-500 text-white'
								: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
						}`}
					>
						<FaListUl />
					</button>
				</div>
			</div>

			{/* Render repo list with different layout based on view */}
			{view === 'grid' ? (
				<main className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
										className="inline-flex items-center px-2 py-1 ml-4 text-xs font-semibold select-none rounded"
										style={{
											backgroundColor: getColor(repo.language),
											color: getContrastYIQ(getColor(repo.language)),
										}}
									>
										{repo.language}
									</span>
								)}
							</h2>
							<p className="text-gray-700 dark:text-gray-300 mb-2 flex-grow">
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
								{readmeManifest.find(
									(item) => item.repo === repo.name && item.success
								) && (
									<button
										onClick={() => openReadmeModal(repo)}
										className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
										title="View README"
									>
										<FaBook />
										<span>README</span>
									</button>
								)}
							</div>
						</div>
					))}
				</main>
			) : (
				// List view
				<main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
					{repoList.map((repo) => (
						<div
							key={repo.id}
							className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-xl dark:hover:shadow-lg transition space-y-2"
						>
							<div className="space-y-2">
								<h2 className="text-xl font-semibold">
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
											className="inline-flex items-center px-2 py-1 ml-4 text-xs font-semibold select-none rounded"
											style={{
												backgroundColor: getColor(repo.language),
												color: getContrastYIQ(getColor(repo.language)),
											}}
										>
											{repo.language}
										</span>
									)}
								</h2>
								<p className="text-gray-700 dark:text-gray-300">
									{repo.description || ''}
								</p>
							</div>
							<div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
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
										className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:underline"
									>
										<FaLink />
										<span>{repo.homepage}</span>
									</a>
								)}
								{readmeManifest.find(
									(item) => item.repo === repo.name && item.success
								) && (
									<button
										onClick={() => openReadmeModal(repo)}
										className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
										title="View README"
									>
										<FaBook />
										<span>README</span>
									</button>
								)}
							</div>
						</div>
					))}
				</main>
			)}

			<Footer />

			<ReadmeModal
				isOpen={isReadmeModalOpen}
				onClose={closeReadmeModal}
				repoName={selectedRepo?.name || ''}
				readmeContent={readmeContent}
			/>
		</div>
	);
}

export default App;
