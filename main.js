import {allRoles, startGame} from "./roleSelection.js";
import {API_URL, loginStorage, saveLocalStorage, storage} from "./shortcuts.js";

document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("grimoire-of-lies")) {
        const storage1 = {
            playerCount: 8,
            night: 0,
            startTime: "",
            selectedRoles: []
        }
        for (const role of allRoles) {
            storage1.selectedRoles.push(role);
        }
        localStorage.setItem("grimoire-of-lies", JSON.stringify(storage1));
        window.location.reload();
    }
    if (storage.user) {
        delete storage.user;
    }

    storage.night = 0;
    saveLocalStorage();

    if (!localStorage.getItem("login-page")) {
        window.location = "https://bread-005.github.io/login-page/index.html";
        return;
    }

    const users = await fetch(API_URL + "/users").then(res => res.json());
    if (loginStorage.password !== users.find(user => user.name === loginStorage.name)?.password) {
        window.location = "https://bread-005.github.io/login-page/index.html";
        return;
    }

    await fetch(API_URL + '/users/update/' + loginStorage.name, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'}
    });

    setupUserName();
    setupRoleSelection();
    createGrimoire();
    setupPlayerCountSelection();
    document.getElementById("start-game-button").addEventListener("click", startGame);

    function createGrimoire() {
        const grimoire = document.getElementById("grimoire");
        grimoire.innerHTML = "";

        const centerX = 300;
        const centerY = 300;
        const radius = 220;

        for (let i = 0; i < storage.playerCount; i++) {
            const offset = -Math.PI / 2;
            const angle = offset + (2 * Math.PI / storage.playerCount) * i;

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const circle = document.createElement("div");
            circle.id = "player-circle" + i;
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
        const playerCountInput = document.getElementById("player-count-input");
        playerCountInput.value = storage.playerCount;

        playerCountInput.addEventListener("input", () => {
            if (playerCountInput.value < 3) {
                playerCountInput.value = 3;
            }
            if (playerCountInput.value > 12) {
                playerCountInput.value = 12;
            }
            storage.playerCount = Number(playerCountInput.value);
            saveLocalStorage();
            createGrimoire();
        });
    }

    function setupUserName() {
        document.getElementById("username-div").textContent = "Name: " + loginStorage.name;
        document.getElementById("logout-button").addEventListener("click", () => window.location = "https://bread-005.github.io/login-page/index.html");
    }

    function setupRoleSelection() {
        const select = document.getElementById("role-selection-dropdown");
        for (const role of allRoles) {
            const label = document.createElement("label");
            label.for = role.name + "-role-selection-input";
            const input = document.createElement("input");
            input.id = role.name + "-role-selection-input";
            input.type = "checkbox";
            input.checked = storage.selectedRoles.map(role1 => role1.name).includes(role.name);
            label.append(input);
            label.append(role.name);
            select.append(label);

            input.addEventListener("click", (event) => {
                if (storage.night > 0) {
                    event.preventDefault();
                    return;
                }
                if (storage.selectedRoles.map(role1 => role1.name).includes(role.name)) {
                    storage.selectedRoles = storage.selectedRoles.filter(role1 => role1.name !== role.name);
                } else {
                    storage.selectedRoles.push(role);
                }
                saveLocalStorage();
            });
        }
    }
});