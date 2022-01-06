

var imgWidth = '140px';
var imgHeight = '160px';
var showOutermostTimeout = 2000;
var jumpTimeout = 4000;

var outerCard1
var outerCard2


var shuffle = (array) => { 

  console.log("shuffle function... " + array.length );
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  console.log("shuffle done." );
  return array;
}

var showManual = () => {
 document.getElementById('Anleitung').showModal();
}

var showCopyright = () => {
 document.getElementById('copyright').showModal();
}

var getHTMLString = (card) => {
	
	if(card == 'SPY'){	  
	  //console.log("<img src=\"images/Sonderkarte_Spaehen_B.png\" alt=\"Sonderkarte " + card +  "\""  + " width=\"" + imgWidth + "\" height=\"" + imgHeight + "\">");
	  return "<img src=\"images/Sonderkarte_Spaehen_B.png\" alt=\"Sonderkarte " + card +  "\""  + " width=\"" + imgWidth + "\" height=\"" + imgHeight + "\">";
	}else{	  
	  //console.log("<img src=\"images/KarteB_" + card + ".png\" alt=\"Zahlenkarte mit dem Wert " + card +  "\""  + "   width=\"" + imgWidth + "\" height=\"" + imgHeight + "\">");
	  return "<img src=\"images/KarteB_" + card + ".png\" alt=\"Zahlenkarte mit dem Wert " + card +  "\""  + "   width=\"" + imgWidth + "\" height=\"" + imgHeight + "\">";
	}	
}

var showJumpingBiber = () => {
	console.log("show jumping biber..." );	
	document.getElementById('JumpingBiber').innerHTML = "<img src=\"images/jumpingbiber.gif\" alt=\"springender Biber\"  width=\"" + imgWidth + "\" height=\"" + imgHeight + "\">";
	setTimeout(() => { hideJumpingBiber(); }, jumpTimeout);			
}

var hideJumpingBiber = () => {
	document.getElementById('JumpingBiber').innerHTML = "";
}


var showOutermostCards = () => {
  console.log("showOutermostCards..." );
  document.getElementById('PlayerCard0').innerHTML = getHTMLString(outerCard1);
  document.getElementById('PlayerCard3').innerHTML = getHTMLString(outerCard2);
  setTimeout(() => { resetOutermostCards(); }, showOutermostTimeout);
}

var resetOutermostCards = () => {
  document.getElementById('PlayerCard0').innerHTML = "Spieler Card 1"
  document.getElementById('PlayerCard3').innerHTML = "Spieler Card 4" 
}

var showComputerCardsAsText = (cards) => {
  for (count = 0; count < 4; count++) {
    console.log('Gehe einen Schritt nach Osten');
    document.getElementById('CompCard' + count).innerHTML = "Computer Card " + (count +1) + ":<br><br>" + cards[count]
  } 
}

var showHumanCardsAsText = (cards) => {
  for (count = 0; count < 4; count++) {
    console.log('showHumanCardsAsImage -> PlayerCard' + count + '  ' + getHTMLString(cards[count]));    
    document.getElementById('PlayerCard' + count).innerHTML = "Spieler Card " + (count +1) + ":<br><br>" + cards[count]
  }
}

var showComputerCardsAsImage = (cards) => {
    for (count = 0; count < 4; count++) {      
	  console.log('showComputerCardsAsImage -> CompCard' + count + '  ' + getHTMLString(cards[count]));    
	  document.getElementById('CompCard' + count).innerHTML = getHTMLString(cards[count]);
  }
}

var showHumanCardsAsImage = (cards) => {	
  for (count = 0; count < 4; count++) {
      console.log('showHumanCardsAsImage -> PlayerCard' + count + '  ' + getHTMLString(cards[count]));    
      document.getElementById('PlayerCard' + count).innerHTML = getHTMLString(cards[count]);
  }
}

var showDefaultText = () => {
	
  for (count = 0; count < 4; count++) {
    document.getElementById('CompCard' + count).innerHTML = "Computer Card " + (count +1);
    document.getElementById('PlayerCard' + count).innerHTML = "Spieler Card " + (count +1);
  }

  document.getElementById('ZiehStapel').innerHTML = "Ziehstapel";
  document.getElementById('AblageStapel').innerHTML = "Ablagestapel";     
}

var setComputerPoints = (count) => {	
	var tmp = parseInt(document.getElementById('PunkteComputer').innerHTML.substring(2, document.getElementById('PunkteComputer').innerHTML.length));
	tmp = tmp + count;
    document.getElementById('PunkteComputer').innerHTML = "C: " + tmp;
}

var setHumanPoints = (count) => {	
	var tmp = parseInt(document.getElementById('PunkteHuman').innerHTML.substring(2, document.getElementById('PunkteHuman').innerHTML.length));
	tmp = tmp + count;
    document.getElementById('PunkteHuman').innerHTML = "H: " +tmp;
}

var finishGame = () => {
	console.log("finishGame() => lastTurn = 0");
	lastTurn = 0;
}

var showCurrentDiscardCard = (currDiscardCard) => {		   
    document.getElementById('AblageStapel').innerHTML = getHTMLString(currDiscardCard);	
}

