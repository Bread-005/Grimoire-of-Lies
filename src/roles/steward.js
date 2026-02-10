import {addToChambermaidList} from "./Bad Moon Rising/chambermaid.js";
import {getPlayerByRole, getsTrueInfo, isGood} from "../shortcuts.js";
import {players} from "../../roleSelection.js";
import {storage} from "../../shortcuts.js";

function stewardInfo(player) {
    if (player.bluff !== "Steward") return;
    if (storage.night > 1 && getPlayerByRole("Shabaloth")?.evilTarget?.name !== player.name) return;

    addToChambermaidList(player, "Steward");

    const player1 = players.filter(p => (getsTrueInfo(player) ? isGood(p) : !isGood(p)) && p.name !== player.name).sort(() => Math.random() - 0.5)[0] || player;
    player.info += player1.seat + " is good";
}

export {stewardInfo};