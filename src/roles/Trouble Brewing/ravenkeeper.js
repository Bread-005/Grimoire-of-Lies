import {getRandomAlivePlayer, getsFalseInfo, getsTrueInfo} from "../../shortcuts.js";
import {evilRoles} from "../../../roleSelection.js";
import {getRandomElement} from "../../../shortcuts.js";

function ravenkeeperInfo(player) {
    if (player.bluff !== "Ravenkeeper") return;
    if (player.isAlive) return;

    const randomAlivePlayer = getRandomAlivePlayer();

    if (getsTrueInfo(player)) {
        let role = randomAlivePlayer.role.name;
        if (randomAlivePlayer.role.name === "Recluse") role = getRandomElement(evilRoles);
        if (randomAlivePlayer.role.name === "Spy") role = randomAlivePlayer.bluff;
        player.info = randomAlivePlayer.seat + " is " + role;
    }
    if (getsFalseInfo(player)) {
        if (randomAlivePlayer.role.name === "Drunk" || !randomAlivePlayer.isGood) {
            player.info = randomAlivePlayer.seat + " is " + randomAlivePlayer.bluff;
        } else {
            player.info = randomAlivePlayer.seat + " is " + getRandomElement(evilRoles);
        }
    }
}

export {ravenkeeperInfo};