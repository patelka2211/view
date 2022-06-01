class social {
    constructor(uname) {
        this.uname = uname;
        this.time_interval_minutes = 5;
        this.ss = sessionStorage;
        this.url = (property) => {
            return `https://api.github.com/users/${uname}/${property}`;
        };
    }

    has_been_stored(property) {
        if (this.ss.hasOwnProperty(`${uid_to_json_key(this.uname)}_${property}`)) {
            return true;
        }
        return false;
    }

    check_validity(property) {
        if (!this.has_been_stored(property)) {
            return true;
        }
        if (
            new Date().getTime() <
            new Date(JSON.parse(this.ss.getItem(`${uid_to_json_key(this.uname)}_${property}`)).timestamp + this.time_interval_minutes * 60000)
        ) {
            return false;
        }
        return true;
    }

    main(property) {
        if (this.check_validity(property)) {
            fetch(this.url(property))
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    // location.replace('/e404');
                })
                .then((output) => {
                    let temp_list = [];
                    output.forEach((element) => {
                        temp_list.push({
                            uname: element.login,
                            profile_pic: (() => {
                                return `https://avatars.githubusercontent.com/u/${element.id}`;
                            })(),
                            followers_url: '',
                            following_url: '',
                            repositories_url: '',
                            starred_url: '',
                        });
                    });

                    this.ss.setItem(
                        `${uid_to_json_key(this.uname)}_${property}`,
                        JSON.stringify({
                            user: this.uname,
                            timestamp: new Date().getTime(),
                            data: temp_list,
                        })
                    );
                });
        }
    }
}

let options = document.getElementsByName('option');
let usp = new URLSearchParams(location.search);

let obj = new social(uname);

obj.main('followers');

obj.main('following');

if (!sessionStorage.hasOwnProperty(`${uid_to_json_key(uname)}_followers`) || !sessionStorage.hasOwnProperty(`${uid_to_json_key(uname)}_following`)) {
    setTimeout(() => {
        main_social();
    }, 1600);
} else {
    main_social();
}

function get_checked_id_or_index(check = null) {

    for (let index = 0; index < options.length; index++) {
        const element = options[index];
        if (check == null && element.checked) {
            return element.id;
        }
        else if (check != null && check == element.id) {
            return index;
        }
    }
}

function select_option(auto = false) {
    if (auto == true) {
        if (usp.has('see') == null) {
            options[0].checked = true;
            update_search_params('see', 'followers');
        }
        else if (usp.has('see') != null && !(usp.get('see') == 'followers' || usp.get('see') == 'following')) {
            options[0].checked = true;
            update_search_params('see', 'followers');
        }
        else {
            options[get_checked_id_or_index(usp.get('see'))].checked = true;
            update_search_params('see', usp.get('see'));
        }
    } else {
        // options[get_checked_id_or_index(usp.get('see'))].checked = true;
        update_search_params('see', get_checked_id_or_index());
    }

    return usp.get('see');
}

let wait_state = document.getElementById('wait-state');
let options_container = document.getElementById('optinos_container');
let no_data_state = document.getElementById('no-data-state');
let no_data_msg = document.getElementById('no-data-msg');
let content = document.getElementById('main-content');
let cards = document.getElementById('cards-area');


function update_cards(tab) {
    // let temp = {
    //     "uname": "sarthak1206",
    //     "profile_pic": "https://avatars.githubusercontent.com/u/66436609",
    //     "followers_url": "",
    //     "following_url": "",
    //     "repositories_url": "",
    //     "starred_url": ""
    // };
    let ss_tab = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_${tab}`));
    // return;
    if (ss_tab.data.length == 0) {
        no_data_state.classList.remove('hide');
        if (tab == 'followers') {
            no_data_msg.innerHTML = `<span><span>${uname}</span> doesn't have any ${tab}.</span>`;
        }
        else if (tab == 'following') {
            no_data_msg.innerHTML = `<span><span>${uname}</span> is not ${tab} anyone.</span>`;
        }
    }
    `<div class="card">
        <div class="profile_pic">
            <a href="">
                <img src="https://avatars.githubusercontent.com/u/66436609" alt="">
            </a>
        </div>
        <div class="metadata">
            <div class="uname">
                <a href="">
                    <span class="text">
                        jayneel-shah18
                    </span>
                </a>
            </div>
            <div class="other">
                <div class="followers_url">
                    <a href="">
                        / <span>followers</span>
                    </a>
                </div>
                <div class="following_url">
                    <a href="">
                        / <span>following</span>
                    </a>
                </div>
                <div class="repositories_url">
                    <a href="">
                        / <span>repos</span>
                    </a>
                </div>
                <div class="starred_url">
                    <a href="">
                        / <span>starred</span>
                    </a>
                </div>
            </div>
        </div>
    </div>`;
}

function main_social() {
    // let ss_followers = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_followers`));
    // console.log(ss_followers);
    // let ss_following = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_following`));
    // console.log(ss_following);
    // let index;

    console.log(select_option(true));
}
