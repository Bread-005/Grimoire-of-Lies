import {players} from "./roleSelection.js";

let popupZIndex = 1000;
const API_URL = "https://clocktower-homebrew-collection-13pz.onrender.com";

function endGame(text = "", winningTeam = "") {
    createPopup("The Game ended", {top: "35%"});
    createPopup(text, {top: "42%"});
    createPopup("The " + winningTeam + " Team has won", {top: "49%"});
    storage.night = 0;
    saveLocalStorage();
    setTimeout(() => window.location.reload(), 11000);

    for (const player of players) {
        if (!player.isGood) {
            document.getElementById("player-role-image" + player.seat).src =
                "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + player.role.name.toLowerCase().replaceAll(" ", "") + ".png";
        }
    }
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

async function databaseIsConnected() {
    try {
        const response = await fetch(API_URL + "/users");
        return response.ok;
    } catch (err) {
        return false;
    }
}

const storage = JSON.parse(localStorage.getItem("grimoire-of-lies"));

function saveLocalStorage() {
    localStorage.setItem("grimoire-of-lies", JSON.stringify(storage));
}

function getRandomElement(array) {
    return array.sort(() => Math.random() - 0.5)[0];
}

export {endGame, createPopup, addToLogs, databaseIsConnected, API_URL, storage, saveLocalStorage, getRandomElement};