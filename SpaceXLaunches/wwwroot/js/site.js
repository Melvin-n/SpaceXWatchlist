document.addEventListener('DOMContentLoaded', () => {

    const openOffcanvas = document.getElementById('openOffcanvas');
    const closeOffcanvas = document.getElementById('closeOffcanvas')
    const offcanvas = document.getElementById('offcanvas-launch-table')

    openOffcanvas.addEventListener('click', () => {
        offcanvas.classList.add('open')
    })

    closeOffcanvas.addEventListener('click', () => {
        offcanvas.classList.remove('open')
    })

    fetchLaunches()
    fetchWatchlist()
   
});

// fetch watchlist from db
const fetchWatchlist = () => {
    fetch('http://localhost:5237/api/launches')
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(data => {
            displayWatchList(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// fetch launches from SpaceX API
const fetchLaunches = () => {
    fetch('https://api.spacexdata.com/v5/launches')
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(data => {
            // map through each launch in API response
            const launchDataArray = data.map(data => ({
                id: data.id,
                name: data.name,
                launchTime: data.date_local,
                success: data.success,
                webcast: data.links.webcast,
                details: data.details,
            }))
            displayLaunchData(launchDataArray)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('apiData').innerHTML = 'Failed to load data.';
        });
}

function displayLaunchData(launchDataArray) {
    const tableBody = document.getElementById('launchDataTable');
    tableBody.innerHTML = ''; 

    launchDataArray.forEach(launch => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>${launch.name}</td>
                    <td>${launch.launchTime}</td>
                    <td>${launch.success ? 'Yes' : 'No'}</td>
                    <td><button class="addButton" data-id="${launch.id}" data-name="${launch.name}" data-launchTime="${launch.launchTime}" data-success="${launch.success}" data-video="${launch.webcast}" data-details="${launch.details}">Add</button></td>
            `
                    ;

        tableBody.appendChild(row);
    });

    // each row will have a button which when clicked, will save the launch to the watchlist
    document.querySelectorAll('.addButton').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log("yoooo")
            const row = e.target
            const launchData = {
                id: row.getAttribute('data-id'),
                name: row.getAttribute('data-name'),
                success: row.getAttribute('data-success'),
                launchTime: row.getAttribute('data-launchTime'),
                webcast: row.getAttribute('data-webcast'),
                details: row.getAttribute('data-details'),
            }

            // post request to backend
            fetch('/api/launches/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(launchData)
            })
                .then(response => {
                    console.log(response)
                    if (response.ok) {
                        alert('Launch data added successfully!');
                    } else {
                        alert('Failed to add launch data, the launch you selected may already exist in your watchlist.');
                        return
                    }
                    fetchWatchlist()
                    return
                })
        })
    })
}


const displayWatchList = (storedLaunches) => {
    const tableBody = document.getElementById('watchListTable');
    tableBody.innerHTML = '';

    storedLaunches.forEach(launch => {
        const row = document.createElement('tr');

        row.innerHTML = 
                    `
                    <td>${launch.name}</td>
                    <td>${launch.launchTime}</td>
                    <td>${launch.success}</td>
                    <td>${launch.webcast ? `<a href="${launch.webcast}" target="_blank">Webcast Link</a>` : 'No webcast available'}</td>
                    <td>${launch.details}</td>
                    `
                        ;

        tableBody.appendChild(row);
    });
}