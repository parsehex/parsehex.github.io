import { FaThLarge, FaListUl } from 'react-icons/fa';

interface ViewToggleProps {
	view: 'grid' | 'list';
	onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
	return (
		<div className="flex items-center">
			<button
				onClick={() => onViewChange('grid')}
				className={`py-1 px-2 rounded-l transition ${
					view === 'grid'
						? 'bg-blue-500 text-white'
						: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
				}`}
			>
				<FaThLarge />
			</button>
			<button
				onClick={() => onViewChange('list')}
				className={`py-1 px-2 rounded-r transition ${
					view === 'list'
						? 'bg-blue-500 text-white'
						: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
				}`}
			>
				<FaListUl />
			</button>
		</div>
	);
}
