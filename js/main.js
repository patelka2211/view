/**
 *    MIT License
 *
 *    Copyright (c) 2022 Kartavya Patel
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a copy
 *    of this software and associated documentation files (the "Software"), to deal
 *    in the Software without restriction, including without limitation the rights
 *    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *    copies of the Software, and to permit persons to whom the Software is
 *    furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice shall be included in all
 *    copies or substantial portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 */

const tabs = ["profile", "repo", "social", "star", "share"];

/**
 * Returns JSON data from api.
 * @param url URL to get data from.
 * @param return_type Type of return value. It can be String (default) or Object.
 */
function get_data_from_api(url, return_type) {
    try {
        let XHReq = new XMLHttpRequest();
        XHReq.open("GET", url, false);
        XHReq.send();
        if (XHReq.status != 200) {
            location.replace("/error");
        }
        if (return_type == Object) return JSON.parse(XHReq.responseText);
        return XHReq.responseText;
    } catch (exception) {
        console.log(exception);
        location.replace(location.origin + "view/error");
    }
}

function save_to_ss(key, value) {
    sessionStorage[key] = JSON.stringify(value);
}

function ss_has_key(key) {
    return sessionStorage.hasOwnProperty(key);
}

function get_from_ss(key) {
    return ss_has_key(key) ? JSON.parse(sessionStorage[key]) : null;
}

class control_url {
    constructor(link = null) {
        if (link == null) {
            this.loc = window.location;
        } else {
            this.loc = new URL(link);
        }

        this.update_params = () => {
            this.params = new URLSearchParams(this.loc.search);
        };

        this.update_params();
    }

    clear_search_params() {
        this.change_search_params("clear");
    }

    change_search_params(state = null) {
        if (state == null) {
            history.replaceState(
                {},
                null,
                this.loc.pathname + "?" + this.params.toString()
            );
        } else if ((state = "clear")) {
            history.replaceState({}, null, this.loc.pathname);
        }
        this.update_params();
    }

    add_or_update_search_params(key, value) {
        this.params.set(key, value);
        this.change_search_params();
    }

    is_empty() {
        let continue_ = true;
        for (const item of this.params.keys()) {
            continue_ = false;
            break;
        }
        return continue_;
    }

    remove_search_params(key) {
        if (this.is_empty()) {
            return;
        }

        for (const item of this.params.keys()) {
            if (item == key) {
                this.params.delete(key);
                break;
            }
        }

        if (this.is_empty()) {
            this.clear_search_params();
            return;
        }
        this.change_search_params();
    }

    get_object() {
        if (this.is_empty()) {
            return null;
        }

        let temp = Object();
        for (const item of this.params.entries()) {
            temp[item[0]] = item[1];
        }
        return temp;
    }

    replace_with(data, clear_current = false) {
        if (clear_current) {
            this.clear_search_params();
        }

        for (const item of Object.entries(data)) {
            this.params.set([item[0]], item[1]);
        }

        if (this.is_empty()) {
            return;
        }
        this.change_search_params();
    }
}

class share_api {
    constructor(uid_to_be_shared) {
        this.uid = () => {
            return uid_to_be_shared.innerText;
        };
    }

    assign_tasks() {
        const btn_list = [
            "mail",
            "lnkdn",
            "wa",
            "fb",
            "twt",
            "spct",
            "rdt",
            "koo",
        ];

        for (let index = 0; index < btn_list.length; index++) {
            document
                .getElementById(`${btn_list[index]}-btn`)
                .addEventListener("click", () => {
                    this.open_window(btn_list[index]);
                });
        }
    }

