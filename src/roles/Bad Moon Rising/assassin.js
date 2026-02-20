import {addToChambermaidList} from "./chambermaid.js";
import {alivePlayers, isDrunk} from "../../shortcuts.js";
import {dies} from "../../../roleSelection.js";

async function assassinKill() {
    for (const player of alivePlayers()) {
        if (player.role.name !== "Assassin") continue;
        if (player.hasUsedAbility) continue;

        addToChambermaidList(player, "Assassin");

        if (Math.random() > 0.33) continue;

        player.hasUsedAbility = true;
        if (isDrunk(player)) continue;
        const randomAlivePlayer = alivePlayers().filter(p => p.role.characterType !== "Demon").sort(() => Math.random() - 0.5)[0];
        await dies(randomAlivePlayer, "night", player);
    }
}

export {assassinKill};