import { http } from './http';
import { ui } from './ui';

// get posts on DOM load
document.addEventListener('DOMContentLoaded', getposts);

// listen for add posts
document.querySelector('.post-submit').addEventListener('click', submitPost);

// listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

// listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);

// listen for cancel edit
document.querySelector('.card-form').addEventListener('click', cancelEdit);

// get posts
function getposts () {
    // the .get returns a promise so we use .then
    http.get('http://localhost:3000/posts').then(data => {ui.showPosts(data)}).catch();
}

// submit posts
function submitPost () {
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;

    const data = {
        title,
        body
    }

    if (title === '' || body === '') {
        ui.showAlert('please fill in all fields', 'alert alert-warning');
    } else {
        // check for id
        if (id === '') {
            // create post
            http.post('http://localhost:3000/posts', data)
            .then(data => {
            ui.showAlert('Post added', 'alert alert-success');
            ui.clearFields();
            getPosts();
            })
            .catch(err => console.log(err));
        } else {
            // update post
            http.put(`http://localhost:3000/posts/${id}`, data)
            .then(data => {
            ui.showAlert('Post updated', 'alert alert-success');
            ui.changeFormState('add');
            getPosts();
            })
            .catch(err => console.log(err));
        }

    }
}

// delete post
function deletePost (e) {
    if (e.target.parentElement.classList.contains('delete')) {
        const id = e.target.parentElement.dataset.id;
        if (confirm('Are you sure')) {
            // makes a http request to remove from data base
            http.delete(`http://localhost:3000/posts/${id}`)
            .then(data => {
                showAlert('post removed', 'alert alert-danger');
                getPosts();
            }).catch(err => console.log(err));
        }
    }

    e.preventDefault();
}

// enable edit state
function enableEdit (e) {
    if (e.target.classList.contains('fa-pencil')) {
        const id = e.target.parentElement.dataset.id;
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        const body = e.target.parentElement.previousElementSibling.textContent;

        const data = {
            id,
            title,
            body
        }

        ui.fillForm(data);
    }

    e.preventDefault();
}

function cancelEdit(e) {
    if (e.target.classList.contains('post-cancel')) {
        ui.changeFormState('add');
    }

    e.preventDefault();
}