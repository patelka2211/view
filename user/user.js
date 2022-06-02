document.title = `${uname}/about`;

class user {
    constructor(uname) {
        this.uname = uname;
        this.time_interval_minutes = 5;
        this.ss = sessionStorage;
        this.url = `https://api.github.com/users/${uname}`;
    }

    has_been_stored() {
        if (this.ss.hasOwnProperty(`${this.uname}_user`)) {
            return true;
        }
        return false;
    }

    check_validity() {
        if (!this.has_been_stored()) {
            return true;
        }
        if (
            new Date().getTime() <
            new Date(JSON.parse(this.ss.getItem(`${this.uname}_user`)).timestamp + this.time_interval_minutes * 60000)
        ) {
            return false;
        }
        return true;
    }

    main() {
        if (this.check_validity()) {
            fetch(this.url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    location.replace('../e404');
                })
                .then((output) => {
                    let temp = {
                        uname: output.login,
                        name: (() => {
                            if (output.name == "" || output.name == null) {
                                return null;
                            }
                            return output.name;
                        })(),
                        profile_pic: (() => {
                            return `https://avatars.githubusercontent.com/u/${output.id}`;
                        })(),
                        url: output.html_url,
                        twitter_uname: (() => {
                            if (output.twitter_username == null) {
                                return "";
                            }
                            return output.twitter_username;
                        })(),
                        followers_count: output.followers,
                        following_count: output.following,
                        repository_count: output.public_repos,
                        bio: (() => {
                            if (output.bio == null) {
                                return "";
                            }
                            return output.bio;
                        })(),
                    };

                    this.ss.setItem(
                        `${this.uname}_user`,
                        JSON.stringify({
                            user: this.uname,
                            timestamp: new Date().getTime(),
                            data: temp,
                        })
                    );
                });
        }
    }
}

let obj = new user(uname);

obj.main();

if (!sessionStorage.hasOwnProperty(`${uname}_user`)) {
    setTimeout(() => {
        main();
    }, 1600);
} else {
    main();
}

function main() {
    let ss_user = JSON.parse(sessionStorage.getItem(`${uname}_user`));
    
    if(ss_user==null){
        location.replace('../e404');
    }

    let content = [{
            class: "links",
            attr: "href",
            input: [
                `https://www.github.com/${ss_user.user}`,
                `../social/?uid=${ss_user.user}`,
                `../repos/?uid=${ss_user.user}`,
                `../star/?uid=${ss_user.user}`,
                `https://www.twitter.com/${ss_user.data.twitter_uname}`,
            ],
        },
        {
            id: "profile_pic",
            attr: "src",
            input: ss_user.data.profile_pic,
        },
        {
            id: "gh-uname",
            attr: "innerText",
            input: ss_user.data.uname,
        },
        {
            id: "followers",
            attr: "innerText",
            input: ss_user.data.followers_count,
        },
        {
            id: "following",
            attr: "innerText",
            input: ss_user.data.following_count,
        },
        {
            id: "repositories",
            attr: "innerText",
            input: ss_user.data.repository_count,
        },
        {
            id: "twtr-uname",
            attr: "innerText",
            input: ss_user.data.twitter_uname,
        },
        {
            id: "gh-bio",
            attr: "innerText",
            input: ss_user.data.bio,
        },
    ];

    content.forEach((item) => {
        try {
            if (item.hasOwnProperty("class")) {
                let classes = document.getElementsByClassName(item.class);
                for (let index = 0; index < item.input.length; index++) {
                    classes[index][item.attr] = item.input[index];
                }
            } else if (item.hasOwnProperty("id")) {

                let element = document.getElementById(item.id);
                element[item.attr] = item.input;
            }
        } catch {}
    });

    let twtr = document.getElementById("twtr-vsblt");
    if (ss_user.data.twitter_uname != "") {
        twtr.style.display = "flex";
    }

    let bio = document.getElementById("gh-bio");
    let separator = document.getElementById("separator");
    if (ss_user.data.bio != "") {
        bio.style.display = "flex";
        separator.style.display = "flex";
    }
}