const search = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-box");
const userGrid = document.querySelector(".user-grid");
const cardTemplate = document.querySelector("#user-card-template");
const message = document.querySelector(".message");

searchForm.addEventListener("submit", getUser);

async function getUser(event) {
  event.preventDefault();

  const searchUser = search.value.trim();

  if (!searchUser) {
    message.textContent = "Enter a GitHub username to search.";
    userGrid.innerHTML = "";
    return;
  }

  userGrid.innerHTML = "";
  message.textContent = "Searching...";

  try {
    const response = await fetch(
      `/api/github/search?q=${encodeURIComponent(searchUser)}`
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Could not search users.");
    }

    if (responseData.items.length === 0) {
      message.textContent = "No users found.";
      return;
    }

    const users = await Promise.all(
      responseData.items.map(async (user) => {
        const profileResponse = await fetch(
          `/api/github/users/${encodeURIComponent(user.login)}`
        );
        const profile = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profile.message || "Could not load a user profile.");
        }

        return profile;
      })
    );

    users.forEach(showUser);
    message.textContent = `Showing ${users.length} users.`;
  } catch (error) {
    console.log(error);
    message.textContent = error.message || "Something went wrong. Try again.";
  }
}

function showUser(user) {
  const card = cardTemplate.content.cloneNode(true);

  card.querySelector(".login").textContent = user.name || user.login;
  card.querySelector(".user-name").textContent = `@${user.login}`;
  card.querySelector(".bio").textContent = user.bio || "No bio added.";
  card.querySelector(".repo-number").textContent = user.public_repos;
  card.querySelector(".follower-number").textContent = user.followers;

  const avatar = card.querySelector(".avatar");
  avatar.src = user.avatar_url;
  avatar.alt = `${user.login}'s avatar`;

  const profileLink = card.querySelector(".profile-link");
  profileLink.href = user.html_url;

  userGrid.append(card);
}
