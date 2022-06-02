if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    document.body.classList.toggle("dark-mode");
}

function uid_to_json_key(uid) {
    return uid.replace('-', '_').replace('.', '_');
}

function update_search_params(key, value) {
    let loc = window.location;
    let params_now = new URLSearchParams(loc.search);
    params_now.set(key,value);
    history.replaceState({}, null, loc.origin+loc.pathname+'?'+params_now.toString());
}

class root {
    constructor(uname) {
        this.uname = uname;
        this.time_interval_minutes = 5;
        this.ss = sessionStorage;
        this.url = `https://api.github.com/users/${uname}`;
    }

    has_been_stored() {
        if (this.ss.hasOwnProperty(`${uid_to_json_key(this.uname)}_nav`)) {
            return true;
        }
        return false;
    }

    check_validity() {
        if (!this.has_been_stored()) {
            return true;
        }
        if (new Date().getTime() < new Date(JSON.parse(this.ss.getItem(`${uid_to_json_key(this.uname)}_nav`)).timestamp + this.time_interval_minutes * 60000)) {
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
                    location.replace('/e404');
                })
                .then((output) => {
                    let temp = {
                        nav_dp: (() => {
                            return `https://avatars.githubusercontent.com/u/${output.id}`;
                        })(),
                        nav_name: (() => {
                            if (output.name == "" || output.name == null) {
                                return output.login;
                            }
                            return `${output.name} (${output.login})`;
                        })(),
                        nav_repo: `${output.public_repos} Repositories`,
                        nav_social: (() => {
                            let flwers = output.followers;
                            if (flwers > 1000) {
                                flwers = parseFloat(`${flwers / 1000}`).toFixed(1) + "k";
                            }
                            let flwing = output.following;
                            if (flwing > 1000) {
                                flwing = parseFloat(`${flwing / 1000}`).toFixed(1) + "k";
                            }
                            return `${flwers} Followers • ${flwing} Following`;
                        })(),
                    };

                    this.ss.setItem(
                        `${uid_to_json_key(this.uname)}_nav`,
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

let uname = new URLSearchParams(window.location.search).get("uid");

if (uname == null) {
    uname = "patelka2211";
}

let obj_root = new root(uname);

obj_root.main();

if (!sessionStorage.hasOwnProperty(`${uid_to_json_key(uname)}_nav`)) {
    setTimeout(() => {
        main_root();
    }, 1600);
} else {
    main_root();
}

function main_root() {
    let ss_root = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_nav`));
    
    if(ss_root==null){
        location.replace('/e404');
    }

    document.getElementById('site-icon').href = ss_root.data.nav_dp;
    
    let content = [{
            class: "nav_links",
            attr: "href",
            input: (() => {
                let temp = [];
                let paths = ["/user", "/repos", "/social", "/star"];

                paths.forEach((path) => {
                    temp.push(`${path}/?uid=${ss_root.user}`);
                });

                return temp;
            })(),
        },
        {
            id: "nav_dp",
            attr: "src",
            input: ss_root.data.nav_dp,
        },
        {
            id: "nav_name",
            attr: "innerText",
            input: ss_root.data.nav_name,
        },
        {
            id: "nav_repos",
            attr: "innerText",
            input: ss_root.data.nav_repo,
        },
        {
            id: "nav_social",
            attr: "innerText",
            input: ss_root.data.nav_social,
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
}