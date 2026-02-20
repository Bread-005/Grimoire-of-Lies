import {addToChambermaidList} from "./chambermaid.js";
import {alivePlayers, getRandomAlivePlayer} from "../../shortcuts.js";
import {storage} from "../../../shortcuts.js";


function exorcistChoice() {
    if (storage.night === 1) return;
    for (const player of alivePlayers()) {
        if (player.bluff !== "Exorcist") continue;

        player.target = getRandomAlivePlayer(player.name, player.target?.name) || player;
        player.info += (player.info.length === 0 ? "" : " ") + player.target.seat;

        addToChambermaidList(player, "Exorcist");
        player.target.isExorcistChosen = true;
    }
}

export {exorcistChoice};