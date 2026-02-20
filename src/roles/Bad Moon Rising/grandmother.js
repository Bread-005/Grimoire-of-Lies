import {addToChambermaidList} from "./chambermaid.js";
import {getPlayerByRole, getsFalseInfo, getsTrueInfo, isGood} from "../../shortcuts.js";
import {storage} from "../../../shortcuts.js";
import {players} from "../../../roleSelection.js";

function grandmotherInfo(player) {
    if (player.bluff !== "Grandmother") return;
    if (storage.night > 1 && getPlayerByRole("Shabaloth")?.evilTarget?.name !== player.name) return;

    addToChambermaidList(player, "Grandmother");

    if (getsTrueInfo(player)) {
        const randomPlayer = players.filter(p => p.name !== player.name && isGood(p)).sort(() => Math.random() - 0.5)[0];
        player.info += randomPlayer.seat + " is " + (randomPlayer.role.name === "Spy" ? randomPlayer.bluff : randomPlayer.role.name);
        player.target = randomPlayer;
    }
    if (getsFalseInfo(player)) {
        const randomPlayer = players.filter(p => p.name !== player.name && p.role.name !== p.bluff).sort(() => Math.random() - 0.5)[0] || player;
        player.info += randomPlayer.seat + " is " + randomPlayer.bluff;
        if (player.role.name === "Grandmother") player.target = randomPlayer;
    }
}

export {grandmotherInfo};