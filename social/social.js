document.title = `${uname}/social`;

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
                    location.replace('../e404');
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
let no_data_and_wait_state = document.getElementById('no-data-wait-state');
let no_data_msg = document.getElementById('no-data-msg');
let cards = document.getElementById('cards-area');

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
        update_search_params('see', get_checked_id_or_index());
    }
    return get_checked_id_or_index();
}

function update_cards(tab) {
    let ss_tab = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_${tab}`));
    
    if(ss_tab==null){
        location.replace('../e404');
    }
    
    if (ss_tab.data.length == 0) {
        no_data_and_wait_state.classList.remove('hide');
        cards.classList.add('hide');
        if (tab == 'followers') {
            no_data_msg.innerHTML = `<span>@${uname}</span> doesn't have any ${tab}.`;
        }
        else if (tab == 'following') {
            no_data_msg.innerHTML = `<span>@${uname}</span> is not ${tab} anyone.`;
        }
        return;
    }
    no_data_and_wait_state.classList.add('hide');
    cards.classList.remove('hide');
    cards.innerHTML = '';
    ss_tab.data.forEach(element => {
        cards.innerHTML +=`<div class="card">
                                <div class="profile_pic">
                                    <a href="../user/?uid=${element.uname}" target="_blank">
                                        <img src="${element.profile_pic}" alt="${element.uname}'s GitHub profile picture.">
                                    </a>
                                </div>
                                <div class="metadata">
                                    <div class="uname">
                                        <a href="../user/?uid=${element.uname}" target="_blank">
                                            <span class="text">
                                                ${element.uname}
                                            </span>
                                        </a>
                                    </div>
                                    <div class="other">
                                        <div class="followers_url">
                                            <a href="../social/?uid=${element.uname}&see=followers" target="_blank">
                                                / <span>followers</span>
                                            </a>
                                        </div>
                                        <div class="following_url">
                                            <a href="../social/?uid=${element.uname}&see=following" target="_blank">
                                                / <span>following</span>
                                            </a>
                                        </div>
                                        <div class="repositories_url">
                                            <a href="../repos/?uid=${element.uname}" target="_blank">
                                                / <span>repos</span>
                                            </a>
                                        </div>
                                        <div class="starred_url">
                                            <a href="../star/?uid=${element.uname}" target="_blank">
                                                / <span>starred</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
    });
}

function main_social() {
    update_cards(select_option(true));
}
