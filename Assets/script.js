// Game Object
let BlackJack = {
    'you': { 'scoreSpan': '#urs-result', 'div': '#YouBox', 'score': 0 },
    'dealer': { 'scoreSpan': '#bot-result', 'div': '#DealerBox', 'score': 0 },
    'cards': ['AH', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'KH', 'QH'],
    'cardValue': { 'AH': [1, 11], '2H': 2, '3H': 3, '4H': 4, '5H': 5, '6H': 6, '7H': 7, '8H': 8, '9H': 9, '10H': 10, 'JH': 10, 'KH': 10, 'QH': 10 },
    'win': 0,
    'loss': 0,
    'draw': 0,
    'isHit': false,
    'isStand': false,
    'turnsOver': false,
};

const YOU = BlackJack['you'];
const DEALER = BlackJack['dealer'];

// Adding audios
const hitSound = new Audio('Assets/Sounds/swish.m4a');
const winSound = new Audio('Assets/Sounds/cash.mp3');
const lossSound = new Audio('Assets/Sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click', hit); // 

document.querySelector('#stand').addEventListener('click', dealerPlay); // 

document.querySelector('#deal').addEventListener('click', deal); // 

// Function for Hit button
function hit(e) {

    if (BlackJack['isStand'] === false) {
        BlackJack['turnsOver'] = false;
        let card = randomCards();
        showCard(YOU, card);
        updateResult(YOU, card);
        showCount(YOU);
        BlackJack["isHit"] = true;
    }

}

// Function for Show cards
function showCard(activePlayer, card) {

    if (activePlayer.score <= 21) {

        let cardImg = document.createElement('img');
        cardImg.src = `Assets/cards/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImg);
        hitSound.play();
    }

}

// Function for update the results
function updateResult(activePlayer, card) {
    if (card === 'AH') {
        if ((activePlayer['score'] + BlackJack['cardValue'][card][1]) <= 21) {
            activePlayer['score'] += BlackJack['cardValue'][card][1];

        } else {

            activePlayer['score'] += BlackJack['cardValue'][card][0];
        }
    } else {

        activePlayer['score'] += BlackJack['cardValue'][card];
    }


}


// Functon for Deal button
function deal() {

    if (BlackJack['turnsOver'] === true) {

        BlackJack['isStand'] = false;
        let youImgs = document.querySelector('#YouBox').querySelectorAll('img');
        let dealerImgs = document.querySelector('#DealerBox').querySelectorAll('img');
        for (let i = 0; i < youImgs.length; i++) {
            youImgs[i].remove();
        }
        for (let i = 0; i < dealerImgs.length; i++) {
            dealerImgs[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#urs-result').style.color = 'wheat';
        document.querySelector('#bot-result').style.color = 'wheat';
        document.querySelector('#urs-result').textContent = 0;
        document.querySelector('#bot-result').textContent = 0;

        document.querySelector('#result').textContent = `Let's Play again`;
        document.querySelector('#result').style.color = 'white';
        BlackJack['turnsOver'] = true;
    }
}

// Function to choose random cards
function randomCards() {
    let randomIndex = Math.floor(Math.random() * 13);
    return BlackJack['cards'][randomIndex];

}

// Function to update scores
function showCount(activePlayer) {
    if (activePlayer.score > 21) {

        document.querySelector(activePlayer['scoreSpan']).textContent = 'Burst !';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';

    } else {

        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function for Bot Logic & Stand button
async function dealerPlay() {
    if (BlackJack["isHit"] === true) {

        BlackJack["isHit"] = false;
        BlackJack["isStand"] = true;

        while ((DEALER["score"] < 16) && (BlackJack["isStand"] === true)) {
            let card = randomCards();
            showCard(DEALER, card);
            updateResult(DEALER, card);
            showCount(DEALER);

            await sleep(1000);
        }

        BlackJack["turnsOver"] = true;
        let decide = decideWinner();
        showResult(decide);
    }

}

// Function for decide winner
function decideWinner() {
    let winner;
    if (YOU.score <= 21) {
        if (YOU.score > DEALER.score || (DEALER.score > 21)) {
            console.log('you win');
            winner = YOU;
            BlackJack['win']++;

        } else if (YOU.score < DEALER.score) {
            console.log('you lost');
            winner = DEALER;
            BlackJack['loss']++;

        } else if (YOU.score === DEALER.score) {
            console.log('you drew!');
            BlackJack['draw']++;

        }

    } else if (YOU.score > 21 && (DEALER.score <= 21)) {
        console.log('you lost!');
        winner = DEALER;
        BlackJack['loss']++;


    } else if (YOU.score > 21 && (DEALER.score > 21)) {
        console.log('you drew!');
        BlackJack['draw']++;

    }
    console.log('winner is :', winner);
    return winner;
}

// Function to Show result
function showResult(winner) {
    let msg, msgColor;

    if (BlackJack["turnsOver"] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = BlackJack['win'];
            msg = 'you won :)';
            msgColor = 'aqua';
            winSound.play();

        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = BlackJack['loss'];
            msg = 'you lost :(';
            msgColor = 'red';
            lossSound.play();


        } else {
            document.querySelector('#draws').textContent = BlackJack['draw'];
            msg = 'you tied ;('
            msgColor = 'yellow';

        }

        document.querySelector('#result').textContent = msg;
        document.querySelector('#result').style.color = msgColor;
    }
}

