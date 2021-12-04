import { shuffle } from "lodash";
const debug = false;

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

const cards = [
  Array.from({ length: 9 }, (_, index) =>
    Array.from({ length: 4 }, (_) => index)
  ),
  Array.from({ length: 9 }, (_) => 9),
  Array.from({ length: 7 }, (_) => SPECIAL_CARDS.SPY),
].flat(2);

const init = () => {
  console.log("Init game...");
  console.log("Shuffle...");
  let shuffledCards = shuffle(cards);
  console.log("Deal cards...");

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

    console.log(`It's Your turn: ${currentPlayer}`);
    console.log(
      `You can choose: Discard Pile: ${
        discardPile[discardPile.length - 1]
      } or Pile`
    );

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

    const computerPoints = computer.reduce(add, 0);
    const playerPoints = player.reduce(add, 0);
    console.log("Prepare award ceremony...");
    console.log(PLAYER.COMPUTER, computer, computerPoints);
    console.log(PLAYER.HUMAN, player, playerPoints);
    console.log(
      `And the winner is ... ${
        computerPoints > playerPoints ? PLAYER.HUMAN : PLAYER.COMPUTER
      }`
    );
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
          console.log("This is your card:", currentCard);
          break;
        }
      case PILE.PILE:
      default:
        if (pile.length < 1) {
          console.log("No card on the pile!");
          console.log("Let me shuffle the cards for you...");
          pile = shuffle(discardPile);
          console.log("Ok, go ahead!");
        }
        currentCard = pile.pop();
        console.log("This is your card:", currentCard);
        break;
    }
  };

  const swap = ({ position }) => {
    const pile = currentPlayer === PLAYER.COMPUTER ? computer : player;
    if (debug) console.log("Before", JSON.parse(JSON.stringify(pile)));
    [pile[position], currentCard] = [currentCard, pile[position]];
    if (debug) console.log("After", JSON.parse(JSON.stringify(pile)));

    console.log(pile);

    if (currentPlayer === PLAYER.HUMAN) {
      discard();
    }
  };

  const knock = () => {
    console.log("Somebody knocked! This is the last round :)");
    lastTurn = round + 2;
  };

  const discard = () => {
    console.log(`Discarded: ${currentCard}`);

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

  gameOn();
};

const start = () => {
  const game = init();
  play(game);
};

start();
