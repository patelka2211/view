// let username = 'patelka2211';
// fetch(`https://api.github.com/users/${username}`)
//     .then((response) => response.json())
//     .then((root) => {
//         root
//     });

let root = {
    "userid": "torvalds",
    "id": 1024025,
    "node_id": "MDQ6VXNlcjEwMjQwMjU=",
    "avatar_url": "https://avatars.githubusercontent.com/u/1024025?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/torvalds",
    "html_url": "https://github.com/torvalds",
    "followers_url": "https://api.github.com/users/torvalds/followers",
    "following_url": "https://api.github.com/users/torvalds/following{/other_user}",
    "gists_url": "https://api.github.com/users/torvalds/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/torvalds/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/torvalds/subscriptions",
    "organizations_url": "https://api.github.com/users/torvalds/orgs",
    "repos_url": "https://api.github.com/users/torvalds/repos",
    "events_url": "https://api.github.com/users/torvalds/events{/privacy}",
    "received_events_url": "https://api.github.com/users/torvalds/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Linus Torvalds",
    "company": "Linux Foundation",
    "blog": "",
    "location": "Portland, OR",
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 6,
    "public_gists": 0,
    "followers": 158154,
    "following": 0,
    "created_at": "2011-09-03T15:26:22Z",
    "updated_at": "2022-04-13T01:52:01Z"
};


console.log(root.hasOwnProperty('name') && root.name != null);
console.log(root.hasOwnProperty('location') && root.location != null);
console.log(root.hasOwnProperty('company') && root.company != null);
console.log(root.hasOwnProperty('twitter_username') && root.twitter_username != null);
console.log(root.hasOwnProperty('email') && root.email != null);
console.log(root.hasOwnProperty('public_repos') && root.public_repos != null);
console.log(root.hasOwnProperty('public_gists') && root.public_gists != null);
console.log(root.hasOwnProperty('followers') && root.followers != null);
console.log(root.hasOwnProperty('following') && root.following != null);
console.log(root.hasOwnProperty('created_at') && root.created_at != null);
console.log(root.hasOwnProperty('updated_at') && root.updated_at != null);