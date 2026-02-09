import {alivePlayers, isDrunk, isGood, roleIsSoberAlive} from "./src/shortcuts.js";
import {chefInfo} from "./src/roles/Trouble Brewing/chef.js";
import {stewardInfo} from "./src/roles/steward.js";
import {empathInfo} from "./src/roles/Trouble Brewing/empath.js";
import {addToChambermaidList, chambermaidInfo, chambermaidList} from "./src/roles/Bad Moon Rising/chambermaid.js";
import {mayorRedirect} from "./src/roles/Trouble Brewing/mayor.js";
import {isMonkProtected, monkProtect} from "./src/roles/Trouble Brewing/monk.js";
import {isTeaLadyProtected} from "./src/roles/Bad Moon Rising/tea_lady.js";
import {washerwomanInfo} from "./src/roles/Trouble Brewing/washerwoman.js";
import {librarianInfo} from "./src/roles/Trouble Brewing/librarian.js";
import {investigatorInfo} from "./src/roles/Trouble Brewing/investigator.js";
import {knightInfo} from "./src/roles/knight.js";
import {grandmotherInfo} from "./src/roles/Bad Moon Rising/grandmother.js";
import {fortuneTellerInfo} from "./src/roles/Trouble Brewing/fortune_teller.js";
import {butlerInfo} from "./src/roles/Trouble Brewing/butler.js";
import {undertakerInfo} from "./src/roles/Trouble Brewing/undertaker.js";
import {assignNewImp} from "./src/roles/Trouble Brewing/imp.js";
import {ravenkeeperInfo} from "./src/roles/Trouble Brewing/ravenkeeper.js";
import {addToLogs, createPopup, endGame, saveLocalStorage, storage} from "./shortcuts.js";
import {minstrelCheck} from "./src/roles/Bad Moon Rising/minstrel.js";
import {moonChildPick} from "./src/roles/Bad Moon Rising/moonchild.js";
import {assassinKill} from "./src/roles/Bad Moon Rising/assassin.js";
import {godfatherKill} from "./src/roles/Bad Moon Rising/godfather.js";
import {sailorPick} from "./src/roles/Bad Moon Rising/sailor.js";
import {poisonerPoison} from "./src/roles/Trouble Brewing/poisoner.js";
import {devilsAdvocateChoice} from "./src/roles/Bad Moon Rising/devils_advocate.js";
import {gamblerGamble} from "./src/roles/Bad Moon Rising/gambler.js";
import {exorcistChoice} from "./src/roles/Bad Moon Rising/exorcist.js";
import {pukkaPoisoning} from "./src/roles/Bad Moon Rising/pukka.js";

const n = "\n";
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

const townsfolkRoles = ["Steward", "Empath", "Chef", "Washerwoman", "Investigator"];
const outsiderRoles = ["Drunk"];
const minionRoles = ["Scarlet Woman"];
const demonRoles = ["Imp"];

const goodRoles = townsfolkRoles.concat(outsiderRoles);
const evilRoles = minionRoles.concat(demonRoles);
const allRoles = goodRoles.concat(evilRoles);

// todo - Recluse soll immer als böse registrieren
// todo - Spy soll immer als gut registrieren

