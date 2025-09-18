import { useState, useEffect } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { Hero } from './Hero';
import repos from './repos.json';
import config from '../config.json';
import Header from './Header';
import Footer from './Footer';
import { ReadmeModal } from './ReadmeModal';
import { ReadmeManifestItem, Repo, SortOption } from './types';
import { SortControls } from './SortControls';
import { ViewToggle } from './ViewToggle';
import { RepoCard } from './RepoCard';

const sortOptions = [
	{ key: 'pushed_at', label: 'Pushed' },
	{ key: 'updated_at', label: 'Updated' },
	{ key: 'created_at', label: 'Created' },
] as SortOption[];

function App() {
	const githubUsername: string =
		import.meta.env.VITE_GITHUB_ACTOR || 'your_username';

	const [sortBy, setSortBy] = useState<string>(
		() => localStorage.getItem('sortBy') || 'latest_update'
	);
	const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>(
		() => (localStorage.getItem('sortOrder') as '' | 'asc' | 'desc') || ''
	);

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

	const viewClassCommon = 'container mx-auto gap-4 grid grid-cols-1';
	const viewClass =
		view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

	return (
		<div className="mx-auto p-4">
			{config.header && <Header />}

			{heroMd && <Hero source={heroMd} />}

			<div className="container mx-auto flex justify-between mb-4">
				<SortControls
					sortBy={sortBy}
					sortOptions={sortOptions}
					sortOrder={sortOrder}
					onSortChange={handleSortChange}
				/>

				<ViewToggle view={view} onViewChange={setView} />
			</div>

			<main className={viewClassCommon + ' ' + viewClass}>
				{repoList.map((repo) => (
					<RepoCard
						key={repo.id}
						repo={repo}
						view={view}
						readmeManifest={readmeManifest}
						onReadmeClick={openReadmeModal}
					/>
				))}
			</main>

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
