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

function main_social() {
    let ss_followers = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_followers`));
    console.log(ss_followers);
    let ss_following = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_following`));
    console.log(ss_following);
}