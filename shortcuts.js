import {players} from "./roleSelection.js";

let popupZIndex = 1000;
const API_URL = "https://clocktower-homebrew-collection-13pz.onrender.com";

function endGame(text = "", winningTeam = "") {
    createPopup("The Game ended", "35%");
    createPopup(text, "42%");
    createPopup("The " + winningTeam + " Team has won", "49%");
    localStorage.setItem("game-is-running", "false");
    setTimeout(() => window.location.reload(), 11000);

    for (const player of players) {
        if (!player.isGood) {
            document.getElementById("player-role-image" + player.seat).src =
                "https://wiki.bloodontheclocktower.com/Special:FilePath/icon_" + player.role.name.toLowerCase().replaceAll(" ", "") + ".png";
        }
    }
}

function createPopup(text, top = "20%", right = "50%", parentElement = document.getElementById("grimoire"), duration = 10000, backgroundColor = "lime") {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.style.top = top;
    popup.style.right = right;
    popup.style.backgroundColor = backgroundColor;
    popupZIndex++;
    popup.style.zIndex = popupZIndex.toString();
    const p = document.createElement("p");
    p.textContent = text;
    popup.append(p);
    parentElement.append(popup);

    setTimeout(() => {
        parentElement.removeChild(popup);
        popupZIndex--;
    }, duration);
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

export {endGame, createPopup, addToLogs, databaseIsConnected, API_URL};