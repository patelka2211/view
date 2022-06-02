document.title = `${uname}/starred`;

class starred {
    constructor(uname) {
        this.uname = uname;
        this.time_interval_minutes = 5;
        this.ss = sessionStorage;
        this.url = `https://api.github.com/users/${uname}/starred`;
    }

    has_been_stored() {
        if (this.ss.hasOwnProperty(`${uid_to_json_key(this.uname)}_star`)) {
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
            new Date(JSON.parse(this.ss.getItem(`${uid_to_json_key(this.uname)}_star`)).timestamp + this.time_interval_minutes * 60000)
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
                    location.replace('/e404');
                })
                .then((output) => {
                    let temp_list = [];
                    output.forEach((element) => {
                        temp_list.push({
                            name: element.name,
                            opengraph_img: (() => {
                                return `https://opengraph.githubassets.com/${Math.floor(Math.random() * (900000)) + 100000}/${element.full_name}`
                            })(),
                            repo_url: element.html_url,
                            owner: element.owner.login,
                            // owner_url: element.owner.html_url,
                            owner_url: (() => {
                                return `/user/?uid=${element.owner.login}`;
                            })(),
                            gh_page: (() => {
                                if (element.has_pages) {
                                    return `https://${element.owner.login}.github.io/${element.name}`;
                                }
                                return '';
                            })(),
                            homepage: (() => {
                                if (
                                    element.hasOwnProperty("homepage") &&
                                    element.homepage != "" &&
                                    element.homepage != null
                                ) {
                                    return element.homepage;
                                }
                                return '';
                            })(),
                        });
                    });

                    this.ss.setItem(
                        `${uid_to_json_key(this.uname)}_star`,
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

let obj_star = new starred(uname);

obj_star.main();

if (!sessionStorage.hasOwnProperty(`${uid_to_json_key(uname)}_star`)) {
    setTimeout(() => {
        main_star();
    }, 1600);
} else {
    main_star();
}

function main_star() {
    let ss_star = JSON.parse(sessionStorage.getItem(`${uid_to_json_key(uname)}_star`));

    if(ss_star==null){
        location.replace('/e404');
    }

    if (ss_star.data.length == 0) {
        let nothing_msg = document.getElementById('no_repo_msg');
        nothing_msg.innerHTML = `There are no starred repositories for <span>${uname}</span>.`;
        return;
    }
    let main_content = document.getElementById('main_content');
    main_content.classList.toggle('hide');

    let nothing = document.getElementById('no_repos');
    nothing.classList.toggle('hide');

    let uname_element = document.getElementById('uname');
    uname_element.innerText = uname;
    let cards_element = document.getElementById('cards_main');
    cards_element.innerHTML = '';

    ss_star.data.forEach(element => {
        cards_element.innerHTML += `<div class="card">
                                        <div class="img">
                                            <a href="${element.repo_url}" target="_blank">
                                                <img src="${element.opengraph_img}" alt="">
                                            </a>
                                        </div>
                                        <div class="credits">
                                            <span class="repo-name">
                                                <a href="${element.repo_url}" target="_blank">
                                                    ${element.name}
                                                </a>
                                            </span> by
                                            <span class="owner">
                                                <a href="${element.owner_url}" target="_blank">
                                                            ${element.owner}
                                                </a>
                                            </span>
                                        </div>
                                        <div class="separator${(()=>{
                                            if(element.gh_page==''&&element.homepage==''){
                                                return ' hide';
                                            }
                                            return '';
                                        })()}"></div>
                                        <div class="externals${(()=>{
                                            if(element.gh_page==''&&element.homepage==''){
                                                return ' hide';
                                            }
                                            return '';
                                        })()}">
                                            <div class="pages${(()=>{
                                                if(element.gh_page==''){
                                                    return ' hide';
                                                }
                                                return '';
                                            })()}">
                                                <a href="${(()=>{
                                                    if(element.gh_page!=''){
                                                        return element.gh_page;
                                                    }
                                                    return '';
                                                })()}" target="_blank">
                                                    View on
                                                    <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github">
                                                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                                                    </svg> <span>pages</span>
                                                </a>
                                            </div>
                                            <div class="homepage${(()=>{
                                                if(element.homepage==''){
                                                    return ' hide';
                                                }
                                                return '';
                                            })()}">
                                                <a href="${(()=>{
                                                    if(element.homepage!=''){
                                                        return element.homepage;
                                                    }
                                                    return '';
                                                })()}" target="_blank">
                                                    <svg viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
                                                    </svg>Visit homepage
                                                </a>
                                            </div>
                                        </div>
                                    </div>`;
    });
}