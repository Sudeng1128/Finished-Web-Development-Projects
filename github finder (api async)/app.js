//init Github
const github = new Github;

// init UI
const ui = new UI;

const searchUser = document.getElementById('searchUser');

searchUser.addEventListener('keyup', (e) => {
    // what is typed into the search bar
    const userText = e.target.value;

    if (userText !== '') {
        github.getUser(userText).then(data => {
            if (data.profile.message === 'Not Found') {
                ui.showAlert('User not found', 'alert alert-danger');
            } else {
                ui.showProfile(data.profile);
                ui.showRepos(data.repos);
            }
        })
    } else {
        ui.clearProfile();
    }
})