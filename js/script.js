// const this_url = 'https://patelka2211.github.io/RepoList';
const this_url = "https://Hardijoisar.github.io/RepoList";
const username_regex = /.*\/\/(.*?)\.github\.io\/.*/;
const document_title = document.title;
if (username_regex.test(this_url)) {
    const username = username_regex.exec(this_url)[1];
    // User root data
    fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then(
            // data => console.log(data)
            // .avatar_url
            (data_json) => {
                // const opengraph_tags = document.querySelectorAll('.opengraph_image');
                // opengraph_tags.forEach(element => {
                //     element.content = `${data_json.avatar_url}`;
                // });

                const name = data_json["name"] != null ? data_json.name : username;
                set_repeated_data("opengraph_image", "content", data_json.avatar_url);
                // console.log(opengraph_tags[0].content);

                console.log(`About ${name}`);
            }
        );
    // User repo data
    set_repeated_data(
        "title",
        "content",
        "Kartavya Patel has 3 public repository on GitHub."
    );
}

function set_repeated_data(class_name, attribute, value) {
    const selected_tags = document.querySelectorAll(`.${class_name}`);
    selected_tags.forEach((tag) => {
        tag[attribute] = `${value}`;
    });
}

// const json_data = {
//     login: "patelka2211",
//     id: 82671701,
//     node_id: "MDQ6VXNlcjgyNjcxNzAx",
//     avatar_url: "https://avatars.githubusercontent.com/u/82671701?v=4",
//     gravatar_id: "",
//     url: "https://api.github.com/users/patelka2211",
//     html_url: "https://github.com/patelka2211",
//     followers_url: "https://api.github.com/users/patelka2211/followers",
//     following_url: "https://api.github.com/users/patelka2211/following{/other_user}",
//     gists_url: "https://api.github.com/users/patelka2211/gists{/gist_id}",
//     starred_url: "https://api.github.com/users/patelka2211/starred{/owner}{/repo}",
//     subscriptions_url: "https://api.github.com/users/patelka2211/subscriptions",
//     organizations_url: "https://api.github.com/users/patelka2211/orgs",
//     repos_url: "https://api.github.com/users/patelka2211/repos",
//     events_url: "https://api.github.com/users/patelka2211/events{/privacy}",
//     received_events_url: "https://api.github.com/users/patelka2211/received_events",
//     type: "User",
//     site_admin: false,
//     name: "Kartavya Patel",
//     company: null,
//     blog: "",
//     location: null,
//     email: null,
//     hireable: null,
//     bio: null,
//     twitter_username: null,
//     public_repos: 3,
//     public_gists: 0,
//     followers: 4,
//     following: 8,
//     created_at: "2021-04-16T16:53:13Z",
//     updated_at: "2022-05-07T17:20:06Z",
// };