const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const registerNewUserButton = document.getElementById('register-new-user-button');
  const registerButton = document.getElementById('register-button');
  const loginButton = document.getElementById('login-button');
  const backButton = document.getElementById('back-button');
  const leaveButton = document.getElementById('leave-button');
  const logoutButton = document.getElementById('logout-button');
  const createButton = document.getElementById('create-button');
  const backChooseGameButton = document.getElementById('back-choose-game-button');
  const createGameButton = document.getElementById('create-game-button');

  


  if (backChooseGameButton) {
    backChooseGameButton.addEventListener('click', () => {
    ipcRenderer.send('open-choose-game');
  });
  }

  if (createButton) {
    createButton.addEventListener('click', () => {
    ipcRenderer.send('open-create');
  });
  }


  if (registerNewUserButton) {
      registerNewUserButton.addEventListener('click', () => {
      ipcRenderer.send('open-register');
    });
  }

  if (backButton) {
      backButton.addEventListener('click', () => {
      ipcRenderer.send('open-login');
  });
  }

  if (leaveButton) {
    leaveButton.addEventListener('click', () => {
    ipcRenderer.send('open-choose-game');
  }); 
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
    ipcRenderer.send('open-login');
  }); 
  }

  if (loginButton) {
    loginButton.addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      if (email && password) {
        try {
          const response = await fetch('http://localhost:4000/player/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, userpassword: password }),
          });
  
          const data = await response.json();
  
          if (response.ok) {

            const accessToken = data.access_token;
            localStorage.setItem('access_token', accessToken);
  
            const playerResponse = await fetch('http://localhost:4000/player/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ access_token: accessToken }),
            });
  
            const playerData = await playerResponse.json();
  
            if (playerResponse.ok) {
              localStorage.setItem('player_name', playerData.nameplayer);
              ipcRenderer.send('open-choose-game'); 
            } else {
              alert(playerData.error); 
            }
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

  if (createGameButton) {
    createGameButton.addEventListener('click', async () => {
    const title= document.getElementById('title').value;
    const rules = document.getElementById('rules').value;

    if (title && rules) {
      try {
        const response = await fetch('http://localhost:4000/game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({title, rules}),
        });

        const data = await response.json();

        if (response.ok) {
          ipcRenderer.send('open-choose-game'); 
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

 

  const { ipcRenderer } = require('electron');



});
