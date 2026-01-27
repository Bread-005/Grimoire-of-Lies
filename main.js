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
            circle.style.display = "flex";
            circle.style.justifyContent = "center";
            circle.style.alignItems = "center";

            const img = document.createElement("img");
            img.src = "https://i.postimg.cc/qM09f8cD/placeholder-icon.png";
            img.style.height = "80px";
            img.style.width = "80px";
            img.id = "player-role-image" + i;

            circle.append(img);
            grimoire.append(circle);
        }
    }

    function setupPlayerCountSelection() {
        playerCountInput.value = localStorage.getItem("player-count");

        playerCountInput.addEventListener("input", () => {
            if (playerCountInput.value > 12) {
                playerCountInput.value = 12;
            }
            localStorage.setItem("player-count", playerCountInput.value);
            createGrimoire();
        });
    }
});