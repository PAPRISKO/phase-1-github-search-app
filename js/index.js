document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search-input");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");
    const toggleSearchBtn = document.getElementById("toggle-search");

    let searchType = "user"; // Default to searching for users

    // Toggle search type
    toggleSearchBtn.addEventListener("click", () => {
        searchType = searchType === "user" ? "repo" : "user";
        searchInput.placeholder = searchType === "user" ? "Search GitHub Users" : "Search GitHub Repositories";
        toggleSearchBtn.textContent = searchType === "user" ? "Search Repos" : "Search Users";
    });

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        if (searchType === "user") {
            searchUsers(query);
        } else {
            searchRepositories(query);
        }
    });

    // Search for users
    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = "";
            reposList.innerHTML = "";

            data.items.forEach(user => {
                const userItem = document.createElement("li");
                userItem.innerHTML = `
                    <img src="${user.avatar_url}" width="50" height="50" />
                    <a href="${user.html_url}" target="_blank">${user.login}</a>
                    <button class="view-repos" data-username="${user.login}">View Repos</button>
                `;
                userList.appendChild(userItem);

                // Add event listener for viewing repos
                userItem.querySelector(".view-repos").addEventListener("click", () => fetchUserRepos(user.login));
            });
        })
        .catch(error => console.error("Error fetching users:", error));
    }

    // Fetch and display a user's repositories
    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(repos => {
            reposList.innerHTML = `<h3>Repositories for ${username}:</h3>`;
            repos.forEach(repo => {
                const repoItem = document.createElement("li");
                repoItem.innerHTML = `
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                `;
                reposList.appendChild(repoItem);
            });
        })
        .catch(error => console.error("Error fetching repos:", error));
    }

    // Search for repositories by keyword
    function searchRepositories(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = "";
            reposList.innerHTML = `<h3>Repository Search Results:</h3>`;

            data.items.forEach(repo => {
                const repoItem = document.createElement("li");
                repoItem.innerHTML = `
                    <a href="${repo.html_url}" target="_blank">${repo.full_name}</a> - ⭐ ${repo.stargazers_count}
                `;
                reposList.appendChild(repoItem);
            });
        })
        .catch(error => console.error("Error fetching repositories:", error));
    }
});
