/**
 * Filters the fetched GitHub repositories based on desired criteria.
 * Customize this function to change which repos are included in the showcase.
 *
 * @param {Array} data - The raw array of repository objects from GitHub API
 * @returns {Array} The filtered array of repositories
 */
export function getFilteredRepos(data) {
	// Default filter: keeps repos with a homepage URL

	// ! Only 1 `return` line below should be active!

	// == Filters ==
	// naming convention - only repos starting with "portfolio-"
	// return data.filter(repo => repo.name.startsWith('portfolio-'));

	// repos with a homepage URL + a description
	return data.filter(repo => repo.homepage && repo.description);

	// repos with a homepage URL
	//return data.filter((repo) => repo.homepage);
}
