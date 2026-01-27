const characterTypeDistribution = [
    [0,0,0,0], [0,0,0,1], [1,0,0,1], [2,0,0,1], [2,1,0,1],
    [3,0,1,1], [3,1,1,1],
    [5,0,1,1], [5,1,1,1], [5,2,1,1],
    [7,0,2,1], [7,1,2,1], [7,2,2,1],
    [9,0,3,1], [9,1,3,1], [9,2,3,1],
    [11,0,4,1], [11,1,4,1], [11,2,4,1],
    [13,0,5,1], [13,1,5,1], [13,2,5,1]
];
const players = [];

const townsfolkRoles = ["Steward", "Empath", "Chef"];
const outsiderRoles = [];
const minionRoles = [];
const demonRoles = ["Imp"];

const goodRoles = townsfolkRoles.concat(outsiderRoles);
const evilRoles = minionRoles.concat(demonRoles);
const allRoles = goodRoles.concat(evilRoles);

function startGame() {
    if (localStorage.getItem("game-is-running") === "true") return;

    const playerCount = Number(localStorage.getItem("player-count"));

    if (townsfolkRoles.length < playerCount) {
        console.log("You need to activate more Townsfolk roles");
        return;
    }
    if (playerCount > characterTypeDistribution.length) {
        console.log("You selected too many players");
        return;
    }

    localStorage.setItem("game-is-running", "true");
    localStorage.setItem("night", "1");

    players.length = 0;

    for (let i = 0; i < playerCount; i++) {
        players.push({
            name: "Player " + i,
            seat: i,
            role: {
                name: "",
                characterType: "Townsfolk"
            },
            isGood: true,
            bluff: "",
            isAlive: true,
            info: "",
            drunkSources: []
        });
    }
    players.sort(() => Math.random() - 0.5);
    let townsfolkCount = characterTypeDistribution[players.length][0];
    const minionCount = characterTypeDistribution[players.length][2];

    // Demon Setup
    players[0].isGood = false;
    players[0].role.characterType = "Demon";
    players[0].role.name = demonRoles.sort(() => Math.random() - 0.5)[0];
    if (players[0].role.name === "Zombuul") players[0].lifes = 2;

    // Minions Setup
    for (let i = 1; i < 1 + minionCount; i++) {
        players[i].isGood = false;
        players[i].role.characterType = "Minion";
        players[i].role.name = minionRoles.filter(role => !players.map(p => p.role.name).includes(role)).sort(() => Math.random() - 0.5)[0];
    }
    if (players.find(p => p.role.name === "Baron")) {
        if (players.length > 6) townsfolkCount -= 2;
        if (players.length < 7) townsfolkCount -= 1;
    }
    if (players.find(p => p.role.name === "Godfather")) {
        if (Math.random() < 0.2) townsfolkCount++;
        else townsfolkCount--;
    }

    // Townsfolk Setup
    for (let i = 1 + minionCount; i < 1 + minionCount + townsfolkCount; i++) {
        players[i].role.name = townsfolkRoles.filter(role => !players.map(p => p.role.name).includes(role)).sort(() => Math.random() - 0.5)[0];
        players[i].bluff = players[i].role.name;
    }
    // Outsider Setup
    for (let i = 1 + minionCount + townsfolkCount; i < players.length; i++) {
        players[i].role.characterType = "Outsider";
        players[i].role.name = outsiderRoles.filter(role => !players.map(p => p.role.name).includes(role)).sort(() => Math.random() - 0.5)[0];
        players[i].bluff = players[i].role.name;
    }

    // Evil Bluff Setup
    for (const player of players) {
        if (player.isGood) continue;
        let unusedBluffs = goodRoles.filter(role => !players.map(p => p.bluff).includes(role) && role !== "Drunk");
        if (player.role.characterType === "Demon") unusedBluffs = unusedBluffs.filter(role => role !== "Knight");
        player.bluff = unusedBluffs.sort(() => Math.random() - 0.5)[0];
    }

    // Drunk Bluff
    for (const player of players) {
        if (player.role.name === "Drunk") {
            player.bluff = townsfolkRoles.filter(role => !players.map(p => p.bluff).includes(role))[0];
            player.drunkSources.push("Drunk");
        }
    }

    players.sort((a,b) => a.seat - b.seat);
    console.log(players.map(player => player.name + ": " + player.role.name + (player.role.name === player.bluff ? "" : " - " + player.bluff)));

    showClaims();
}

function showClaims() {
    for (const player of players) {
        document.getElementById("player-role-image" + player.seat).src =
            "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + player.bluff.toLowerCase().replaceAll(" ", "") + ".png";
    }
}

export {startGame};