async function startGame() {
    if (storage.night > 0) return;

    if (townsfolkRoles.length < storage.playerCount) {
        createPopup("You need to activate more Townsfolk roles", {backgroundColor: "red"});
        return;
    }
    if (storage.playerCount > characterTypeDistribution.length) {
        createPopup("You selected too many players", {backgroundColor: "red"});
        return;
    }

    if (characterTypeDistribution[storage.playerCount][1] > outsiderRoles.length) {
        createPopup("You need to activate more Outsider roles", {backgroundColor: "red"});
        return;
    }

    storage.night = 1;
    players.length = 0;
    storage.startTime = new Date().toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("start-game-button").style.display = "none";
    document.getElementById("player-count-input").style.display = "none";

    for (let i = 0; i < storage.playerCount; i++) {
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

    players.sort((a, b) => a.seat - b.seat);

    for (const player of players) {
        const playerCircle = document.getElementById("player-circle" + player.seat);
        playerCircle.style.cursor = "pointer";
        playerCircle.addEventListener("click", () => executePlayer(player));
    }

    await startNight();
}

async function startNight() {
    addToLogs("Night" + storage.night + " begins");
    await preDeathNightActions();
    await nightDeaths();
    giveInformation();
}

function giveInformation() {
    for (const player of alivePlayers()) {
        washerwomanInfo(player);
        librarianInfo(player);
        investigatorInfo(player);
        chefInfo(player);
        stewardInfo(player);
        knightInfo(player);
        grandmotherInfo(player);
        empathInfo(player);
        fortuneTellerInfo(player);
        butlerInfo(player);
        undertakerInfo(player);
    }
    chambermaidInfo();
    showClaims();
    addToLogs("Day" + storage.night + " begins");
}

function showClaims() {
    for (const player of players) {
        const roleImage = document.getElementById("player-role-image" + player.seat);
        roleImage.style.height = "80px";
        roleImage.style.width = "80px";
        roleImage.src = "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + player.bluff.toLowerCase().replaceAll(" ", "") + ".png";
        roleImage.style.position = "relative";

        const playerInfo = document.getElementById("player-info" + player.seat);
        playerInfo.style.visibility = player.info ? "visible" : "hidden";
        playerInfo.textContent = player.info;
    }
}

async function preDeathNightActions() {
    sailorPick();
    poisonerPoison();
    devilsAdvocateChoice();
    monkProtect();
    await gamblerGamble();
    exorcistChoice();
    await pukkaPoisoning();
}

async function nightDeaths() {
    if (storage.night === 1) return;

    for (const player of players) {
        if (player.role.characterType !== "Demon") continue;
        if (!player.isAlive && player.role.name !== "Zombuul") continue;
        if (player.role.name === "Pukka") continue;
        if (player.role.name === "Zombuul" && player.diedToday) continue;
        if (player.isExorcistChosen) {
            delete player.isExorcistChosen;
            continue;
        }

        addToChambermaidList(player);

        if (player.wasStarPassedTo) {
            delete player.wasStarPassedTo;
            continue;
        }
        if (isDrunk(player)) continue;

        if (player.role.name === "Shabaloth" && player.killTarget && player.killTarget2 && Math.random() < 0.33) {
            const revivedPlayer = Math.random() - 0.5 > 0.5 ? player.killTarget : player.killTarget2;
            revivedPlayer.isAlive = true;
            player.evilTarget = revivedPlayer;
        }

        let alivePlayers = players.filter(p => p.isAlive || p.role.name === "Zombuul" && p.lifes > 0).sort(() => Math.random() - 0.5);
        const aliveEvilsCount = alivePlayers.filter(p => !p.isGood).length;
        if (aliveEvilsCount === 1) alivePlayers = alivePlayers.filter(p => p.isGood);
        if (player.role.name === "Vortox" || player.role.name === "Zombuul" && player.lifes === 1 || player.role.name === "Shabaloth") alivePlayers = alivePlayers.filter(p => p.name !== player.name);
        if (player.role.name === "Imp") alivePlayers = alivePlayers.filter(p => p.role.characterType !== "Minion");

        player.killTarget = mayorRedirect(alivePlayers[0], player);
        await dies(player.killTarget, "night", player);

        if (player.role.name === "Shabaloth" && alivePlayers.length >= 2) {
            player.killTarget2 = mayorRedirect(alivePlayers[1], player);
            await dies(player.killTarget2, "night", player);
        }
    }

    assassinKill();
    godfatherKill();

    for (const player of players) {
        if (player.role.name === "Moonchild" && !isDrunk(player) && !player.isAlive && player.target && player.target.isGood) {
            await dies(player.target, "night", player);
            delete player.target;
        }
    }
}

async function dies(player, phase, attacker = undefined, isExecution = false) {

    if (isDrunk(attacker)) return;

    if (player.role?.name !== "Zombuul") {
        if (!player.isAlive) return;
    }

    if (attacker?.role.characterType === "Demon") {
        if (player.role.name === "Soldier" && !isDrunk(player)) {
            return;
        }
        if (isMonkProtected(player, attacker)) return;
    }

    if (isTeaLadyProtected(player) && attacker?.role.name !== "Assassin") return;

    if (phase === "day" && isExecution) {
        // Devil´s Advocate protection
        for (const player1 of alivePlayers()) {
            if (player1.role.name === "Devils Advocate" && !isDrunk(player1) && player1.evilTarget.name === player.name) {
                return;
            }
        }

        // Pacifist protection
        if (roleIsSoberAlive("Pacifist") && Math.random() < 0.33 && isGood(player)) {
            return;
        }

        // Sailor protection
        for (const player1 of alivePlayers()) {
            if (player1.role.name === "Sailor" && !isDrunk(player1) && player.name === player1.name) {
                return;
            }
        }

        moonChildPick();
    }

    player.isAlive = false;
    document.getElementById("player-circle" + player.seat).style.background = "gray";

    // Grandmother death
    if (attacker?.role.characterType === "Demon") {
        for (const player1 of alivePlayers()) {
            if (player1.role.name === "Grandmother" && !isDrunk(player1) && player.name === player1?.target?.name) {
                await dies(player1, phase, player1);
            }
        }
    }

    if (phase === "night" && player.role.name === "Imp" && attacker?.name === player.name) {
        assignNewImp(player);
    }

    if (player.role.characterType === "Demon" && attacker?.name !== player.name) {
        if (alivePlayers().length >= 4) {
            for (const player1 of alivePlayers()) {
                if (player1.role.name === "Scarlet Woman" && !isDrunk(player1)) {
                    player1.startingRole = "Scarlet Woman";
                    player1.role.name = player.role.name;
                    player1.role.characterType = "Demon";
                    if (player1.role.name === "Zombuul") player1.lifes = 2;
                }
            }
        }
    }

    if (player.role.name === "Zombuul") {
        player.lifes--;
    }

    // check win conditions

    if (alivePlayers().length <= 2 && alivePlayers().filter(p => p.role.characterType === "Demon").length > 0) {
        await endGame("Only 2 players live", "Evil");
        return;
    }
    if (!alivePlayers().find(p => p.role.characterType === "Demon") && !players.find(p => p.role.name === "Zombuul" && p.lifes > 0 && !isDrunk(p))) {
        await endGame("There is no living Demon", "Good");
        return;
    }
    if (phase === "night") {
        ravenkeeperInfo(player);
        if (player.role.name === "Poisoner") {
            player.drunkTarget.drunkSources = player.drunkTarget.drunkSources.filter(role => role !== "Poisoner");
        }
        if (player.role.name === "Sailor") {
            player.drunkTarget.drunkSources = player.drunkTarget.drunkSources.filter(role => role !== "Sailor");
        }
    }
    if (phase === "day") {
        for (const player1 of players) {
            if (player1.role.name === "Zombuul") {
                player1.diedToday = true;
            }
        }
        if (player.role.characterType === "Outsider") {
            for (const player1 of players) {
                if (player1.role.name === "Godfather") {
                    player1.outsiderDiedToday = true;
                }
            }
        }
    }
}

async function executePlayer(executed) {
    if (storage.night === 0) return;

    for (const player of players) {
        if (player.role.name === "Grandmother" || player.role.name === "Moonchild") continue;
        delete player.target;
        if (player.role.name === "Devils Advocate") continue;
        delete player.evilTarget;
        if (player.role.name === "Shabaloth") continue;
        delete player.killTarget;
        if (player.role.name === "Pukka") continue;
        delete player.drunkTarget;
    }

    if (executed.isAlive || executed.role.name === "Zombuul") {
        await dies(executed, "day", undefined, true);
        if (executed.role.name === "Saint" && !executed.isAlive && !isDrunk(executed)) {
            await endGame();
            return;
        }
        minstrelCheck(executed);

        if (!executed.isAlive && (executed.role.name !== "Zombuul" || executed.lifes > 0)) {
            for (const player of players) {
                if (player.bluff === "Undertaker") {
                    player.target = executed;
                }
            }
        }
    }
    if (!executed.isAlive) {
        if (alivePlayers().length === 3 && roleIsSoberAlive("Mayor")) {
            await endGame("Mayor Win!", "Good");
            return;
        }
    }

    // sober up all players
    for (const player of players) {
        player.drunkSources = player.drunkSources.filter(role => role !== "Sailor" && role !== "Poisoner");
        for (const player1 of alivePlayers()) {
            if (player1.role.name === "Minstrel" && !player1.minstrelDay) {
                player.drunkSources = player.drunkSources.filter(role => role !== "Minstrel");
            }
        }
    }
    for (const player of alivePlayers()) {
        if (player.role.name === "Minstrel") {
            delete player.minstrelDay;
        }
    }

    chambermaidList.length = 0;

    if (storage.night > 0) {
        storage.night++;
        saveLocalStorage();
        addToLogs(executed.name + " is executed and " + (executed.isAlive ? "survives" : "dies"));
        // dusk
        startNight();
    }
}

export {players, startGame, goodRoles, evilRoles, executePlayer, n, dies, minionRoles, townsfolkRoles, allRoles};