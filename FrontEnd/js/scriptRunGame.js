const playerName = localStorage.getItem('player_name');
document.getElementById('top-card-image').addEventListener('click', buyCard);

async function fetchCard() {
    try {
        const response = await fetch('http://localhost:4000/game/top/1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao obter a carta');
        }

        const data = await response.json();
        const cardFileName = data.topCardDeck;

        if (cardFileName) {
            const imagePath = `../../UnoImage/CardPackage/${cardFileName}.png`;

            const cardImage = document.getElementById('card-image');
            cardImage.src = imagePath;
            cardImage.classList.add('player-card'); 
            cardImage.style.display = 'block';
        } else {
            document.getElementById('card-image').style.display = 'none'; 
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('card-image').style.display = 'none'; 
    }
}

async function fetchPlayerCards(playerName) {
    try {
        const response = await fetch('http://localhost:4000/card/hands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ player: playerName })
        });

        if (!response.ok) {
            throw new Error('Erro ao obter as cartas do jogador');
        }

        const data = await response.json();
        const cards = data.cards;

        const cardsContainer = document.getElementById('cards-player');
        cardsContainer.innerHTML = ''; 

        if (cards && cards.length > 0) {
            cards.forEach(card => {
                const cardImage = document.createElement('img');
                const imagePath = `../../UnoImage/CardPackage/${card}.png`;
                cardImage.src = imagePath;
                cardImage.alt = card;
                cardImage.classList.add('player-card');
                cardImage.style.display = 'block'; 
                
                cardImage.addEventListener('click', () => playCard(playerName, card));

                cardsContainer.appendChild(cardImage);
                console.log('Carta adicionada:', card);
            });
        } else {
            cardsContainer.innerHTML = '<p>O jogador não tem cartas.</p>';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('cards-container').innerHTML = '<p>Erro ao carregar as cartas.</p>';
    }
}

async function playCard(playerName, card) {
    try {
        const response = await fetch('http://localhost:4000/card/play/1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player: playerName,
                cardPlayer: card
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao jogar a carta');
        }
        
        const originalCard = document.querySelector(`img[alt='${card}']`);
        const clone = originalCard.cloneNode(true);
        document.body.appendChild(clone);

        const rect = originalCard.getBoundingClientRect();
        clone.style.position = 'absolute';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`; 
        clone.style.height = `${rect.height}px`;
        clone.style.margin = '0'; 
        clone.style.zIndex = '1000';

        clone.classList.add('card-playing');

        clone.addEventListener('animationend', function () {
            clone.remove();
        });

        fetchPlayerCards(playerName);
        fetchCard();

    } catch (error) {
        console.error('Erro ao jogar a carta:', error);
    }
}



async function buyCard() {
    const playerName = localStorage.getItem('player_name');

    try {
        const response = await fetch('http://localhost:4000/card/buy/1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player: playerName }),
        });

        if (!response.ok) {
            throw new Error('Erro ao comprar a carta');
        }

        const card = document.getElementById('top-card-image');
        const clone = card.cloneNode(true);
        document.body.appendChild(clone);

        const rect = card.getBoundingClientRect();
        clone.style.position = 'absolute';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.zIndex = '1000';

        clone.classList.add('card-to-player');

        clone.addEventListener('animationend', function () {
            clone.remove();
        });

        fetchPlayerCards(playerName);

    } catch (error) {
        console.error('Erro ao comprar a carta:', error);
    }
}




fetchPlayerCards(playerName);


fetchCard(); 