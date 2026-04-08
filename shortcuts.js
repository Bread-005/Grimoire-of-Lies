import {players} from "./roleSelection.js";
import {isDrunk} from "./src/shortcuts.js";

let popupZIndex = 1000;
const API_URL = "https://clocktower-homebrew-collection-13pz.onrender.com";

async function endGame(text = "", winningTeam = "") {
    if (storage.night === 0) return;
    createPopup("The Game ended", {top: "34%"});
    createPopup(text, {top: "42%"});
    createPopup("The " + winningTeam + " Team has won", {top: "50%"});
    storage.night = 0;
    saveLocalStorage();

    for (const player of players) {
        if (player.role.name !== player.bluff) {
            document.getElementById("player-role-image" + player.seat).src =
                "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + player.role.name.toLowerCase().replaceAll(" ", "") + ".png";
        }
    }

    const games = await fetch(API_URL + "/grimoire-of-lies/games").then(res => res.json());

    const statsPlayers = [];

    for (const player of players) {
        const statsPlayer = {
            name: player.name,
            team: player.isGood ? "Good" : "Evil",
            role: player.role.name,
            startingRole: player.startingRole,
            characterType: player.role.characterType,
            bluff: player.bluff,
            isAlive: player.isAlive,
            isDrunk: isDrunk(player),
            info: player.info,
            seat: player.seat
        }
        if (!statsPlayer.startingRole) delete statsPlayer.startingRole;
        if (player.role.name === "Fortune Teller") statsPlayer.FortuneTellerRedHering = player.redHering;
        if (player.poisonerChain) statsPlayer.poisonerChain = player.poisonerChain;
        if (player.role.name === "Virgin") statsPlayer.virginNominated = player.virginNominated;
        if (player.butlerChain) statsPlayer.butlerChain = player.butlerChain;
        if (player.devilsAdvocateChain) statsPlayer.devilsAdvocateChain = player.devilsAdvocateChain;
        statsPlayers.push(statsPlayer);
    }

    const game = {
        id: games.length + 1,
        players: statsPlayers,
        winningTeam: winningTeam,
        winningText: text,
        currentActivatedRoles: storage.selectedRoles.map(role => role.name),
        realLifePlayer: loginStorage.name,
        startTime: storage.startTime,
        endTime: new Date().toLocaleString("de-DE", {day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"})
    };

    await fetch(API_URL + '/grimoire-of-lies/games/create', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(game)
    });

    setTimeout(() => window.location.reload(), 11000);
}

function createPopup(text, options) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.style.top = options.top || "40%";
    popup.style.right = options.right || "50%";
    popup.style.backgroundColor = options.backgroundColor || "lime";
    const parentElement = options.parentElement || document.getElementById("grimoire");
    popupZIndex++;
    popup.style.zIndex = popupZIndex.toString();
    const p = document.createElement("p");
    p.textContent = text;
    popup.append(p);
    parentElement.append(popup);

    setTimeout(() => {
        if (parentElement.contains(popup)) {
            parentElement.removeChild(popup);
        }
        popupZIndex--;
    }, options.duration || 10000);
}

function addToLogs(text) {
    const div = document.createElement("div");
    div.textContent = text;
    document.getElementById("logs").append(div);
}

const storage = JSON.parse(localStorage.getItem("grimoire-of-lies"));

function saveLocalStorage() {
    localStorage.setItem("grimoire-of-lies", JSON.stringify(storage));
}

function getRandomElement(array) {
    return array.sort(() => Math.random() - 0.5)[0];
}

const loginStorage = JSON.parse(localStorage.getItem("login-page"));

export {endGame, createPopup, addToLogs, API_URL, storage, saveLocalStorage, getRandomElement, loginStorage};