import { shuffle } from "lodash";

const SPECIAL_CARDS = {
  SPY: "SPY",
  SWITCH: "SWITCH",
  TAKE_TWO: "TAKE_TWO",
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
  console.log(cards);
  console.log("Shuffle...");
  let shuffledCards = shuffle(cards);
  console.log(JSON.parse(JSON.stringify(shuffledCards)));
  console.log("Deal cards...");

  const computer = shuffledCards.splice(0, 4);
  const player = shuffledCards.splice(0, 4);
  const pile = shuffledCards.splice(0, 43);
  const discardPile = shuffledCards.splice(0, 1);

  console.log("computer", computer);
  console.log("player", player);
  console.log("pile", pile);
  console.log("discardPile", discardPile);
  console.log(shuffledCards);

  return {
    computer,
    player,
    pile,
    discardPile,
  };
};

const PILE = {
  DISCARD_PILE: "DISCARD_PILE",
  PILE: "PILE",
};

const play = ({ computer, player, pile, discardPile }) => {
  console.log("We are playing...");
  console.log(`Those are your outhermost cards: ${player[0]} | ${player[3]}`);
  console.log(
    `You can choose: Discard Pile: ${
      discardPile[discardPile.length - 1]
    } or Pile`
  );
  let currentCard = null;
  let currentPlayer = "player";

  // save position of known cards
  let computerBrain = [0, 3];
  const computerMoves = () => {
    // draw
    // if on of the cards the computer knows are greater than the card on the discard pile
    // computer takes card from discard pile
    // else the computer takes the card from the pile
    const upmostCard =
      discardPile.length > 0 ? discardPile[discardPile.length - 1] : 1000;
    if (computerBrain.some((pos) => computer[pos] > upmostCard)) {
      console.log("Computer takes from discard pile.");
      draw({ pile: PILE.DISCARD_PILE });

      const position = computerBrain.sort(
        (currentPos, nextPos) => computer[currentPos] - computer[nextPos]
      );

      console.log(
        `Computer swaps with card on position: ${position[position.length - 1]}`
      );
      swap({ position: position[position.length - 1] });
    } else {
      console.log("Computer takes from pile.");
      draw({ pile: PILE.PILE });

      if (computerBrain.some((pos) => computer[pos] > currentCard)) {
        const position = computerBrain.sort(
          (currentPos, nextPos) => computer[currentPos] - computer[nextPos]
        );

        console.log(
          `Computer swaps with card on position: ${
            position[position.length - 1]
          }`
        );
        swap({ position: position[position.length - 1] });
      } else if (computerBrain.length < 4) {
        // switch
        // if on of the cards the computer knows are greater than the current card
        // computer swaps with greatest know card
        // else if the current card is smaller 4 and not all cards are known, the computer can take a risky move and swap with an unknown card
        // else computer does nothing
        // const position
        // swap({ position, pile: computer });
        // TODO: Risky Move!
      } else {
        // nothing to do
      }
    }

    // discard
    // card gets discarded
    discard();
  };

  const draw = ({ selectedPile = PILE.PILE }) => {
    switch (selectedPile) {
      case PILE.DISCARD_PILE:
        currentCard = discardPile.pop();
        break;
      case PILE.PILE:
        currentCard = pile.pop();
        break;
      default:
        currentCard = pile.pop();
        break;
    }
    console.log("This is your card:", currentCard);
  };

  const swap = ({ position }) => {
    const pile = currentPlayer === "computer" ? computer : player;

    [pile[position], currentCard] = [currentCard, pile[position]];

    if (currentPlayer === "player") {
      discard();
    }
  };

  const discard = () => {
    console.log(`Discarded: ${currentCard}`);
    discardPile.push(currentCard);

    currentPlayer = currentPlayer === "computer" ? "player" : "computer";

    console.log("----------------------------------");

    console.log(`It's Your turn: ${currentPlayer}`);
    console.log(
      `You can choose: Discard Pile: ${
        discardPile[discardPile.length - 1]
      } or Pile`
    );
    if (currentPlayer === "computer") {
      computerMoves();
    }
  };

  const knock = () => {
    const add = (acc, curr) => {
      if (curr === SPECIAL_CARDS.SPY) {
        curr = pile.length > 0 ? pile.pop() : 9;
      }

      if (acc === SPECIAL_CARDS.SPY) {
        acc = pile.length > 0 ? pile.pop() : 9;
      }
      return acc + curr;
    };

    console.log("Prepare award ceremony...");
    console.log("Computer", computer, computer.reduce(add, 0));
    console.log("Player", player, player.reduce(add, 0));
    console.log(
      `And the winner is ... ${
        computer.reduce(add, 0) > player.reduce(add, 0) ? "player" : "computer"
      }`
    );
  };

  window.draw = draw;
  window.discard = discard;
  window.swap = swap;
  window.knock = knock;
  window.myCards = () => {
    console.log(player);
  };
  // window.sortCards = () => {
  //   const cards = [0, 9, 4, 3];
  //   const brain = [0, 1, 2, 3];

  //   const largestKnowCard = brain.sort(
  //     (currentPos, nextPos) => cards[currentPos] - cards[nextPos]
  //   );
  //   console.log("largestKnowCard", largestKnowCard.pop());
  // };
};

const main = () => {
  const { computer, player, pile, discardPile } = init();
  play({ computer, player, pile, discardPile });
};

main();
