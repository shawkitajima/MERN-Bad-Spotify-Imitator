const BASE_URL = '/api/spotify/';

module.exports = {
    login,
}

function login(user) {
    return fetch(BASE_URL + 'login/' + user).then(res => {
        console.log(res);
    })
}