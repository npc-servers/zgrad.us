document.addEventListener('DOMContentLoaded', function() {
    const servers = [
        {
            id: 'zgrad1',
            ip: '193.243.190.18',
            port: 27066
        },
        {
            id: 'zgrad2',
            ip: '193.243.190.18',
            port: ''
        }
    ];

    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
        var img = card.querySelector('.card-img');
        var title = card.querySelector('.card-title');
        var description = card.querySelector('.card-description');
        var button = card.querySelector('.server-button');
        var status = card.querySelector('.card-status');
        var players = card.querySelector('.card-players');
        var cannotConnect = card.querySelector('.cannot-connect');

        img.src = card.dataset.imgSrc;
        title.textContent = card.dataset.title;
        description.textContent = card.dataset.description;
        button.href = card.dataset.link;

        const server = servers.find(s => s.id === card.dataset.id);

        if (server) {
            fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${server.ip}&port=${server.port}&type=info`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(serverInfo => {
                    if (
                        (serverInfo && serverInfo.status && serverInfo.status.toLowerCase() === 'online') ||
                        (serverInfo && (serverInfo.players !== undefined || serverInfo.map))
                    ) {
                        status.classList.add('online');
                        status.classList.remove('offline');
                        status.style.filter = 'none';

                        const currentPlayers = serverInfo.players || serverInfo.num_players || serverInfo.playercount || 0;
                        const maxPlayers = serverInfo.maxplayers || serverInfo.max_players || serverInfo.maxclients || "Unknown";

                        players.textContent = `${currentPlayers}/${maxPlayers} players online`;

                        button.classList.remove('disabled');
                        button.style.display = 'inline-block';
                        cannotConnect.style.display = 'none';
                    } else {
                        status.classList.add('offline');
                        status.classList.remove('online');
                        status.style.filter = 'none';
                        players.textContent = 'Server Offline';
                        button.classList.add('disabled');
                        button.style.display = 'none';
                        cannotConnect.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error(`Error fetching data for ${server.id}:`, error);
                    status.classList.add('offline');
                    status.classList.remove('online');
                    status.style.filter = 'none';
                    players.textContent = 'Server Offline';
                    button.classList.add('disabled');
                    button.style.display = 'none';
                    cannotConnect.style.display = 'block';
                });
        }
    });
});