var showCurrentPileCard = (currPileCard) => {
	document.getElementById('ZiehStapel').innerHTML = "Ziehstapel<br><br>" + currPileCard;		
}

var setCurrentGameState = (gameState) => {	
	document.getElementById('GameState').innerHTML = "<br> " + gameState + "<br>";			
}

var showPileCard = (card) => {
	document.getElementById('ZiehStapel').innerHTML = getHTMLString(card);			
}

var showTextPile = () => {
	document.getElementById('ZiehStapel').innerHTML = "Ziehstapel";
}

var resetPoints = () => {
	document.getElementById('PunkteComputer').innerHTML = "C: " + 0;
	document.getElementById('PunkteHuman').innerHTML = "H: " + 0;	
}



const debug = true;

const SPECIAL_CARDS = {
  SPY: "SPY",
  SWITCH: "SWITCH",
  TAKE_TWO: "TAKE_TWO",
};

const PILE = {
  DISCARD_PILE: "DISCARD_PILE",
  PILE: "PILE",
};

const PLAYER = {
  COMPUTER: "COMPUTER",
  HUMAN: "HUMAN",
};


const init = () => {
	
  showDefaultText();
  showTextPile();
	
  console.log("Init game...");
  
  var cards = [
	  Array.from({ length: 9 }, (_, index) =>
		Array.from({ length: 4 }, (_) => index)
	  ),
	  Array.from({ length: 9 }, (_) => 9),
	  Array.from({ length: 7 }, (_) => SPECIAL_CARDS.SPY),
	].flat(2);
    
  console.log("Shuffle...");
  var shuffledCards = shuffle(cards);  
  console.log("Deal cards: >" + cards);  

  return {
    computer: shuffledCards.splice(0, 4),
    computerBrain: [0, 3],
    player: shuffledCards.splice(0, 4),
    pile: shuffledCards.splice(0, 43),
    discardPile: shuffledCards.splice(0, 1),
    currentCard: null,
    currentPlayer: PLAYER.COMPUTER,
    round: 0,
    lastTurn: -1,
  };
};