    open_window(platform) {
        let title = `Checkout ${this.uid()}'s profile.`;
        let url = location.origin + location.pathname + `?uid=${this.uid()}`;

        if (platform == "mail") {
            url = `mailto:?subject=${encodeURIComponent(
                title
            )}&body=${encodeURIComponent(url)}`;
        } else if (platform == "lnkdn") {
            url = `https://www.linkedin.com/cws/share?url=${encodeURIComponent(
                `${title}\n${url}`
            )}`;
        } else if (platform == "wa") {
            url = `http://api.whatsapp.com/send?text=${encodeURIComponent(
                `${title}\n${url}`
            )}`;
        } else if (platform == "fb") {
            url = `https://www.facebook.com/sharer/sharer.php?t=${encodeURIComponent(
                title
            )}&u=${encodeURIComponent(url)}`;
        } else if (platform == "twt") {
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                title
            )}&url=${encodeURIComponent(url)}`;
        } else if (platform == "spct") {
            url = `https://snapchat.com/scan?attachmentUrl=${encodeURIComponent(
                url
            )}`;
        } else if (platform == "rdt") {
            url = `https://reddit.com/submit?title=${encodeURIComponent(
                title
            )}&url=${encodeURIComponent(url)}`;
        } else if (platform == "koo") {
            url = `https://www.kooapp.com/create?title=${encodeURIComponent(
                `${title}\n${url}`
            )}`;
        }

        let width = 900;
        let height = 1600;
        let total = width + height;
        var left = (screen.width - (screen.width / total) * width) / 2;
        var top = (screen.height - (screen.height / total) * height) / 2;
        window.open(
            url,
            "_blank",
            `resizable=yes,width=${
                (window.innerWidth / total) * width
            },height=${
                (window.innerHeight / total) * height
            },top=${top},left=${left}`
        );
    }
}

class app_manager {
    constructor() {
        this.profile = {
            header: "",
            root: (
                id_no = "../assets/GitHub-Mark.jpg",
                gh_uname = "github",
                followers_count = "",
                following_count = "",
                repo_count = "",
                tw_uname = null,
                user_bio = null
            ) => {
                return `<div class="space"></div>
                        <div class="root-profile">
                            <div class="user-image-div">
                                <img
                                    src="${(() => {
                                        return typeof id_no == "string"
                                            ? id_no
                                            : `https://avatars.githubusercontent.com/u/${id_no}`;
                                    })()}"
                                    alt="${gh_uname}"
                                    class="user-image"
                                />
                            </div>
                            <div class="external-links">
                                <a href="//github.com/${gh_uname}" target="_blank" title="${gh_uname} on GitHub">
                                    <!-- GitHub svg -->
                                    <svg viewBox="0 0 16 16">
                                        <path
                                            fill-rule="evenodd"
                                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                                        ></path>
                                    </svg>
                                    /
                                    <span class="text">${gh_uname}</span>
                                </a>${(() => {
                                    return tw_uname == null
                                        ? ""
                                        : `• <a href="//twitter.com/${tw_uname}" target="_blank">
                                                <!-- Twitter svg -->
                                                <svg viewBox="0 0 273.5 222.3">
                                                    <path
                                                        d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
                                                    ></path>
                                                </svg>
                                                /
                                                <span class="text">${tw_uname}</span>
                                            </a>`;
                                })()}
                            </div>
                            <div class="social-links">
                                <span
                                    id="open-followers-btn"
                                    title="See followers list"
                                >
                                    <span>${followers_count}</span>
                                    ${(() => {
                                        if (
                                            typeof followers_count != "string"
                                        ) {
                                            if (followers_count == 0) {
                                                return "No followers";
                                            }
                                            if (followers_count == 1) {
                                                return "Follower";
                                            }
                                            return "Followers";
                                        }
                                        return "Followers";
                                    })()}
                                </span>
                                •
                                <span
                                    id="open-following-btn"
                                    title="See following list"
                                >
                                    <span>${following_count}</span>
                                    Following
                                </span>
                            </div>
                            <div class="repo-link">
                                <span
                                    id="open-repo-btn"
                                    title="See repositories list"
                                >
                                    <span>${repo_count}</span>
                                    ${(() => {
                                        if (typeof repo_count != "string") {
                                            if (repo_count == 0) {
                                                return "No public repositories";
                                            }
                                            if (repo_count == 1) {
                                                return "Public repository";
                                            }
                                            return "Public repositories";
                                        }
                                        return "Repositories";
                                    })()}
                                </span>
                            </div>
                            <div 
                                class="star-link"
                                title="See starred repositories list"
                            >
                                <span id="open-star-btn" >
                                    View starred repositories
                                </span>
                            </div>${(() => {
                                return user_bio == null
                                    ? ""
                                    : `<div class="h-line"></div><div class="user-bio">${user_bio}</div>`;
                            })()}
                        </div>
                        <div class="space"></div>`;
            },
        };
        this.repo = {
            header: (repo_count) => {
                return `<div class="content">
                <div class="header-repo">${repo_count} ${(() => {
                    if (typeof repo_count != "string") {
                        if (repo_count == 0) {
                            return " public repositories";
                        }
                        if (repo_count == 1) {
                            return "public repository";
                        }
                        return "public repositories";
                    }
                    return "";
                })()}</div>
            </div>`;
            },
            root: (repo_data, uid, optimize = false) => {
                return `<div class="space"></div>
                        <div class="root-repo">
                        ${(() => {
                            let repo_card_maker = (
                                name,
                                owner,
                                homepage,
                                has_pages
                            ) => {
                                return `<div class="repo-card">
                                        <a target="_blank" class="repo-image${(() => {
                                            if (
                                                (homepage != null &&
                                                    homepage != "") ||
                                                has_pages
                                            )
                                                return " has-external-links";
                                            return "";
                                        })()}" href="//github.com/${owner}/${name}">
                                            <img
                                                src="https://opengraph.githubassets.com/1/${owner}/${name}"
                                                alt="${owner}/${name}"
                                                title="${owner}/${name}" />
                                        </a>
                                        ${(() => {
                                            return (homepage == null ||
                                                homepage == "") &&
                                                !has_pages
                                                ? ""
                                                : `<div class="external-links">
                                                ${(() => {
                                                    return !has_pages
                                                        ? ""
                                                        : `<a target="_blank" href="https://${owner}.github.io/${name}">Visit GitHub Pages</a>`;
                                                })()}
                                                ${(() => {
                                                    return homepage == null ||
                                                        homepage == ""
                                                        ? ""
                                                        : `<a target="_blank" href="${homepage}">Visit homepage</a>`;
                                                })()}
                                            </div>`;
                                        })()}
                                        </div>`;
                            };
                            let output = "";
                            if (!optimize) {
                                let repo_pointer;
                                for (
                                    let index = 0;
                                    index < repo_data.length;
                                    index++
                                ) {
                                    repo_pointer = repo_data[index];
                                    output += repo_card_maker(
                                        repo_pointer.name,
                                        repo_pointer.owner,
                                        repo_pointer.homepage,
                                        repo_pointer.has_pages
                                    );
                                }
                            } else if (optimize) {
                                let repo_pointer,
                                    new_repo_data = [];
                                for (
                                    let index = 0;
                                    index < repo_data.length;
                                    index++
                                ) {
                                    repo_pointer = repo_data[index];

                                    output += repo_card_maker(
                                        repo_pointer.name,
                                        repo_pointer.owner.login,
                                        repo_pointer.homepage,
                                        repo_pointer.has_pages
                                    );

                                    new_repo_data.push({
                                        name: repo_pointer.name,
                                        owner: repo_pointer.owner.login,
                                        homepage: repo_pointer.homepage,
                                        has_pages: repo_pointer.has_pages,
                                    });
                                }
                                let temp_ss_repo = get_from_ss(
                                    this.save_path("repo", uid)
                                );
                                new_repo_data = {
                                    last_update: temp_ss_repo.last_update,
                                    data: new_repo_data,
                                };
                                save_to_ss(
                                    this.save_path("repo", uid),
                                    new_repo_data
                                );
                            }
                            return output;
                        })()}
                        </div>
                        <div class="space"></div>`;
            },
        };
        this.social = {
            header: `<div class="content">
                         <div class="header-social">
                             <input type="radio" name="social-select" id="followers" />
                             <label for="followers">Followers</label>
                             <input type="radio" name="social-select" id="following" />
                             <label for="following">Following</label>
                         </div>
                     </div>`,

            root: (user_data, uid, action = "followers", optimize = false) => {
                return `<div class="space"></div>
                <div class="root-social">
                    <div class="title">${(() => {
                        if (user_data.length == 0) {
                            return `No ${action}`;
                        } else if (user_data.length == 1) {
                            return action == "followers"
                                ? `1 follower`
                                : `1 following`;
                        }
                        return `${(() => {
                            if (user_data.length < 1000)
                                return user_data.length;
                            return `${
                                Math.round(user_data.length / 100) / 10
                            }k`;
                        })()} ${action}`;
                    })()}</div>
                    ${(() => {
                        let user_card = (uname, id_no) => {
                            return `<div
                                        class="user-card"
                                        style="background-image: url(//avatars.githubusercontent.com/u/${id_no})"
                                    >
                                        <div class="space">
                                            <a
                                                target="_blank"
                                                href="./?tab=profile&uid=${uname}"
                                                title="View ${uname}'s profile"
                                                class="user-profile-link"
                                            ></a>
                                        </div>
                                        <div class="info">
                                            <div class="uname-uid-and-follow-btn">
                                                <div class="uid">
                                                    <div class="id">@${uname}</div>
                                                </div>
                                                <a
                                                    href="//github.com/login?return_to=https%3A%2F%2Fgithub.com%2F${uname}"
                                                    target="_blank"
                                                    class="follow-btn"
                                                >
                                                    Follow
                                                </a>
                                            </div>
                                            <div class="externals">
                                                <a href="./?tab=repo&uid=${uname}" target="_blank" class="links">
                                                    <svg class="svg-icon" viewBox="0 0 16 16">
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                                                        ></path>
                                                    </svg>
                                                </a>
                                                <div class="line"></div>
                                                <a href="./?tab=social&uid=${uname}" target="_blank" class="links">
                                                    <svg class="svg-icon" viewBox="0 0 16 16">
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"
                                                        ></path>
                                                    </svg>
                                                </a>
                                                <div class="line"></div>
                                                <a href="./?tab=star&uid=${uname}" target="_blank" class="links">
                                                    <svg class="svg-icon" viewBox="0 0 16 16">
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
                                                        ></path>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>`;
                        };
                        let output = "";
                        if (!optimize) {
                            for (
                                let index = 0;
                                index < user_data.length;
                                index++
                            ) {
                                output += user_card(
                                    user_data[index].uname,
                                    user_data[index].id_no
                                );
                            }
                        } else if (optimize) {
                            let new_user_data = [];
                            for (
                                let index = 0;
                                index < user_data.length;
                                index++
                            ) {
                                output += user_card(
                                    user_data[index].login,
                                    user_data[index].id
                                );
                                new_user_data.push({
                                    uname: user_data[index].login,
                                    id_no: user_data[index].id,
                                });
                            }

                            let temp_ss_social = get_from_ss(
                                this.save_path(`social/${action}`, uid)
                            );

                            new_user_data = {
                                last_update: temp_ss_social.last_update,
                                data: new_user_data,
                            };
                            save_to_ss(
                                this.save_path(`social/${action}`, uid),
                                new_user_data
                            );
                        }
                        return output;
                    })()}
                <div class="warning">This may not be exact ${action} count as there are limits on GitHub API.</div>
                </div>
                <div class="space"></div>`;
            },
        };
        this.star = {
            header: (repo_count) => {
                return `<div class="content">
                <div class="header-repo">${repo_count} ${(() => {
                    if (typeof repo_count != "string") {
                        if (repo_count == 0) {
                            return " starred repositories";
                        }
                        if (repo_count == 1) {
                            return "starred repository";
                        }
                        return "starred repositories";
                    }
                    return "";
                })()}</div>
            </div>`;
            },
            root: (repo_data, uid, optimize = false) => {
                return `<div class="space"></div>
                        <div class="root-repo">
                        ${(() => {
                            let repo_card_maker = (
                                name,
                                owner,
                                homepage,
                                has_pages
                            ) => {
                                return `<div class="repo-card">
                                        <a target="_blank" class="repo-image${(() => {
                                            if (
                                                (homepage != null &&
                                                    homepage != "") ||
                                                has_pages
                                            )
                                                return " has-external-links";
                                            return "";
                                        })()}" href="//github.com/${owner}/${name}">
                                            <img
                                                src="https://opengraph.githubassets.com/1/${owner}/${name}"
                                                alt="${owner}/${name}"
                                                title="${owner}/${name}" />
                                        </a>
                                        ${(() => {
                                            return (homepage == null ||
                                                homepage == "") &&
                                                !has_pages
                                                ? ""
                                                : `<div class="external-links" href="//github.com/${owner}/${name}">
                                                ${(() => {
                                                    return !has_pages
                                                        ? ""
                                                        : `<a target="_blank" href="https://${owner}.github.io/${name}">Visit GitHub Pages</a>`;
                                                })()}
                                                ${(() => {
                                                    return homepage == null ||
                                                        homepage == ""
                                                        ? ""
                                                        : `<a target="_blank" href="${homepage}">Visit homepage</a>`;
                                                })()}
                                            </div>`;
                                        })()}
                                        </div>`;
                            };
                            if (!optimize) {
                                let output = "",
                                    repo_pointer;
                                for (
                                    let index = 0;
                                    index < repo_data.length;
                                    index++
                                ) {
                                    repo_pointer = repo_data[index];
                                    output += repo_card_maker(
                                        repo_pointer.name,
                                        repo_pointer.owner,
                                        repo_pointer.homepage,
                                        repo_pointer.has_pages
                                    );
                                }
                                return output;
                            } else if (optimize) {
                                let output = "",
                                    repo_pointer,
                                    new_repo_data = [];
                                for (
                                    let index = 0;
                                    index < repo_data.length;
                                    index++
                                ) {
                                    repo_pointer = repo_data[index];

                                    output += repo_card_maker(
                                        repo_pointer.name,
                                        repo_pointer.owner.login,
                                        repo_pointer.homepage,
                                        repo_pointer.has_pages
                                    );

                                    new_repo_data.push({
                                        name: repo_pointer.name,
                                        owner: repo_pointer.owner.login,
                                        homepage: repo_pointer.homepage,
                                        has_pages: repo_pointer.has_pages,
                                    });
                                }
                                let temp_ss_repo = get_from_ss(
                                    this.save_path("star", uid)
                                );
                                new_repo_data = {
                                    last_update: temp_ss_repo.last_update,
                                    data: new_repo_data,
                                };
                                save_to_ss(
                                    this.save_path("star", uid),
                                    new_repo_data
                                );
                                return output;
                            }
                        })()}
                        </div>
                        <div class="space"></div>`;
            },
        };
        this.share = {
            header: `<div class="content">
                        <div class="header-share">
                            <a href="//github.com/patelka2211" target="_blank" class="author-creds">
                                <div class="text">Developed in</div>
                                <svg viewBox="0 0 122.88 85.48">
                                    <g>
                                        <path
                                            class="tricolor-orange"
                                            d="M6.71,0h109.46c3.7,0.02,6.71,3.05,6.71,6.75v71.98c0,3.71-3.04,6.75-6.75,6.75l-109.42,0 C3.02,85.46,0,82.43,0,78.73V6.75C0,3.05,3.01,0.02,6.71,0L6.71,0z"
                                        />
                                        <polygon
                                            class="tricolor-white"
                                            points="0,28.49 122.88,28.49 122.88,56.99 0,56.99 0,28.49"
                                        />
                                        <path
                                            class="tricolor-green"
                                            d="M0,56.99h122.88v21.74c0,3.71-3.04,6.75-6.75,6.75l-109.42,0C3.02,85.46,0,82.43,0,78.73V56.99L0,56.99z"
                                        />
                                        <path
                                            class="tricolor-chakra-blue"
                                            d="M72.84,42.74c0-6.3-5.1-11.4-11.4-11.4s-11.4,5.1-11.4,11.4c0,6.29,5.1,11.4,11.4,11.4 S72.84,49.04,72.84,42.74L72.84,42.74z"
                                        />
                                        <path
                                            class="tricolor-white"
                                            d="M71.41,42.74c0-5.51-4.46-9.97-9.97-9.97s-9.97,4.46-9.97,9.97c0,5.51,4.46,9.97,9.97,9.97 S71.41,48.25,71.41,42.74L71.41,42.74z"
                                        />
                                        <path
                                            class="tricolor-chakra-blue"
                                            d="M63.43,42.74c0-1.1-0.89-2-1.99-2s-1.99,0.89-1.99,2c0,1.1,0.89,1.99,1.99,1.99S63.43,43.84,63.43,42.74 L63.43,42.74z"
                                        />
                                        <path
                                            class="tricolor-chakra-blue"
                                            d="M71.82,44.11c0.04-0.27-0.16-0.52-0.43-0.56c-0.27-0.04-0.52,0.16-0.56,0.43s0.16,0.52,0.43,0.56 C71.54,44.57,71.79,44.38,71.82,44.11L71.82,44.11z"
                                        />
                                        <polygon
                                            class="tricolor-chakra-blue"
                                            points="61.44,52.71 61.78,46.73 61.44,43.88 61.1,46.73 61.44,52.71"
                                        />
                                        <path
                                            d="M71.11,46.75c0.11-0.25-0.02-0.55-0.27-0.65c-0.25-0.11-0.55,0.02-0.65,0.27c-0.11,0.25,0.02,0.55,0.27,0.65 C70.72,47.12,71.01,47,71.11,46.75L71.11,46.75z"
                                        />
                                        <polygon
                                            points="58.86,52.37 60.74,46.68 61.15,43.84 60.08,46.51 58.86,52.37"
                                        />
                                        <path
                                            d="M69.75,49.12c0.17-0.22,0.13-0.53-0.09-0.7c-0.22-0.17-0.53-0.13-0.7,0.09c-0.17,0.22-0.13,0.53,0.09,0.7 C69.27,49.38,69.58,49.33,69.75,49.12L69.75,49.12z"
                                        />
                                        <polygon
                                            points="56.45,51.38 59.74,46.37 60.87,43.73 59.15,46.02 56.45,51.38"
                                        />
                                        <path
                                            d="M67.81,51.05c0.22-0.17,0.26-0.48,0.09-0.7c-0.17-0.22-0.48-0.26-0.7-0.09c-0.22,0.17-0.26,0.48-0.09,0.7 C67.28,51.17,67.6,51.22,67.81,51.05L67.81,51.05z"
                                        />
                                        <polygon
                                            points="54.39,49.79 58.86,45.8 60.63,43.55 58.38,45.32 54.39,49.79"
                                        />
                                        <path
                                            d="M65.45,52.42c0.25-0.11,0.38-0.4,0.27-0.65c-0.11-0.25-0.4-0.38-0.65-0.27c-0.25,0.1-0.38,0.4-0.27,0.65 C64.9,52.4,65.19,52.52,65.45,52.42L65.45,52.42z"
                                        />
                                        <polygon
                                            points="52.8,47.73 58.16,45.03 60.45,43.31 57.81,44.44 52.8,47.73"
                                        />
                                        <path
                                            d="M62.81,53.12c0.27-0.04,0.46-0.29,0.43-0.56c-0.04-0.27-0.29-0.46-0.56-0.43c-0.27,0.04-0.46,0.29-0.43,0.56 C62.28,52.97,62.53,53.16,62.81,53.12L62.81,53.12z"
                                        />
                                        <polygon
                                            points="51.81,45.32 57.68,44.1 60.34,43.04 57.5,43.44 51.81,45.32"
                                        />
                                        <path
                                            d="M60.07,53.12c0.27,0.04,0.52-0.16,0.56-0.43c0.04-0.27-0.16-0.52-0.43-0.56c-0.27-0.04-0.52,0.16-0.56,0.43 C59.61,52.84,59.8,53.09,60.07,53.12L60.07,53.12z"
                                        />
                                        <polygon
                                            points="51.47,42.74 57.45,43.08 60.3,42.74 57.45,42.4 51.47,42.74"
                                        />
                                        <path
                                            d="M57.43,52.42c0.25,0.11,0.55-0.02,0.65-0.27s-0.02-0.55-0.27-0.65c-0.25-0.11-0.55,0.02-0.65,0.27 C57.06,52.02,57.18,52.31,57.43,52.42L57.43,52.42z"
                                        />
                                        <polygon
                                            points="51.81,40.16 57.5,42.04 60.34,42.45 57.68,41.38 51.81,40.16"
                                        />
                                        <path
                                            d="M55.06,51.05c0.22,0.17,0.53,0.13,0.7-0.09c0.17-0.22,0.13-0.53-0.09-0.7c-0.22-0.17-0.53-0.13-0.7,0.09 C54.81,50.57,54.85,50.88,55.06,51.05L55.06,51.05z"
                                        />
                                        <polygon
                                            points="52.8,37.75 57.81,41.04 60.45,42.17 58.16,40.45 52.8,37.75"
                                        />
                                        <path
                                            d="M53.13,49.12c0.17,0.22,0.48,0.26,0.7,0.09c0.22-0.17,0.26-0.48,0.09-0.7c-0.17-0.22-0.48-0.26-0.7-0.09 C53.01,48.58,52.96,48.9,53.13,49.12L53.13,49.12z"
                                        />
                                        <polygon
                                            points="54.39,35.69 58.38,40.16 60.63,41.94 58.86,39.68 54.39,35.69"
                                        />
                                        <path
                                            d="M51.76,46.75c0.11,0.25,0.4,0.38,0.65,0.27c0.25-0.11,0.38-0.4,0.27-0.65c-0.11-0.25-0.4-0.38-0.65-0.27 C51.78,46.2,51.66,46.49,51.76,46.75L51.76,46.75z"
                                        />
                                        <polygon
                                            points="56.45,34.1 59.15,39.46 60.87,41.75 59.74,39.12 56.45,34.1"
                                        />
                                        <path
                                            d="M51.06,44.11c0.04,0.27,0.29,0.46,0.56,0.43c0.27-0.04,0.46-0.29,0.43-0.56c-0.04-0.27-0.29-0.46-0.56-0.43 C51.21,43.58,51.02,43.83,51.06,44.11L51.06,44.11z"
                                        />
                                        <polygon
                                            points="58.86,33.11 60.08,38.98 61.15,41.64 60.74,38.8 58.86,33.11"
                                        />
                                        <path
                                            d="M51.06,41.37c-0.04,0.27,0.16,0.52,0.43,0.56c0.27,0.04,0.52-0.16,0.56-0.43c0.04-0.27-0.16-0.52-0.43-0.56 C51.34,40.91,51.09,41.1,51.06,41.37L51.06,41.37z"
                                        />
                                        <polygon
                                            points="61.44,32.77 61.1,38.75 61.44,41.6 61.78,38.75 61.44,32.77"
                                        />
                                        <path
                                            d="M51.77,38.73c-0.11,0.25,0.02,0.55,0.27,0.65c0.25,0.1,0.55-0.02,0.65-0.27c0.11-0.25-0.02-0.55-0.27-0.65 C52.16,38.36,51.87,38.48,51.77,38.73L51.77,38.73z"
                                        />
                                        <polygon
                                            points="64.02,33.11 62.14,38.8 61.73,41.64 62.8,38.98 64.02,33.11"
                                        />
                                        <path
                                            d="M53.13,36.37c-0.17,0.22-0.13,0.53,0.09,0.7c0.22,0.17,0.53,0.13,0.7-0.09c0.17-0.22,0.13-0.53-0.09-0.7 C53.61,36.11,53.3,36.15,53.13,36.37L53.13,36.37z"
                                        />
                                        <polygon
                                            points="66.43,34.1 63.14,39.12 62.01,41.75 63.73,39.46 66.43,34.1"
                                        />
                                        <path
                                            d="M55.07,34.43c-0.22,0.17-0.26,0.48-0.09,0.7c0.17,0.22,0.48,0.26,0.7,0.09c0.22-0.17,0.26-0.48,0.09-0.7 S55.28,34.27,55.07,34.43L55.07,34.43z"
                                        />
                                        <polygon
                                            points="68.49,35.69 64.02,39.68 62.25,41.94 64.5,40.16 68.49,35.69"
                                        />
                                        <path
                                            d="M57.43,33.07c-0.25,0.11-0.37,0.4-0.27,0.65c0.11,0.25,0.4,0.38,0.65,0.27c0.25-0.11,0.38-0.4,0.27-0.65 C57.98,33.08,57.69,32.96,57.43,33.07L57.43,33.07z"
                                        />
                                        <polygon
                                            points="70.08,37.75 64.72,40.45 62.43,42.17 65.07,41.04 70.08,37.75"
                                        />
                                        <path
                                            d="M60.07,32.36c-0.27,0.04-0.46,0.29-0.43,0.56c0.04,0.27,0.29,0.46,0.56,0.43c0.27-0.04,0.47-0.29,0.43-0.56 C60.6,32.52,60.35,32.32,60.07,32.36L60.07,32.36z"
                                        />
                                        <polygon
                                            points="71.07,40.16 65.2,41.38 62.54,42.45 65.38,42.04 71.07,40.16"
                                        />
                                        <path
                                            d="M62.81,32.36c-0.27-0.04-0.52,0.16-0.56,0.43c-0.04,0.27,0.16,0.52,0.43,0.56c0.27,0.04,0.52-0.16,0.56-0.43 C63.27,32.65,63.08,32.39,62.81,32.36L62.81,32.36z"
                                        />
                                        <polygon
                                            points="71.41,42.74 65.43,42.4 62.58,42.74 65.43,43.08 71.41,42.74"
                                        />
                                        <path
                                            d="M65.45,33.07c-0.25-0.11-0.55,0.02-0.65,0.27c-0.11,0.25,0.02,0.55,0.27,0.65c0.25,0.1,0.55-0.02,0.65-0.27 C65.82,33.46,65.7,33.17,65.45,33.07L65.45,33.07z"
                                        />
                                        <polygon
                                            points="71.07,45.32 65.38,43.44 62.54,43.04 65.2,44.1 71.07,45.32"
                                        />
                                        <path
                                            d="M67.81,34.43c-0.22-0.17-0.53-0.13-0.7,0.09c-0.17,0.22-0.13,0.53,0.09,0.7c0.22,0.17,0.53,0.13,0.7-0.09 C68.07,34.91,68.03,34.6,67.81,34.43L67.81,34.43z"
                                        />
                                        <polygon
                                            points="70.08,47.73 65.07,44.44 62.43,43.31 64.72,45.03 70.08,47.73"
                                        />
                                        <path
                                            d="M69.75,36.37c-0.17-0.22-0.48-0.26-0.7-0.09s-0.26,0.48-0.09,0.7c0.17,0.22,0.48,0.26,0.7,0.09 C69.87,36.9,69.92,36.58,69.75,36.37L69.75,36.37z"
                                        />
                                        <polygon
                                            points="68.49,49.79 64.5,45.32 62.25,43.55 64.02,45.8 68.49,49.79"
                                        />
                                        <path
                                            d="M71.12,38.73c-0.11-0.25-0.4-0.38-0.65-0.27s-0.38,0.4-0.27,0.65c0.11,0.25,0.4,0.37,0.65,0.27 C71.1,39.28,71.22,38.99,71.12,38.73L71.12,38.73z"
                                        />
                                        <polygon
                                            points="66.43,51.38 63.73,46.02 62.01,43.73 63.14,46.37 66.43,51.38"
                                        />
                                        <path
                                            d="M71.82,41.37c-0.04-0.27-0.29-0.46-0.56-0.43c-0.27,0.04-0.46,0.29-0.43,0.56c0.04,0.27,0.29,0.46,0.56,0.43 C71.67,41.9,71.86,41.65,71.82,41.37L71.82,41.37z"
                                        />
                                        <polygon
                                            points="64.02,52.37 62.8,46.51 61.73,43.84 62.14,46.68 64.02,52.37"
                                        />
                                    </g>
                                </svg>
                                <div class="text">
                                    with &#10084;&#65039; by
                                    <span class="author">KP</span>
                                </div>
                            </a>
                        </div>
                    </div>`,
            root: (uid) => {
                return `<div class="space"></div>
                        <div class="root-share">
                            <div class="title">
                                Share <span id="share-uid">${uid}</span>'s profile with friends and
                                family
                            </div>
                            <div id="other-options">
                                <div class="line"></div>
                                <div id="share-someone-area" class="text">
                                    or share someone else's profile
                                </div>
                                <div class="line"></div>
                            </div>
                            <div class="share-option">
                                <div class="text">@</div>
                                <input id="share-uid-input" type="text" placeholder="GitHub username" title="e.g. ${uid}" />
                            </div>
                            <div class="share-btns">
                                <div class="share-on-social-btn" id="mail-btn">
                                    <!-- Mail -->
                                    <svg class="svg-icon" viewBox="0 0 294.048 294.048">
                                        <path
                                            d="M294.048,56.386c0-8.284-6.716-15-15-15H15c-8.284,0-15,6.716-15,15v181.276c0,8.284,6.716,15,15,15h264.048 c8.284,0,15-6.716,15-15V56.386z M264.048,86.936c0,4.415-1.937,8.607-5.298,11.469l-57.52,48.976l57.575,49.023 c3.327,2.832,5.243,6.982,5.243,11.351c0,8.233-6.674,14.908-14.908,14.908h-0.128c-3.643,0-7.168-1.297-9.942-3.659l-60.979-51.922 l-21.343,18.172c-2.803,2.386-6.264,3.579-9.725,3.579c-3.461,0-6.922-1.193-9.725-3.579l-21.343-18.172L55.075,218.92 c-2.837,2.416-6.442,3.742-10.168,3.742c-8.233,0-14.908-6.674-14.908-14.908c0-4.369,1.917-8.518,5.243-11.351l57.576-49.023 L36.094,99.082C32.228,95.79,30,90.967,30,85.889c0-8.01,6.493-14.504,14.504-14.504c3.446,0,6.779,1.227,9.403,3.461l88.376,75.248 c2.733,2.327,6.751,2.327,9.485,0l88.375-75.248c2.624-2.234,5.957-3.461,9.402-3.461c8.01,0,14.503,6.493,14.503,14.503V86.936z"
                                        />
                                    </svg>
                                </div>
                                <div class="share-on-social-btn" id="lnkdn-btn">
                                    <!-- Linkedin -->
                                    <svg class="svg-icon" viewBox="0 0 112.196 112.196">
                                        <g>
                                            <circle cx="56.098" cy="56.097" r="56.098" />
                                            <g>
                                                <path
                                                    class="inner-vector"
                                                    d="M89.616,60.611v23.128H76.207V62.161c0-5.418-1.936-9.118-6.791-9.118 c-3.705,0-5.906,2.491-6.878,4.903c-0.353,0.862-0.444,2.059-0.444,3.268v22.524H48.684c0,0,0.18-36.546,0-40.329h13.411v5.715 c-0.027,0.045-0.065,0.089-0.089,0.132h0.089v-0.132c1.782-2.742,4.96-6.662,12.085-6.662 C83.002,42.462,89.616,48.226,89.616,60.611L89.616,60.611z M34.656,23.969c-4.587,0-7.588,3.011-7.588,6.967 c0,3.872,2.914,6.97,7.412,6.97h0.087c4.677,0,7.585-3.098,7.585-6.97C42.063,26.98,39.244,23.969,34.656,23.969L34.656,23.969z M27.865,83.739H41.27V43.409H27.865V83.739z"
                                                />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <div class="share-on-social-btn" id="wa-btn">
                                    <!-- Whatsapp -->
                                    <svg viewBox="0 0 308 308" class="svg-icon">
                                        <g>
                                            <path
                                                d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"
                                            />
                                            <path
                                                d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <div class="share-on-social-btn" id="fb-btn">
                                    <!-- Facebook -->
                                    <svg viewBox="0 0 310 310" class="svg-icon">
                                        <g>
                                            <path
                                                d="M81.703,165.106h33.981V305c0,2.762,2.238,5,5,5h57.616c2.762,0,5-2.238,5-5V165.765h39.064 c2.54,0,4.677-1.906,4.967-4.429l5.933-51.502c0.163-1.417-0.286-2.836-1.234-3.899c-0.949-1.064-2.307-1.673-3.732-1.673h-44.996 V71.978c0-9.732,5.24-14.667,15.576-14.667c1.473,0,29.42,0,29.42,0c2.762,0,5-2.239,5-5V5.037c0-2.762-2.238-5-5-5h-40.545 C187.467,0.023,186.832,0,185.896,0c-7.035,0-31.488,1.381-50.804,19.151c-21.402,19.692-18.427,43.27-17.716,47.358v37.752H81.703 c-2.762,0-5,2.238-5,5v50.844C76.703,162.867,78.941,165.106,81.703,165.106z"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <div class="share-on-social-btn" id="twt-btn">
                                    <!-- Twitter -->
                                    <svg viewBox="0 0 512.002 512.002" class="svg-icon">
                                        <path
                                            d="M500.398,94.784c-8.043,3.567-16.313,6.578-24.763,9.023c10.004-11.314,17.631-24.626,22.287-39.193 c1.044-3.265-0.038-6.839-2.722-8.975c-2.681-2.137-6.405-2.393-9.356-0.644c-17.945,10.643-37.305,18.292-57.605,22.764 c-20.449-19.981-48.222-31.353-76.934-31.353c-60.606,0-109.913,49.306-109.913,109.91c0,4.773,0.302,9.52,0.9,14.201 c-75.206-6.603-145.124-43.568-193.136-102.463c-1.711-2.099-4.347-3.231-7.046-3.014c-2.7,0.211-5.127,1.734-6.491,4.075 c-9.738,16.709-14.886,35.82-14.886,55.265c0,26.484,9.455,51.611,26.158,71.246c-5.079-1.759-10.007-3.957-14.711-6.568 c-2.525-1.406-5.607-1.384-8.116,0.054c-2.51,1.439-4.084,4.084-4.151,6.976c-0.012,0.487-0.012,0.974-0.012,1.468 c0,39.531,21.276,75.122,53.805,94.52c-2.795-0.279-5.587-0.684-8.362-1.214c-2.861-0.547-5.802,0.456-7.731,2.638 c-1.932,2.18-2.572,5.219-1.681,7.994c12.04,37.591,43.039,65.24,80.514,73.67c-31.082,19.468-66.626,29.665-103.939,29.665 c-7.786,0-15.616-0.457-23.279-1.364c-3.807-0.453-7.447,1.795-8.744,5.416c-1.297,3.622,0.078,7.66,3.316,9.736 c47.935,30.735,103.361,46.98,160.284,46.98c111.903,0,181.907-52.769,220.926-97.037c48.657-55.199,76.562-128.261,76.562-200.451 c0-3.016-0.046-6.061-0.139-9.097c19.197-14.463,35.724-31.967,49.173-52.085c2.043-3.055,1.822-7.094-0.545-9.906 C507.7,94.204,503.76,93.294,500.398,94.784z"
                                        />
                                    </svg>
                                </div>
                                <div class="share-on-social-btn" id="spct-btn">
                                    <!-- Snapchat -->
                                    <svg viewBox="0 0 24 24" class="svg-icon">
                                        <path
                                            d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"
                                        />
                                    </svg>
                                </div>
                                <div class="share-on-social-btn" id="rdt-btn">
                                    <!-- Reddit -->
                                    <svg viewBox="0 0 24 24" class="svg-icon">
                                        <path
                                            d="M16.9848 13.5C16.9848 14.2993 16.3368 14.9473 15.5374 14.9473C14.738 14.9473 14.09 14.2993 14.09 13.5C14.09 12.7006 14.738 12.0526 15.5374 12.0526C16.3368 12.0526 16.9848 12.7006 16.9848 13.5Z"
                                        />
                                        <path
                                            d="M8.45738 14.9473C9.25674 14.9473 9.90475 14.2993 9.90475 13.5C9.90475 12.7006 9.25674 12.0526 8.45738 12.0526C7.65802 12.0526 7.01001 12.7006 7.01001 13.5C7.01001 14.2993 7.65802 14.9473 8.45738 14.9473Z"
                                        />
                                        <path
                                            d="M8.85013 16.6288C8.49979 16.4078 8.03664 16.5127 7.81565 16.863C7.59466 17.2134 7.69951 17.6765 8.04985 17.8975L8.39477 18.1151C10.595 19.503 13.3971 19.503 15.5973 18.1151L15.9422 17.8975C16.2926 17.6765 16.3974 17.2134 16.1764 16.863C15.9554 16.5127 15.4923 16.4078 15.142 16.6288L14.797 16.8464C13.0857 17.9259 10.9064 17.9259 9.19505 16.8464L8.85013 16.6288Z"
                                        />
                                        <path
                                            d="M19.9605 1.75C19.0866 1.75 18.3245 2.22861 17.922 2.93801L14.3217 2.19949C13.9721 2.12777 13.6204 2.31236 13.4808 2.64083C13.07 3.60742 12.4535 5.07237 11.9393 6.32585C11.7573 6.76955 11.5873 7.18862 11.4435 7.55064C9.39709 7.63308 7.50064 8.16774 5.94951 9.03545C5.41473 8.14005 4.43607 7.53946 3.31579 7.53946C1.6226 7.53946 0.25 8.91206 0.25 10.6052C0.25 11.9006 1.0528 13.007 2.18741 13.4565C2.05646 13.9351 1.98682 14.4334 1.98682 14.9474C1.98682 17.0889 3.19585 18.9587 5.01221 20.2642C6.82975 21.5706 9.3027 22.3552 12 22.3552C14.6973 22.3552 17.1702 21.5706 18.9877 20.2642C20.8041 18.9587 22.0131 17.0889 22.0131 14.9474C22.0131 14.4334 21.9435 13.9351 21.8125 13.4565C22.9468 13.0072 23.75 11.9009 23.75 10.6052C23.75 8.91206 22.3774 7.53946 20.6842 7.53946C19.5639 7.53946 18.5852 8.14005 18.0505 9.03546C16.6243 8.23768 14.9063 7.72142 13.0482 7.57932C13.1358 7.36278 13.2295 7.13313 13.3271 6.89516C13.746 5.87394 14.2341 4.7095 14.6219 3.79229L17.64 4.41138C17.7957 5.55385 18.7753 6.43421 19.9605 6.43421C21.254 6.43421 22.3026 5.38561 22.3026 4.0921C22.3026 2.7986 21.254 1.75 19.9605 1.75ZM19.1184 4.0921C19.1184 3.62702 19.4954 3.25 19.9605 3.25C20.4256 3.25 20.8026 3.62702 20.8026 4.0921C20.8026 4.55719 20.4256 4.93421 19.9605 4.93421C19.4954 4.93421 19.1184 4.55719 19.1184 4.0921ZM12 9.03946C12.1543 9.03946 12.3075 9.04233 12.4596 9.048C12.4582 9.07685 12.4553 9.0982 12.4538 9.10845C12.4513 9.12529 12.4488 9.13703 12.4478 9.1415L12.4465 9.14739L12.4491 9.13787C12.4546 9.11926 12.4639 9.09007 12.478 9.04869C14.7024 9.13488 16.6791 9.81841 18.1123 10.8485C19.6485 11.9527 20.5131 13.4118 20.5131 14.9474C20.5131 16.4829 19.6485 17.942 18.1123 19.0462C16.5772 20.1495 14.4186 20.8552 12 20.8552C9.58135 20.8552 7.42272 20.1495 5.88766 19.0462C4.35141 17.942 3.48682 16.4829 3.48682 14.9474C3.48682 13.4118 4.35141 11.9527 5.88766 10.8485C7.42272 9.7452 9.58135 9.03946 12 9.03946ZM1.75 10.6052C1.75 9.74049 2.45103 9.03946 3.31579 9.03946C3.91282 9.03946 4.43322 9.37393 4.69734 9.86728C3.89802 10.4962 3.23394 11.2401 2.76317 12.071C2.17089 11.8476 1.75 11.2748 1.75 10.6052ZM21.2368 12.071C20.766 11.2401 20.1019 10.4962 19.3026 9.8673C19.5668 9.37394 20.0872 9.03946 20.6842 9.03946C21.549 9.03946 22.25 9.74049 22.25 10.6052C22.25 11.2746 21.8295 11.8475 21.2368 12.071Z"
                                        />
                                    </svg>
                                </div>
                                <div class="share-on-social-btn" id="koo-btn">
                                    <!-- Koo -->
                                    <svg class="svg-icon" viewBox="0 0 354.14 508.04">
                                        <path
                                            class="inner-vector"
                                            d="M106.67,109.21l7.62-8.47,18.62-22L161.7,62.65l5.07-8.47,5.08-14.39V27.94l8.47-9.32L185.4,6.77h10.16l18.62,9.31L226,36.4l1.7,23.71,27.93,15.24L271.75,87.2l14.39,18.62,16.93,39.79,6.78,25.4,4.23,30.48,4.23,28.78L332.7,243l7.62,22,7.62,21.16L350.48,309l-10.16,20.32-14.39,13.54-18.62,3.39-3.39,15.24-8.47,21.16-17.77,21.17L258.2,420.75,232,430.91l-29.63,7.62H154.08l-35.56-4.24L77.88,420.75,54.18,408.9,37.25,397,25.4,387.73,13.54,373.34,5.08,361.49l3.39-17.78,14.39-8.47V322.55l5.92-20.32,11.86-23.71,11-19.47,11-16.08,11-10.16,8.47-5.93V212.49l2.54-16.93,2.54-27.09,5.08-22.86,6.77-21.16Z"
                                        />
                                        <path
                                            d="M353.73,292.31v-.51a121,121,0,0,0-15.68-48.36,82.18,82.18,0,0,0-8.19-11.59A12.4,12.4,0,0,0,321,227.5c-.09-1-.19-2.07-.29-3.1-.61-6.42-1.29-12.7-2-18.8-.19-1.52-.36-3-.54-4.53l-.41-3.26a2.65,2.65,0,0,0-.14-1c-.08-.73-.18-1.45-.28-2.18a8.33,8.33,0,0,0-.17-1.22c-.09-.66-.19-1.31-.27-2s-.12-.83-.19-1.25-.19-1.27-.29-1.91-.12-.81-.18-1.22c-.11-.66-.21-1.32-.33-2a5.88,5.88,0,0,0-.17-1.09c-.13-.79-.25-1.57-.38-2.33a4.82,4.82,0,0,0-.12-.68c-.17-1-.34-2-.53-3l-.15-.82c-.14-.71-.25-1.42-.39-2.11L314,174c-.12-.61-.24-1.22-.38-1.81s-.15-.76-.22-1.15l-.35-1.69c-.09-.38-.17-.75-.24-1.12s-.25-1.17-.39-1.69-.15-.7-.22-1.05l-.44-1.92a4.43,4.43,0,0,0-.18-.83c-.21-.89-.43-1.79-.65-2.67l-.1-.43c-.19-.74-.35-1.49-.54-2.21l-.26-.93c-.13-.56-.28-1.12-.42-1.7l-.27-1c-.15-.53-.29-1-.42-1.56s-.19-.68-.29-1-.29-1-.42-1.53-.21-.66-.29-1l-.48-1.6-.25-.88c-.2-.67-.42-1.35-.63-2a.58.58,0,0,0-.11-.41c-.26-.79-.5-1.57-.75-2.35l-.25-.78c-.19-.52-.36-1.05-.53-1.57l-.3-.92c-.17-.46-.32-.93-.49-1.4l-.33-.93c-.1-.33-.32-.9-.49-1.36l-.32-.91-.51-1.38c-.1-.27-.22-.55-.32-.84s-.39-1-.59-1.54a1.74,1.74,0,0,0-.24-.63c-.27-.71-.56-1.4-.83-2.1l-.25-.61-.61-1.49-.34-.79-.54-1.27c-.12-.29-.26-.56-.37-.85l-.53-1.19c-.12-.28-.25-.55-.37-.84l-.54-1.17c-.12-.27-.24-.54-.38-.81s-.39-.82-.57-1.24-.22-.46-.34-.69l-.86-1.7c-.06-.14-.12-.27-.19-.4l-.8-1.58-.35-.67-.59-1.14-.41-.76-.58-1-.4-.75c-.19-.33-.37-.67-.58-1l-.4-.75c-.21-.34-.41-.67-.6-1l-.4-.7-.7-1.27c0-.17-.18-.32-.27-.47-.34-.54-.66-1.08-1-1.69l-.35-.56-.66-1-.43-.65-.61-.93-.44-.66-.59-.88-.46-.66-.61-.86-.44-.63c-.22-.32-.45-.62-.67-.93s-.26-.35-.39-.54l-1-1.39-.3-.41-.76-1-.46-.57-.63-.8-.49-.59-.61-.75-.49-.59-.61-.73-.49-.56-.74-.74-.44-.51-.83-.91-.36-.39-1-1.1-.46-.46-.68-.71-.49-.49-.64-.66-.51-.51-.64-.61-.51-.49-.65-.63-.49-.46-.74-.67-.41-.37-1.13-1-.41-.34-1.23-1.07-.68-.56-.53-.42-.64-.53-.52-.4-.67-.51-.52-.41-.71-.52-.48-.36-1-.73-.42-.32-.88-.61-.5-.33-.69-.46-.52-.36-.68-.44-.53-.34-.67-.42-.53-.32-.69-.42-.51-.31-.81-.49-.38-.22-1.16-.66-.46-.24-.75-.4-.5-.28-.7-.37-.54-.27-.66-.34-.51-.29-.69-.33L242.8,60l-.44-.2-1.17-.52-.37-.17-.83-.36-.49-.2-.72-.31-.52-.2-.68-.27-.52-.2-.7-.28-.5-.18-.73-.27-.48-.17-1.27-.43-1.1-.37-.29-.08a49.56,49.56,0,0,0-9.39-39.15C214.94,6.52,204.11,0,195,0a15.5,15.5,0,0,0-11.85,5.08,17,17,0,0,0-4.44,10.81A15.23,15.23,0,0,0,166,27.08a15.87,15.87,0,0,0,2.25,13.22c-3.66,3.39-6.94,8.65-7.3,17.2a109.54,109.54,0,0,0-15.51,6.78c-1.15.61-2.28,1.25-3.38,1.91l-2.87,1.69c-.69.43-1.38.88-2.08,1.34-2.08,1.36-4.14,2.82-6.2,4.4a25.5,25.5,0,0,0-2,1.7q-1.91,1.52-3.78,3.2c-1.25,1.11-2.84,2.57-4.25,3.94-2,2-3.91,4-5.81,6.18-.91,1-1.81,2.13-2.71,3.23s-1.39,1.7-2.06,2.63L109.14,96q-1.65,2.23-3.25,4.59c-1.07,1.58-2.3,3.54-3.39,5.38-.81,1.36-1.59,2.73-2.38,4.14-.58,1-1.16,2.11-1.7,3.2-1,2-2.08,4.11-3.08,6.28q-2.85,6.12-5.32,13c-1,2.79-2,5.68-2.87,8.69-.61,2-1.21,4.06-1.78,6.16s-1.05,4.05-1.54,6.13c-.15.64-.31,1.29-.44,2-.51,2.21-1,4.5-1.44,6.77q-.58,3-1.1,6.09-1,6.19-1.83,12.84-.88,7.63-1.42,15.86c-.21,3.08-.38,6.1-.53,9s-.29,5.86-.4,8.71-.21,5.63-.29,8.36V225c-2.64,0-10.67,0-32.17,35.15C31.8,280.49,21.4,302.25,17.12,316.94c-1.7,5.57-3.25,12.72-1.58,17.92h-.17l-.84.17-.38.08-.77.17-.36.1-.83.22-.27.09c-.36.1-.71.22-1.05.35H10.7l-.85.34-.32.14-.67.3-.33.17-.66.36-.28.15-.85.54c-.29.2-.58.41-.85.63l-.23.18-.56.49-.27.26-.77.76c-.17.2-.35.41-.52.63l-.15.2c-.22.29-.44.58-.65.88l-.13.22c-.15.24-.31.49-.44.75a3.05,3.05,0,0,1-.19.33,5.62,5.62,0,0,0-.34.72,2.54,2.54,0,0,1-.18.37l-.51,1-.14.36c-.13.39-.27.79-.39,1.22a12.62,12.62,0,0,0-.3,1.49A12.8,12.8,0,0,0,0,350.18a35.47,35.47,0,0,0,3.86,14.9,73.34,73.34,0,0,0,5.08,9.24c.85,1.29,1.69,2.6,2.69,3.92a121.49,121.49,0,0,0,21.49,22.38q3.71,3.06,7.85,6a162.35,162.35,0,0,0,15.14,9.6c18.2,10.16,41.21,18.8,69.42,23.39q6.78,1.11,14.09,1.89a303.23,303.23,0,0,0,32.45,1.7,227.06,227.06,0,0,0,37.91-3c4.46-.76,8.74-1.69,12.87-2.68,26.77-6.62,46.75-18.76,61.55-34.54.64-.67,1.27-1.37,1.88-2.06q1.5-1.68,2.93-3.39l1.49-1.84c1.47-1.88,2.87-3.78,4.23-5.74.74-1.07,1.47-2.15,2.17-3.25a128.82,128.82,0,0,0,8.12-14.57c.61-1.27,1.21-2.54,1.7-3.84.37-.83.72-1.69,1.08-2.49.74-1.79,1.47-3.59,2.15-5.42.49-1.29,1-2.61,1.42-4,.43-1.2.83-2.4,1.22-3.62l1.07-3.39a10.67,10.67,0,0,0,1.69.12,12,12,0,0,0,4-.68,53.85,53.85,0,0,0,18.83-10.8,45.44,45.44,0,0,0,13.07-20.4A63.3,63.3,0,0,0,353.73,292.31ZM189,43.59a.31.31,0,0,0,.21-.07.28.28,0,0,0,.12-.2.29.29,0,0,0,0-.22.26.26,0,0,0-.17-.14c-7.64-3.56-15.43-7-13.73-13.22.81-3,3.38-4.2,6.65-4.2A35.14,35.14,0,0,1,196.4,29.8a.22.22,0,0,0,.16,0,.29.29,0,0,0,.18-.05.44.44,0,0,0,.12-.15.31.31,0,0,0,0-.19.26.26,0,0,0-.09-.16c-5.54-5.68-11.53-11.67-6.32-17.63A5.75,5.75,0,0,1,195,9.93c10.59,0,31.45,17.69,27.42,43.41l-.49-.1-.67-.14-.49-.1-.7-.14-1.23-.22h-.39l-1.12-.18h-.22l-.93-.14h-.41l-.73-.1h-1.59l-.69-.08h-1.56l-.9-.09H195.58l-2.17.1h-.15l-2,.14h-.22l-1.86.15h-.3l-1.81.19h-.21l-1.81.22h-.13l-1.85.23-2.54.38-2.59.45-.69.14c-1.7.3-3.24.64-4.91,1l-.83.21-.36.08C173.11,44.91,181.64,44,189,43.59ZM31.32,306.19A318.19,318.19,0,0,1,56.08,259.6c11.12-17.29,17.61-23.18,19.84-24.4a1.35,1.35,0,0,1,.42-.2c2.73.13,6.27,3.23,9.35,8.16.1.18.22.35.32.52,9.11,15.14,12.6,42,2.66,60.73a52,52,0,0,1-6.77,9.93,57.38,57.38,0,0,1-23.71,15.88c-2.06.76-4,1.34-5.63,1.78-13.18,3.47-24,2-27.81-.12C24.43,331,23.31,325.41,31.32,306.19Zm280.81-1.25a219.9,219.9,0,0,1-6.91,38.94c-1,3.47-2,6.85-3.15,10.16a120.38,120.38,0,0,1-23,40.3A106.36,106.36,0,0,1,238,422.51c-18.36,7.2-40.48,10.85-65.8,10.85a286.06,286.06,0,0,1-36.3-2.2c-4.77-.61-9.48-1.33-14.09-2.18a204.18,204.18,0,0,1-49.33-15.46c-21.42-10-39.66-23.92-51.37-39.28C10.31,360.09,9.6,351.11,10,349.64c.9-3.18,2.78-5.64,17.71-5.64h8.06c11.09,0,19.52-1.51,26.41-4.74a64.73,64.73,0,0,0,35.29-30.21c12-22.67,7.46-53.21-2.91-70.46A34.62,34.62,0,0,0,86,228.68c.24-9.6.63-19.91,1.34-30.92,3-47.23,16-83,38.59-106.43a97.8,97.8,0,0,1,38.81-24.62A106,106,0,0,1,184.47,62a115.13,115.13,0,0,1,15.74-1.11,93.79,93.79,0,0,1,28.53,4.23A84.89,84.89,0,0,1,261.69,84.8c24.38,23.14,40.06,62.64,46.63,117.42,1.07,8.94,2.15,18.71,3,29C313.35,254.42,314.38,280.25,312.13,304.94Zm32.09-3.27a41.75,41.75,0,0,1-.44,5.45,48.41,48.41,0,0,1-1,5.08,37.36,37.36,0,0,1-4.76,11.18,35.57,35.57,0,0,1-2.84,3.84,18.5,18.5,0,0,1-1.61,1.69c-.56.51-1.15,1.14-1.69,1.7s-1.15,1-1.7,1.49a42.44,42.44,0,0,1-5.63,3.76c-1.27.71-2.58,1.35-3.88,1.93s-2.64,1.1-4,1.55c.39-1.59.74-3.2,1.1-4.8q1.29-6.06,2.25-12.26c.14-.93.29-1.86.41-2.8.35-2.37.66-4.77.95-7.18.18-1.69.35-3.38.52-5.07s.32-3.39.44-5.08c.2-2.54.37-5.08.53-7.62.08-1.7.17-3.39.23-5.08s.12-3.39.16-5.08v-17.8c0-1.69,0-3.38-.14-5.08s-.12-3.38-.19-5.08-.13-3.38-.22-5.08c-.23-4.6-.54-9.17-.88-13.69H322a2.11,2.11,0,0,1,.38.35q1.89,2.22,3.7,4.78c.91,1.28,1.79,2.62,2.67,4l.86,1.42a96.36,96.36,0,0,1,5.22,10.16c.78,1.69,1.52,3.55,2.22,5.38q1.57,4.13,2.84,8.47c.83,2.84,1.58,5.74,2.19,8.65a112.72,112.72,0,0,1,1.86,11.85c.12,1,.2,2,.25,3C344.23,297.85,344.27,299.79,344.22,301.67Z"
                                        />
                                        <path
                                            d="M159.63,475.8a10.85,10.85,0,0,1-10-7.1l-10-27.09q-7.26-.8-14.09-1.89c4.63,12.86,10.33,28.68,11.94,32.91.54,1.41,0,3.17-2.61,3.17H119.47s-4.66,10.27,8,9.9c35-1.05,31.19,27,42.21,21.67,10.6-5.08-9.58-21.7-9.27-21.67,40.29,5.08,27.42-9.94,27.42-9.94S167.32,475.8,159.63,475.8Z"
                                        />
                                        <path
                                            d="M235.23,462a4.78,4.78,0,0,1-2.77-.84,4.89,4.89,0,0,1-1.82-2.25c-1.85-4.64-5.33-14.51-7.79-21.32-4.13,1-8.46,1.91-12.87,2.67,2.66,7.35,6.35,17.53,6.66,18.51.73,2.25.2,3.1-3.78,3.1h-15s-4.32,9.65,12.23,9.65c33.76,0,26.73,28.38,39.72,21.11,8.29-4.64-7.11-17.72-8.35-19.28-.71-.88-.14-2.12,1.69-1.85,34.49,5.27,26-9.63,26-9.63S245.35,462,235.23,462Z"
                                        />
                                        <path
                                            d="M182.7,173a7.55,7.55,0,1,0-9.08-5.61A7.54,7.54,0,0,0,182.7,173Z"
                                        />
                                        <path
                                            d="M264.68,172a7.55,7.55,0,1,0-10.4-2.45A7.55,7.55,0,0,0,264.68,172Z"
                                        />
                                        <path
                                            d="M242.92,192l-19.12-7.92a5.81,5.81,0,0,0-2-.36,5.91,5.91,0,0,0-2,.36L200.64,192a3.29,3.29,0,0,0-1.55,1,3.2,3.2,0,0,0-.73,1.71,3.25,3.25,0,0,0,.32,1.84,3.33,3.33,0,0,0,1.28,1.35l19.4,12.58a3.84,3.84,0,0,0,2.41.71,3.8,3.8,0,0,0,2.39-.71l19.43-12.58a3.25,3.25,0,0,0,.88-4.9A3.39,3.39,0,0,0,242.92,192Z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div class="bottom-line"></div>
                            <div class="promote-title">
                                <a href="//github.com/patelka2211/view" target="_blank">
                                    Visit <span>patelka2211/view</span> on GitHub
                                </a>
                            </div>
                            <div class="view-repo">
                                <a href="//github.com/patelka2211/view" target="_blank">
                                    <img
                                        src="//opengraph.githubassets.com/1/patelka2211/view"
                                        alt="patelka2211/view"
                                    />
                                </a>
                            </div>
                        </div>
                        <div class="space"></div>`;
            },
        };

        this.save_path = (tab, uid) => {
            return `view/${tab}/${uid}`;
        };
    }

    set_profile(uid) {
        document.title = `${uid} / profile`;
        let time_now = Date.now();
        let make_obj = () => {
            let profile_json = get_data_from_api(
                `https://api.github.com/users/${uid}`,
                Object
            );

            let followers_count;
            if (!ss_has_key(this.save_path("social/followers", uid))) {
                followers_count = get_data_from_api(
                    `https://api.github.com/users/${uid}/followers`,
                    Object
                );
                save_to_ss(this.save_path("social/followers", uid), {
                    last_update: time_now,
                    data: followers_count,
                });
                followers_count = followers_count.length;
            } else {
                let social_followers = get_from_ss(
                    this.save_path("social/followers", uid)
                );
                if (
                    (time_now - social_followers.last_update) / (1000 * 60) >=
                    5
                ) {
                    followers_count = get_data_from_api(
                        `https://api.github.com/users/${uid}/followers`,
                        Object
                    );
                    save_to_ss(this.save_path("social/followers", uid), {
                        last_update: time_now,
                        data: followers_count,
                    });
                    followers_count = followers_count.length;
                } else {
                    followers_count = social_followers.data.length;
                }
            }

            let following_count;
            if (!ss_has_key(this.save_path("social/following", uid))) {
                following_count = get_data_from_api(
                    `https://api.github.com/users/${uid}/following`,
                    Object
                );
                save_to_ss(this.save_path("social/following", uid), {
                    last_update: time_now,
                    data: following_count,
                });
                following_count = following_count.length;
            } else {
                let social_following = get_from_ss(
                    this.save_path("social/following", uid)
                );
                if (
                    (time_now - social_following.last_update) / (1000 * 60) >=
                    5
                ) {
                    following_count = get_data_from_api(
                        `https://api.github.com/users/${uid}/following`,
                        Object
                    );
                    save_to_ss(this.save_path("social/following", uid), {
                        last_update: time_now,
                        data: following_count,
                    });
                    following_count = following_count.length;
                } else {
                    following_count = social_following.data.length;
                }
            }

            let repo_count;
            if (!ss_has_key(this.save_path("repo", uid))) {
                repo_count = get_data_from_api(
                    `https://api.github.com/users/${uid}/repos`,
                    Object
                );
                save_to_ss(this.save_path("repo", uid), {
                    last_update: time_now,
                    data: repo_count,
                });
                repo_count = repo_count.length;
            } else {
                let repo_data = get_from_ss(this.save_path("repo", uid));
                if ((time_now - repo_data.last_update) / (1000 * 60) >= 5) {
                    repo_count = get_data_from_api(
                        `https://api.github.com/users/${uid}/repos`,
                        Object
                    );
                    save_to_ss(this.save_path("repo", uid), {
                        last_update: time_now,
                        data: repo_count,
                    });
                    repo_count = repo_count.length;
                } else {
                    repo_count = repo_data.data.length;
                }
            }

            return {
                uid: profile_json.login,
                id_no: profile_json.id,
                name: profile_json.name,
                bio: profile_json.bio,
                tw_uid: profile_json.twitter_username,
                followers_count: followers_count,
                following_count: following_count,
                repo_count: repo_count,
            };
        };

        let profile_data;
        if (!ss_has_key(this.save_path("profile", uid))) {
            profile_data = make_obj();
            save_to_ss(this.save_path("profile", uid), {
                last_update: time_now,
                data: profile_data,
            });
        } else {
            profile_data = get_from_ss(this.save_path("profile", uid));
            if ((time_now - profile_data.last_update) / (1000 * 60) >= 5) {
                profile_data = make_obj();
                save_to_ss(this.save_path("profile", uid), {
                    last_update: time_now,
                    data: profile_data,
                });
            } else {
                profile_data = get_from_ss(this.save_path("profile", uid)).data;
            }
        }

        document.getElementById("header").innerHTML = this.profile.header;
        document.getElementById("root").innerHTML = this.profile.root(
            profile_data.id_no,
            profile_data.uid,
            profile_data.followers_count,
            profile_data.following_count,
            profile_data.repo_count,
            profile_data.tw_uid,
            profile_data.bio
        );
    }

    set_repo(uid) {
        document.title = `${uid} / repos`;
        let time_now = Date.now();
        let repo_count, repo_data;
        if (!ss_has_key(this.save_path("repo", uid))) {
            repo_data = get_data_from_api(
                `https://api.github.com/users/${uid}/repos`,
                Object
            );
            save_to_ss(this.save_path("repo", uid), {
                last_update: time_now,
                data: repo_data,
            });
        } else {
            repo_data = get_from_ss(this.save_path("repo", uid));
            if ((time_now - repo_data.last_update) / (1000 * 60) >= 5) {
                repo_data = get_data_from_api(
                    `https://api.github.com/users/${uid}/repos`,
                    Object
                );
                save_to_ss(this.save_path("repo", uid), {
                    last_update: time_now,
                    data: repo_data,
                });
            } else {
                repo_data = repo_data.data;
            }
        }

        let optimize = false;
        repo_count = repo_data.length;
        if (repo_count != 0 && repo_data[0].hasOwnProperty("id")) {
            optimize = true;
        }

        document.getElementById("header").innerHTML =
            this.repo.header(repo_count);
        document.getElementById("root").innerHTML = this.repo.root(
            repo_data,
            uid,
            optimize
        );
    }

    set_star(uid) {
        document.title = `${uid} / starred`;
        let time_now = Date.now();
        let repo_count, repo_data;
        if (!ss_has_key(this.save_path("star", uid))) {
            repo_data = get_data_from_api(
                `https://api.github.com/users/${uid}/starred`,
                Object
            );
            save_to_ss(this.save_path("star", uid), {
                last_update: time_now,
                data: repo_data,
            });
        } else {
            repo_data = get_from_ss(this.save_path("star", uid));
            if ((time_now - repo_data.last_update) / (1000 * 60) >= 5) {
                repo_data = get_data_from_api(
                    `https://api.github.com/users/${uid}/starred`,
                    Object
                );
                save_to_ss(this.save_path("star", uid), {
                    last_update: time_now,
                    data: repo_data,
                });
            } else {
                repo_data = repo_data.data;
            }
        }

        let optimize = false;
        repo_count = repo_data.length;
        if (repo_count != 0 && repo_data[0].hasOwnProperty("id")) {
            optimize = true;
        }

        document.getElementById("header").innerHTML =
            this.star.header(repo_count);
        document.getElementById("root").innerHTML = this.star.root(
            repo_data,
            uid,
            optimize
        );
    }

    set_social(uid, action = "followers") {
        if (
            document.getElementById("followers") == null ||
            document.getElementById("following") == null
        ) {
            document.getElementById("header").innerHTML = this.social.header;
        }
        document.getElementById(action).checked = true;
        document.title = `${uid} / ${action}`;
        let time_now = Date.now();
        let user_count, user_data;
        if (!ss_has_key(this.save_path(`social/${action}`, uid))) {
            user_data = get_data_from_api(
                `https://api.github.com/users/${uid}/${action}`,
                Object
            );
            save_to_ss(this.save_path(`social/${action}`, uid), {
                last_update: time_now,
                data: user_data,
            });
        } else {
            user_data = get_from_ss(this.save_path(`social/${action}`, uid));
            if ((time_now - user_data.last_update) / (1000 * 60) >= 5) {
                user_data = get_data_from_api(
                    `https://api.github.com/users/${uid}/${action}`,
                    Object
                );
                save_to_ss(this.save_path(`social/${action}`, uid), {
                    last_update: time_now,
                    data: user_data,
                });
            } else {
                user_data = user_data.data;
            }
        }

        let optimize = false;
        user_count = user_data.length;
        if (user_count != 0 && user_data[0].hasOwnProperty("id")) {
            optimize = true;
        }

        document.getElementById("root").innerHTML = this.social.root(
            user_data,
            uid,
            action,
            optimize
        );
    }

    set_share(uid) {
        document.title = `${uid} / share`;
        document.getElementById("header").innerHTML = this.share.header;
        document.getElementById("root").innerHTML = this.share.root(uid);

        let other_options_tag = document.getElementById("other-options");
        let share_someone_area_tag =
            document.getElementById("share-someone-area");
        let uid_to_be_shared = document.getElementById("share-uid");
        let input_tag = document.getElementById("share-uid-input");

        let show_error = () => {
            other_options_tag.classList.add("error");
            share_someone_area_tag.innerText =
                "Username can't have blank space";
            setTimeout(() => {
                share_someone_area_tag.innerText =
                    "or share someone else's profile";
                other_options_tag.classList.remove("error");
            }, 1600);
        };
        input_tag.onkeyup = () => {
            if (input_tag.value.includes(" ")) {
                show_error();
                input_tag.value = input_tag.value.trim();
            }

            if (input_tag.value == "") {
                uid_to_be_shared.innerText = uid;
            } else {
                uid_to_be_shared.innerText = input_tag.value;
            }
        };

        let share_api_obj = new share_api(uid_to_be_shared);
        share_api_obj.assign_tasks();
    }
}

