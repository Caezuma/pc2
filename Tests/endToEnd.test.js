const fetch = require('node-fetch');

describe('Player End-to-End Tests', () => {
  test('should register a new user successfully', async () => {
    const response = await fetch('http://localhost:4000/player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nameplayer: 'newPlayer',
        age: 25,  
        email: `newplayer${Date.now()}@example.com`,
        userpassword: 'password123'
      })
    });


    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('User registered successfully');
  });

  test('should not register a user if the email already exists', async () => {
    const response = await fetch('http://localhost:4000/player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nameplayer: 'existingPlayer',
        age: 30,  
        email: 'newplayer@example.com', 
        userpassword: 'password123'
      })
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('User already exists');
  });

  test('should log in a user successfully', async () => {
    const response = await fetch('http://localhost:4000/player/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newplayer@example.com',  
        userpassword: 'password123'
      })
    });
  
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.access_token).toBeDefined();  
  });
  
  test('should log out a user successfully', async () => {
    const response = await fetch('http://localhost:4000/player/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer GciOiJIUzI1NiIsInR5cCI6IkpXV`  
      }
    });
  
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('User logged out successfully');
  });
  
  test('should add a player to the game successfully', async () => {
    const response = await fetch('http://localhost:4000/player/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer valid-jwt-token-here`  
      },
      body: JSON.stringify({
        gameId: 1,  
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWVwbGF5ZXIiOiJqdXJlbW8iLCJlbWFpbCI6Imp1cmVtbzEzNCIsImdhbWVpZCI6bnVsbCwiaWF0IjoxNzI0OTMyODgyLCJleHAiOjE3MjQ5NDAwODJ9.G_dQbDbsvbXHfiqwl_ZRVD_jc88Y0nN5cu27hvDDucQ"
      })
    });
  
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('User joined the game successfully');
  });

  test('should remove a player from the game successfully', async () => {
    const response = await fetch('http://localhost:4000/player/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer valid-jwt-token-here`  
      },
      body: JSON.stringify({
        gameId: 1,  
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWVwbGF5ZXIiOiJqdXJlbW8iLCJlbWFpbCI6Imp1cmVtbzEzNCIsImdhbWVpZCI6bnVsbCwiaWF0IjoxNzI0OTMyODgyLCJleHAiOjE3MjQ5NDAwODJ9.G_dQbDbsvbXHfiqwl_ZRVD_jc88Y0nN5cu27hvDDucQ"
     })
    });
  
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('User left the game successfully');
  });
  
  
});
