const fs = require("fs");
const input = fs.readFileSync("./input-7.txt", "utf8");
const util = require("util");

const cardRanks = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const handRanks = [
  {
    name: "Five of a kind",
    map: "AAAAA",
  },
  {
    name: "Four of a kind",
    map: "AAAA_",
  },
  {
    name: "Full house",
    map: "AAABB",
  },
  {
    name: "Three of a kind",
    map: "AAA__",
  },
  {
    name: "Two pair",
    map: "AABB_",
  },
  {
    name: "One pair",
    map: "AA___",
  },
  {
    name: "High card",
    map: "A____",
  },
];

// If two hands have the same type, a second ordering rule takes effect. Start
// by comparing the first card in each hand. If these cards are different, the
// hand with the stronger first card is considered stronger. If the first card
// in each hand have the same label, however, then move on to considering the
// second card in each hand. If they differ, the hand with the higher second
// card wins; otherwise, continue with the third card in each hand, then the
// fourth, then the fifth.

let handIdx = 0;
const hands = [];
for (const line of input.split("\n")) {
  if (line === "") {
    break;
  }

  const [cards, bid] = line.split(" ");
  hands.push({
    cards: cards.split(""),
    bid: parseInt(bid),
    handIdx: handIdx++,
  });
}

for (const hand of hands) {
  const cardCounts = {};
  for (const card of hand.cards) {
    if (!cardCounts[card]) {
      cardCounts[card] = 0;
    }
    cardCounts[card]++;
  }

  hand.cardCounts = cardCounts;

  // Sort by count.
  const sortedCards = hand.cards.toSorted((a, b) => {
    let cmp = cardCounts[b] - cardCounts[a];
    if (cmp === 0) {
      cmp = cardRanks[b] - cardRanks[a];
    }

    return cmp;
  });

  // Cards are now sorted first according to their count, and secondly
  // according to their rank.
  hand.sortedCards = sortedCards;

  for (const card of sortedCards) {
    if (hand.highestCountCard === undefined) {
      hand.highestCountCard = card;
      continue;
    }

    if (card !== hand.highestCountCard) {
      hand.secondHighestCountCard = card;
      break;
    }
  }
}

function getHandValue(hand) {
  let value = handRanks.length - 1;
  for (const handRank of handRanks) {
    const match = handRank.map
      .replaceAll("A", hand.highestCountCard)
      .replaceAll("B", hand.secondHighestCountCard)
      .replaceAll("_", ".");

    if (hand.sortedCards.join("").match(match) !== null) {
      return {
        value: value,
        hand: handRank.name,
      };
    }

    value--;
  }
  return value;
}

for (const hand of hands) {
  const handValue = getHandValue(hand);
  hand.value = handValue.value;
  hand.hand = handValue.hand;
}

const sortedHands = hands.sort((a, b) => {
  let cmp;

  cmp = b.value - a.value;

  for (let i = 0; i < a.cards.length; i++) {
    if (cmp !== 0) {
      break;
    }

    cmp = cardRanks[b.cards[i]] - cardRanks[a.cards[i]];
    if (i === a.cards.length - 1) {
      console.log(`Went to last card on ${b.cards[i]}: ${a.cards} ${b.cards}`);
      console.log(cmp);
    }
  }

  return cmp;
});

const rankedHands = sortedHands.map((hand, index) => {
  const rank = sortedHands.length - index;
  const winnings = hand.bid * rank;
  return {
    ...hand,
    rank,
    winnings,
  };
});

process.stdout.write(
  `${util.inspect(rankedHands, { maxArrayLength: 1000 })}\n`,
);
console.log(
  rankedHands.reduce((acc, hand) => {
    //console.log(acc);
    return acc + hand.winnings;
  }, 0),
);
