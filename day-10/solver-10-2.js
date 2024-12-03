const fs = require("fs");
const lines = fs.readFileSync("./test-input-10-3.txt", "utf8").split("\n");
//const lines = fs.readFileSync("./input-10-1.txt", "utf8").split("\n");

let startingRoom = null;
let width = null;
let height = 0;

// y, x (from northwest).
const rooms = {};

for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  if (line === "") {
    break;
  }

  height += 1;

  const roomsStr = line.split("");
  rooms[y] = {};

  width = roomsStr.length;
  for (let x = 0; x < roomsStr.length; x++) {
    rooms[y][x] = {
      x,
      y,
      char: roomsStr[x],
      flooded: [],
      isChecked: false,
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

const floodExits = {
  ...charExits,
  ".": [north, south, east, west],
  S: [],
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
let currentRoom = possibleAdjacentRooms[0];
while (currentRoom !== "S") {
  const currentRoomExits = charExits[currentRoom.char];
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

// Dots on edge of map.
const floodStartRooms = Object.values(rooms)
  .flatMap((yRooms) => Object.values(yRooms))
  .filter(
    (room) =>
      room.char === "." &&
      (room.x === 0 ||
        room.x === width - 1 ||
        room.y === 0 ||
        room.y === height - 1),
  );

function getRoomAdjacentRooms(room) {
  return room.flooded
    .map(([yAdj, xAdj]) => {
      const nextRoom = rooms[room.y + yAdj]?.[room.x + xAdj];
      return nextRoom;
    })
    .filter((room) => room !== undefined && room.isChecked === false);
}

let currentRooms = floodStartRooms;

for (const room of currentRooms) {
  // Completely flooded.
  room.flooded = [north, south, east, west];
  room.isChecked = true;
}

console.dir({ floodStartRooms, currentRooms });

while (currentRooms.length > 0) {
  let nextRooms = [];
  for (const room of currentRooms) {
    const adjacentRooms = getRoomAdjacentRooms(room);
    for (const adjacentRoom of adjacentRooms) {
      if (adjacentRoom.y === room.y - 1) {
        adjacentRoom.flooded.push(south);
      }

      if (adjacentRoom.y === room.y + 1) {
        adjacentRoom.flooded.push(north);
      }

      if (adjacentRoom.x === room.x - 1) {
        adjacentRoom.flooded.push(east);
      }

      if (adjacentRoom.x === room.x + 1) {
        adjacentRoom.flooded.push(west);
      }
    }

    nextRooms.push(...adjacentRooms);
    console.dir({ room, adjacentRooms });
  }

  currentRooms = nextRooms;
}

// Print.
for (const rowIdx in rooms) {
  const row = rooms[rowIdx];
  console.log(
    Object.values(row)
      .map((room) => room.char)
      .join(""),
  );
}

console.log(``);

let numEnclosed = 0;
for (const rowIdx in rooms) {
  const row = rooms[rowIdx];
  console.log(
    Object.values(row)
      .map((room) => {
        if (room.flooded.length === 0) {
          return "X";
        }

        numEnclosed += 1;
        return ".";
      })
      .join(""),
  );
}

console.log("");
console.log("numEnclosed", numEnclosed);

// Flood fill from the outside tiles.
// Count the remaining . tiles.
// Ensure you can flood fill by squeezing through pipes.
// The flood map needs to be a separate layer.

// Alternatively consider all dots within the pipe area and flood from there.
//
// Hmm... The squeezing behaviour might mean we need to model each room as four rooms.
