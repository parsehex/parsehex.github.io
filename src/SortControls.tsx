import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import type { SortOption } from './types';

interface SortControlsProps {
	sortBy: string;
	sortOrder: '' | 'asc' | 'desc';
	sortOptions: SortOption[];
	onSortChange: (key: string) => void;
}

export function SortControls({
	sortBy,
	sortOrder,
	sortOptions,
	onSortChange,
}: SortControlsProps) {
	return (
		<div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
			<label>
				Sort by:
				<select
					value={sortBy || 'latest_update'}
					onChange={(e) => onSortChange(e.target.value)}
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
				onClick={() => onSortChange(sortBy || 'latest_update')}
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
	);
}
