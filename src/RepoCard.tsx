import {
	FaCalendarAlt,
	FaClock,
	FaStar,
	FaCodeBranch,
	FaLink,
	FaBook,
} from 'react-icons/fa';
import type { Repo, ReadmeManifestItem } from './types';
import {
	getColor,
	getContrastYIQ,
	showRelativeTime,
	formatDate,
} from './utils';

interface RepoCardProps {
	repo: Repo;
	view: 'grid' | 'list';
	readmeManifest: ReadmeManifestItem[];
	onReadmeClick: (repo: Repo) => void;
}

export function RepoCard({
	repo,
	view,
	readmeManifest,
	onReadmeClick,
}: RepoCardProps) {
	const hasReadme = readmeManifest.find(
		(item) => item.repo === repo.name && item.success
	);

	const langBadge = repo.language && (
		<span
			className="inline-flex items-center px-2 py-1 ml-4 text-xs font-semibold select-none rounded"
			style={{
				backgroundColor: getColor(repo.language),
				color: getContrastYIQ(getColor(repo.language)),
			}}
		>
			{repo.language}
		</span>
	);

	const readmeBtn = (
		<button
			onClick={() => onReadmeClick(repo)}
			className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
			title="View README"
		>
			<FaBook />
			<span>README</span>
		</button>
	);

	if (view === 'grid') {
		return (
			<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 hover:shadow-xl dark:hover:shadow-lg transition flex flex-col">
				<h2 className="flex items-center text-2xl font-semibold mb-2">
					<a
						href={repo.html_url}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-blue-500 dark:hover:text-blue-400"
					>
						{repo.name}
					</a>
					{langBadge}
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
							{repo.latest_update && showRelativeTime(repo.latest_update.value)}
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
					{hasReadme && readmeBtn}
				</div>
			</div>
		);
	}

	// List view
	return (
		<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-xl dark:hover:shadow-lg transition space-y-2">
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
					{langBadge}
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
				{hasReadme && readmeBtn}
			</div>
		</div>
	);
}