const play = (game) => {
  let {
    computer,
    computerBrain,
    player,
    pile,
    discardPile,
    currentCard,
    currentPlayer,
    round,
    lastTurn,
  } = game;

  const gameOn = () => {
    if (debug) {
      console.log("round", round);
      console.log("lastTurn", lastTurn);
    }
    if (round === lastTurn) {
      gameOver();
      return;
    }

    console.log("----------------------------------");

    var logInfo = `Du bist dran: ${currentPlayer} entweder die Karte ${discardPile[discardPile.length - 1]} vom Ablagestapel oder ziehen?`;	   
    
    console.log(logInfo);
	setCurrentGameState(logInfo);

    if (currentPlayer === PLAYER.COMPUTER) {
      computerMoves();
    }
  };

  const gameOver = () => {
    const add = (acc, curr) => {
      if (curr === SPECIAL_CARDS.SPY) {
        curr = pile.length > 0 ? pile.pop() : 9;
      }

      if (acc === SPECIAL_CARDS.SPY) {
        acc = pile.length > 0 ? pile.pop() : 9;
      }
      return acc + curr;
    };
    
	showComputerCardsAsImage(computer);
	showHumanCardsAsImage(player);
	
	const computerPoints = computer.filter(item => typeof item === 'number').reduce(add,0);
    //const computerPoints = computer.reduce(add, 0);
	const playerPoints = player.filter(item => typeof item === 'number').reduce(add,0);
	
	setComputerPoints(computerPoints);
	setHumanPoints(playerPoints);
	
    /*
	const playerPoints = player.reduce(add, 0);
    console.log("Prepare award ceremony...");
    console.log(PLAYER.COMPUTER, computer, computerPoints);
    console.log(PLAYER.HUMAN, player, playerPoints);
    console.log(
      `And the winner is ... ${
        computerPoints > playerPoints ? PLAYER.HUMAN : PLAYER.COMPUTER
      }`
	*/
    var logInfo1  = "Computer hat die Karten: " + computer + " => Summe: " + computerPoints;
	var logInfo2  = "<br>deine Karten: " + player + " => Summe: " + playerPoints;
	var logInfo3  = `<br>Gewonnen hat => ${computerPoints > playerPoints ? PLAYER.HUMAN : PLAYER.COMPUTER}`;
	
	
	console.log(PLAYER.COMPUTER, computerPoints);
    console.log(PLAYER.HUMAN, playerPoints);
	console.log(computerPoints < playerPoints);
	if( playerPoints < computerPoints ){		
	  console.log("show jumping biber...");
	  showJumpingBiber();
	}
	console.log(logInfo1 + logInfo2 + logInfo3);
	setCurrentGameState(logInfo1 + logInfo2 + logInfo3);
	  
    
  };

  const draw = ({ selectedPile = PILE.PILE }) => {
    switch (selectedPile) {
      case PILE.DISCARD_PILE:
        if (
          !discardPile ??
          discardPile.length < 1 ??
          !discardPile[discardPile.length - 1]
        ) {
          console.log("No card on discard pile!");		  
        } else {
          currentCard = discardPile.pop();
		  showCurrentDiscardCard(currentCard);
          console.log("This is your card 1:", currentCard);		  
          break;
        }
      case PILE.PILE:
      default:
        if (pile.length < 1) {
          console.log("No card on the pile!");
          console.log("Let me shuffle the cards for you...");
          pile = shuffle(discardPile);
		  showCurrentPileCard("No card on the pile!");
          console.log("Ok, go ahead!");
        }
        currentCard = pile.pop();
        if (currentPlayer === PLAYER.HUMAN) {
		  showPileCard(currentCard);	
        }        
        console.log("This is your card 2:", currentCard);
        break;
    }
  };

  const swap = ({ position }) => {
    const pile = currentPlayer === PLAYER.COMPUTER ? computer : player;
    if (debug) console.log("Before", JSON.parse(JSON.stringify(pile)));
    [pile[position], currentCard] = [currentCard, pile[position]];
    if (debug) console.log("After", JSON.parse(JSON.stringify(pile)));

    console.log(pile);
	showTextPile();
	
    if (currentPlayer === PLAYER.HUMAN) {
      outerCard1 = player[0];
      outerCard2 = player[3];
      discard();
    }
  };

  const knock = () => {
    console.log("Somebody knocked! This is the last round :)");
    lastTurn = round + 2;
  };

  const discard = () => {
    console.log(`Discarded: ${currentCard}`);
	showCurrentDiscardCard(currentCard);
		
    round = round + 1;
    currentPlayer =
      currentPlayer === PLAYER.COMPUTER ? PLAYER.HUMAN : PLAYER.COMPUTER;
    discardPile = [...discardPile, currentCard];

    gameOn();
  };

  const computerMoves = () => {
    computerDraw();
    computerSwap();
    computerGuess();
    discard();
  };

  const computerDraw = () => {
    const upmostCard =
      discardPile.length > 0 ? discardPile[discardPile.length - 1] : 1000;

    let takeFromDiscardPile = computerBrain.some(
      (pos) => computer[pos] > upmostCard
    );

    console.log(
      `Computer draws from ${
        takeFromDiscardPile ? PILE.DISCARD_PILE : PILE.PILE
      }`
    );
    draw({
      selectedPile: takeFromDiscardPile ? PILE.DISCARD_PILE : PILE.PILE,
    });
  };

  const computerSwap = () => {
    if (computerBrain.some((pos) => computer[pos] > currentCard)) {
      /*
      computer swaps current card with a card from it's pile
    */
      const position = computerBrain.sort(
        (currentPos, nextPos) => computer[currentPos] - computer[nextPos]
      );
      console.log(
        `Computer swaps with card on position: ${position[position.length - 1]}`
      );
      swap({ position: position[position.length - 1] });
    } else if (computerBrain.length < 4 && currentCard < 5) {
      /*
      This is a risky move
      If the computer doesn't know all cards AND the current card is less than 5, it might be a good idea to take the risk and swap with an unknown card
      We could also make the computer incredibly clever and make it remember discarded cards (and do the math...), but then we have an almighty opponent
    */
      const missingPositions = [0, 1, 2, 3].filter(
        (pos) => !computerBrain.includes(pos)
      );
      if (debug) console.log("missingPositions", missingPositions);
      const riskyPosition = missingPositions.pop();
      computerBrain.push(riskyPosition);
      console.log(`Computer swaps with card on position: ${riskyPosition}`);
      swap({ position: riskyPosition });
    } else {
      // Nothing to do
    }
  };

  const computerGuess = () => {
    // computer adds cards from its brain and guesses its chances
    let guessedValue = computerBrain.reduce((acc, curr) => {
      const temp = computer[curr] === SPECIAL_CARDS.SPY ? 5 : computer[curr];
      return acc + temp;
    }, 0);
    if (lastTurn < 0 && ((round > 4 && guessedValue < 10) || round > 8)) {
      knock();
    }
  };

  window.drawPile = () => draw({ selectedPile: PILE.PILE });
  window.drawDiscardPile = () => draw({ selectedPile: PILE.DISCARD_PILE });
  window.swap = (position) => swap({ position });
  window.discard = discard;
  window.knock = knock;
  window.help = () => {
    console.log("Functions you can use:");
    console.log("drawPile", "Draw a card from pile");
    console.log("drawDiscardPile", "Draw a card from discard pile");
    console.log(
      "swap(position)",
      "Swap drawn card with one of your cards, expects value from 0 to 3"
    );
    console.log("discard", "Discard card in your hand");
    console.log("knock", "Knock and finish game.");
    console.log("help", "Shows this message");
  };

  console.log("We are playing!");
  console.log(`Those are your outermost cards: ${player[0]} | ${player[3]}`);
  outerCard1 = player[0];
  outerCard2 = player[3];

  gameOn();
};

const start = () => {
  const game = init();
  play(game);
};

var swap01 = () => { swap(0); }
var swap02 = () => { swap(1); }
var swap03 = () => { swap(2); }
var swap04 = () => { swap(3); }

function startGame(){
  const game = init();
  play(game);
}




