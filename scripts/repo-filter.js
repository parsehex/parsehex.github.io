/**
 * Filters the fetched GitHub repositories based on desired criteria.
 * Customize this function to change which repos are included in the showcase.
 *
 * @param {Array} data - The raw array of repository objects from GitHub API
 * @returns {Array} The filtered array of repositories
 */
export function getFilteredRepos(data) {
	// Default filter: keeps repos with a homepage
	// If you want to filter repos by a naming convention, use e.g.:
	// return data.filter(repo => repo.name.startsWith('portfolio-'));
	return data.filter((repo) => repo.homepage);
}