class navbar_api {
    constructor(default_tab = null) {
        this.control_url_obj = new control_url();
        this.app_manager_obj = new app_manager();

        for (let index = 0; index < tabs.length; index++) {
            document
                .getElementById(`${tabs[index]}-btn`)
                .addEventListener("click", () => {
                    this.open_tab(tabs[index]);
                });
        }

        if (default_tab != null) {
            document.getElementById(`${default_tab}-btn`).checked = true;
            this.open_tab(default_tab);
        }
    }

    open_tab(tab_id, action = "followers") {
        if (tab_id == "profile") {
            this.control_url_obj.add_or_update_search_params("tab", "profile");
            this.app_manager_obj.set_profile(
                this.control_url_obj.get_object().uid
            );

            // Opening repos list from profile tab
            document
                .getElementById("open-repo-btn")
                .addEventListener("click", () => {
                    document.getElementById(`repo-btn`).checked = true;
                    this.open_tab("repo");
                });

            // Opening star repos list from profile tab
            document
                .getElementById("open-star-btn")
                .addEventListener("click", () => {
                    document.getElementById(`star-btn`).checked = true;
                    this.open_tab("star");
                });

            // Opening followers list from profile tab
            document
                .getElementById("open-followers-btn")
                .addEventListener("click", () => {
                    document.getElementById(`social-btn`).checked = true;
                    this.open_tab("social", "followers");
                });

            // Opening following list from profile tab
            document
                .getElementById("open-following-btn")
                .addEventListener("click", () => {
                    document.getElementById(`social-btn`).checked = true;
                    this.open_tab("social", "following");
                });
        } else if (tab_id == "repo") {
            this.control_url_obj.add_or_update_search_params("tab", "repo");
            this.app_manager_obj.set_repo(
                this.control_url_obj.get_object().uid
            );
        } else if (tab_id == "social") {
            this.control_url_obj.add_or_update_search_params("tab", "social");
            this.app_manager_obj.set_social(
                this.control_url_obj.get_object().uid,
                action
            );

            // Opening followers list
            document
                .getElementById("followers")
                .addEventListener("click", () => {
                    this.open_tab("social", "followers");
                });
            // Opening following list
            document
                .getElementById("following")
                .addEventListener("click", () => {
                    this.open_tab("social", "following");
                });
        } else if (tab_id == "star") {
            this.control_url_obj.add_or_update_search_params("tab", "star");
            this.app_manager_obj.set_star(
                this.control_url_obj.get_object().uid
            );
        } else if (tab_id == "share") {
            this.control_url_obj.add_or_update_search_params("tab", "share");
            this.app_manager_obj.set_share(
                this.control_url_obj.get_object().uid
            );
        }
    }
}

