class Github {
    constructor () {
        this.client_id = '3ac742da9de1fd085b4e';
        this.client_secret = 'c61b093f92e5fd8c2fee4361b6f40fa87afbccbe';
        this.repos_count = 5;
        this.repos_sort = 'created: asc';
    }

    async getUser(user) {
        const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);

        const repoResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`);

        const profile = await profileResponse.json();
        const repos = await repoResponse.json();

        return {
            // aka profile: profile === profile
            profile,
            repos
        }
    }
}