import {addToChambermaidList} from "./chambermaid.js";
import {alivePlayers, isDrunk} from "../../shortcuts.js";
import {storage} from "../../../shortcuts.js";
import {dies} from "../../../roleSelection.js";

async function gamblerGamble() {
    if (storage.night < 2) return;
    for (const player of alivePlayers()) {
        if (player.bluff !== "Gambler") continue;

        addToChambermaidList(player, "Gambler");

        const randomAlivePlayer = alivePlayers().filter(p => p.name !== player.name).sort(() => Math.random() - 0.5)[0] || player;

        player.info = randomAlivePlayer.seat + " as " + randomAlivePlayer.bluff;

        if (player.role.name === "Gambler" && !isDrunk(player) && randomAlivePlayer.role.name !== randomAlivePlayer.bluff) {
            await dies(player, "night", player);
        }
    }
}

export {gamblerGamble};