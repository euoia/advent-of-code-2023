const fs = require("fs");
const lines = fs.readFileSync("./test-input-10.txt", "utf8").split("\n");
//const lines = fs.readFileSync("./input-10-1.txt", "utf8").split("\n");

let startingRoom = null;

// y, x (from northwest).
const rooms = {};

for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  if (line === "") {
    break;
  }

  const roomsStr = line.split("");
  rooms[y] = {};

  for (let x = 0; x < roomsStr.length; x++) {
    rooms[y][x] = {
      x,
      y,
      char: roomsStr[x],
    };

    if (roomsStr[x] === "S") {
      startingRoom = rooms[y][x];
    }
  }
}

const north = [-1, 0];
const south = [1, 0];
const east = [0, 1];
const west = [0, -1];

const charExits = {
  "|": [north, south],
  "-": [east, west],
  L: [north, east],
  J: [north, west],
  7: [south, west],
  F: [south, east],
  ".": [],
};

// We have the S room, but we need to find an adjust room that could connect to it.
const possibleAdjacentRooms = [];
for (const direction of [north, south, east, west]) {
  const adjacentRoom =
    rooms[startingRoom.y + direction[0]]?.[startingRoom.x + direction[1]];

  if (adjacentRoom !== undefined) {
    const adjacentRoomExits = charExits[adjacentRoom.char];

    const adjacentRoomIsValid = adjacentRoomExits
      .map(([yAdj, xAdj]) => {
        const nextRoom = rooms[adjacentRoom.y + yAdj]?.[adjacentRoom.x + xAdj];

        return nextRoom;
      })
      .some((nextRoom) => nextRoom.char === "S");

    if (adjacentRoomIsValid) {
      possibleAdjacentRooms.push(adjacentRoom);
    }
  }
}

const pipeRooms = [startingRoom];
currentRoom = possibleAdjacentRooms[0];
while (currentRoom !== "S") {
  const currentRoomExits = charExits[currentRoom.char];
  console.dir({ currentRoom, currentRoomExits });
  const nextRooms = currentRoomExits
    .map((exit) => {
      const nextRoom =
        rooms[currentRoom.y + exit[0]]?.[currentRoom.x + exit[1]];
      return nextRoom;
    })
    .filter(
      (room) =>
        room !== undefined &&
        pipeRooms.find(
          (pipeRoom) => pipeRoom.x === room.x && pipeRoom.y === room.y,
        ) === undefined,
    );

  if (nextRooms.length === 0) {
    break;
  }

  const randomNextRoom =
    nextRooms[Math.floor(Math.random() * nextRooms.length)];

  pipeRooms.push(currentRoom);
  currentRoom = randomNextRoom;
}

console.log(Math.ceil(pipeRooms.length / 2));
