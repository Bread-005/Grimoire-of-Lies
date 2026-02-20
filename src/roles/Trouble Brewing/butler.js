import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {getRandomAlivePlayer} from "../../shortcuts.js";

function butlerInfo(player) {
    if (player.bluff !== "Butler") return;

    addToChambermaidList(player, "Butler");

    if (!player.butlerChain) player.butlerChain = [];
    const randomAlivePlayer = getRandomAlivePlayer(player.name);
    player.butlerChain.push(randomAlivePlayer.name);
    player.info += (player.info.length === 0 ? "": " ") + randomAlivePlayer.seat;
}

export {butlerInfo};