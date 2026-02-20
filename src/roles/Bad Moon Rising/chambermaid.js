import {alivePlayers, getRandomAlivePlayer, getsFalseInfo, getsTrueInfo} from "../../shortcuts.js";
import {storage} from "../../../shortcuts.js";

const chambermaidList = [];

function chambermaidInfo() {
    for (const player of alivePlayers()) {
        if (player.bluff !== "Chambermaid") continue;
        if (alivePlayers().length < 3) {
            player.info = "zu wenige leben";
            continue;
        }

        for (const player of alivePlayers()) {
            if (player.role.name === "Spy" || player.role.name === "Godfather" && storage.night === 1) {
                chambermaidList.push(player.name);
            }
        }

        let number = 0;
        const randomPlayer1 = getRandomAlivePlayer(player.name);
        const randomPlayer2 = getRandomAlivePlayer(player.name, randomPlayer1.name);
        if (chambermaidList.includes(randomPlayer1.name)) number++;
        if (chambermaidList.includes(randomPlayer2.name)) number++;

        if (getsTrueInfo(player)) {
            player.info = randomPlayer1.seat + " and " + randomPlayer2.seat + ": " + number;
        }
        if (getsFalseInfo(player)) {
            const fakeNumbers = [0, 1, 2];
            fakeNumbers.splice(number, 1);
            fakeNumbers.sort(() => Math.random() - 0.5);
            player.info = randomPlayer1.seat + " and " + randomPlayer2.seat + ": " + fakeNumbers[0];
        }
    }
}

function addToChambermaidList(player, role = player.role.name) {
    if (player.role.name === role || player.role.name === "Drunk" && player.bluff === role) {
        chambermaidList.push(player.name);
    }
}

export {chambermaidInfo, addToChambermaidList, chambermaidList};