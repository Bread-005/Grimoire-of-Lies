import {addToChambermaidList} from "./chambermaid.js";
import {alivePlayers} from "../../shortcuts.js";
import {dies} from "../../../roleSelection.js";

async function godfatherKill() {
    for (const player of alivePlayers()) {
        if (player.role.name !== "Godfather") continue;
        if (!player.outsiderDiedToday) continue;

        addToChambermaidList(player, "Godfather");

        const randomAlivePlayer = alivePlayers().filter(p => p.isGood).sort(() => Math.random() - 0.5)[0] || player;
        await dies(randomAlivePlayer, "night", player);
    }
}
export {godfatherKill};