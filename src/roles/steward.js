import {addToChambermaidList} from "./Bad Moon Rising/chambermaid.js";
import {getsTrueInfo, isGood, night} from "../shortcuts.js";
import {players} from "../../roleSelection.js";

function stewardInfo(player) {
    if (player.bluff !== "Steward") return;
    if (night() > 1) return;

    addToChambermaidList(player, "Steward");

    const player1 = players.filter(p => (getsTrueInfo(player) ? isGood(p) : !p.isGood) && p.name !== player.name).sort(() => Math.random() - 0.5)[0] || player;
    player.info += player1.seat + " ist gut";
}

export {stewardInfo};