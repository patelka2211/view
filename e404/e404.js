let continue_btn = document.getElementById('continue');
let uname_input = document.getElementById('uname_input');

continue_btn.addEventListener('click', () => {
    if (uname_input.value == '' || uname_input.value == null || uname_input.value.trim() == '') {
        uname_input.value ='';
        uname_input.placeholder = 'It can\'t be empty';
        uname_input.focus();
        setTimeout(() => {
            uname_input.placeholder = 'Enter valid GitHub username';
        }, 1600);
        return;
    } else if (uname_input.value.trim().split(' ').length != 1) {
        uname_input.value ='';
        uname_input.placeholder = 'Invalid username';
        uname_input.focus();
        setTimeout(() => {
            uname_input.placeholder = 'Enter valid GitHub username';
        }, 1600);
        return;
    }
    location.replace(`user/?uid=${uname_input.value.trim()}`);
});