if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    document.body.classList.toggle("dark-mode");
}

document.getElementById('year').innerHTML = new Date().getFullYear();

let error_msg = document.getElementById('error');

let uname_input = document.getElementById('uname_input');

let external_links = document.getElementById('external_links');

function main() {
    if (uname_input.value.indexOf(' ') != -1) {
        uname_input.value = uname_input.value.trim();
        uname_input.placeholder = 'It can\'t have blank space';
        uname_input.focus();
        error_msg.classList.add('show');
        setTimeout(() => {
            error_msg.classList.remove('show');
            uname_input.placeholder = 'Enter valid GitHub username';
        }, 1600);
        external_links.classList.add('hide');
    }
    if (uname_input.value == '' || uname_input.value == null) {
        external_links.classList.add('hide');
    }
    else {
        external_links.classList.remove('hide');

        external_links.innerHTML = `<a target="_blank" href="/user/?uid=${uname_input.value}">user / <span class="input_value">${uname_input.value}</span></a>
                                <a target="_blank" href="/repos/?uid=${uname_input.value}"><span class="input_value">${uname_input.value}</span> / repo</a>
                                <a target="_blank" href="/star/?uid=${uname_input.value}"><span class="input_value">${uname_input.value}</span> / starred</a>
                                <a target="_blank" href="/social/?uid=${uname_input.value}&see=followers"><span class="input_value">${uname_input.value}</span> / followers</a>
                                <a target="_blank" href="/social/?uid=${uname_input.value}&see=following"><span class="input_value">${uname_input.value}</span> / following</a>`;
    }
}