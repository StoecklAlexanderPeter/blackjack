/*
 @author AlexanderStoeckl
 Blackjack Game
 Pluralsight course by Mark Zamoyta
*/

// Cards variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
  values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven',
    'Six', 'Five', 'Four', 'Three', 'Two'
  ];

// DOM variables
let textArea = document.getElementById('text-area'),
  table = document.getElementById('table'),
  dealerHand = document.getElementById('dealerHand'),
  playerHand = document.getElementById('playerHand'),
  newGameButton = document.getElementById('new-game-button'),
  hitButton = document.getElementById('hit-button'),
  stayButton = document.getElementById('stay-button');


//Game variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
  removeChildren(dealerHand);
  removeChildren(playerHand);
  textArea.innerText = "";
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  return card.value + "-" + card.suit;
}

function createImage(card) {
  let img = document.createElement("img");
  img.setAttribute('src', `images/${card.value}-${card.suit}.png`);
  console.log(img.src)
  return img;
}

function getNextCard() {
  return deck.shift();
}

function getCardNumericValue(card) {
  switch (card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eigth':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function removeChildren(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function checkForEndOfGame() {

  updateScores();

  if (gameOver) {
    // let dealer take cards
    while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 16) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {

    if (playerScore > dealerScore) {
      playerWon = true;
    } else {
      PlayerWon = false;
    }
  }
}

function showStatus() {
  removeChildren(playerHand);
  removeChildren(dealerHand);
  if(gameStarted) {
    if(!gameOver) {
      let img = document.createElement("img");
      img.setAttribute('src', `images/deck.png`);
      img.setAttribute('style', `height: 206px; width: 136px;`);
      dealerHand.appendChild(createImage(dealerCards[0]));
      dealerHand.appendChild(img);
    } else {
      for (let i = 0; i < dealerCards.length; i++) {
        dealerHand.appendChild(createImage(dealerCards[i]));
      }
    }
  }

  for (let i = 0; i < playerCards.length; i++) {
     playerHand.appendChild(createImage(playerCards[i]));
  }

  /*
  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += createImage(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += createImage(playerCards[i]) + '\n';
  }
*/
  updateScores();
/*
  textArea.innerText =
    'Dealer has:\n' +
    dealerCardString +
    '(score: ' + dealerScore + ')\n\n' +

    'Player has:\n' +
    playerCardString +
    '(score: ' + playerScore + ')\n\n';
*/
  if (gameOver) {
    if (playerWon) {
      textArea.innerHTML += "<h2 class='text-warning'>Winner Winner Chicken Dinner!</h2>";
    } else {
      textArea.innerHTML += "<h2 class='text-danger'>YOU LOST!</h2>";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
    
  }
}