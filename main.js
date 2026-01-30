import {startGame} from "./roleSelection.js";

document.addEventListener("DOMContentLoaded", () => {
    const playerCountInput = document.getElementById("player-count-input");

    if (!localStorage.getItem("player-count")) {
        localStorage.setItem("player-count", "8");
    }
    if (!localStorage.getItem("game-is-running")) {
        localStorage.setItem("game-is-running", "false");
    }

    localStorage.setItem("game-is-running", "false");

    createGrimoire();
    setupPlayerCountSelection();
    document.getElementById("start-game-button").addEventListener("click", startGame);


    function createGrimoire() {
        const grimoire = document.getElementById("grimoire");
        grimoire.innerHTML = "";

        const centerX = 300;
        const centerY = 300;
        const radius = 220;

        const playerCount = Number(localStorage.getItem("player-count"));

        for (let i = 0; i < playerCount; i++) {
            const offset = -Math.PI / 2;
            const angle = offset + (2 * Math.PI / playerCount) * i;

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const circle = document.createElement("div");
            circle.classList.add("player-circle");
            circle.style.left = x + "px";
            circle.style.top = y + "px";

            const playerName = document.createElement("p");
            playerName.id = "player-name" + i;
            playerName.textContent = "# " + i;
            playerName.classList.add("player-name");

            const img = document.createElement("img");
            img.id = "player-role-image" + i;

            const playerInfo = document.createElement("p");
            playerInfo.id = "player-info" + i;
            playerInfo.classList.add("player-info");

            circle.append(playerName);
            circle.append(img);
            circle.append(playerInfo);
            grimoire.append(circle);
        }
    }

    function setupPlayerCountSelection() {
        playerCountInput.value = localStorage.getItem("player-count");

        playerCountInput.addEventListener("input", () => {
            if (playerCountInput.value < 3) {
                playerCountInput.value = 3;
            }
            if (playerCountInput.value > 12) {
                playerCountInput.value = 12;
            }
            localStorage.setItem("player-count", playerCountInput.value);
            createGrimoire();
        });
    }
});