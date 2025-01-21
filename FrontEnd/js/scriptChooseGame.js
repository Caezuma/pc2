document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:4000/game')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(games => {
      const gameList = document.getElementById('game-list');
      gameList.innerHTML = '';

      games.forEach(game => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="game-details">
            <div class="left">
              <strong class="title">Title:</strong> ${game.title}<br>
              <strong class="game-owner">Game Owner:</strong> ${game.gameowner}
            </div>
            <div class="right">
              <strong class="${game.statusgame ? 'status-active' : 'status-inactive'}">Status:</strong> ${game.statusgame ? 'Active' : 'Inactive'}
              </div>
            <button class="join-button">Join</button>
          </div>
        `;
        gameList.appendChild(li);
      });

      const joinButtons = document.querySelectorAll('.join-button');
      joinButtons.forEach(button => {
        button.addEventListener('click', () => {
          ipcRenderer.send('run-game');
        });
      });

      if (registerButton) {
      registerButton.addEventListener('click', async () => {
      const nameplayer = document.getElementById('nameplayer').value;
      const age = document.getElementById('age').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (nameplayer && age && email && password) {
        try {
          const response = await fetch('http://localhost:4000/player', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nameplayer, age, email, userpassword: password }),
          });

          const data = await response.json();

          if (response.ok) {
            ipcRenderer.send('open-login'); 
          } else {
            alert(data.error); 
          }
        } catch (error) {
          console.error('Error in request:', error);
        }
      } else {
        alert('Please fill in all fields.');
      }
    });
  }

    })
    .catch(error => {
      console.error('Error loading game list:', error);
    });

    const { ipcRenderer } = require('electron');
});