let control_url_obj = new control_url();
let search_params = () => {
    return control_url_obj.get_object();
};

if (
    !Object(search_params()).hasOwnProperty("tab") ||
    !tabs.includes(search_params().tab)
) {
    control_url_obj.add_or_update_search_params("tab", "profile");
}

if (!Object(search_params()).hasOwnProperty("uid")) {
    control_url_obj.add_or_update_search_params("uid", "patelka2211");
}

let navbar_api_obj = new navbar_api(search_params().tab);

if (!ss_has_key(`nav/dp/${search_params().id}`)) {
    let user_dp = get_data_from_api(
        `https://api.github.com/users/${search_params().uid}`,
        Object
    );

    document
        .getElementById("user-dp")
        .setAttribute(
            "src",
            `https://avatars.githubusercontent.com/u/${user_dp.id}`
        );
    document.getElementById("user-dp").setAttribute("alt", search_params().uid);
    document
        .getElementById("favicon")
        .setAttribute(
            "href",
            `https://avatars.githubusercontent.com/u/${user_dp.id}`
        );
} else {
    document
        .getElementById("user-dp")
        .setAttribute(
            "src",
            `https://avatars.githubusercontent.com/u/${get_from_ss(
                `nav/dp/${search_params().uid}`
            )}`
        );
    document.getElementById("user-dp").setAttribute("alt", search_params().uid);
    document
        .getElementById("favicon")
        .setAttribute(
            "href",
            `https://avatars.githubusercontent.com/u/${user_dp.id}`
        );
}

if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    document.body.classList.add("dark");
}
