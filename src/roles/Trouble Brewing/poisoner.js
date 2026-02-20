import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {alivePlayers, isDrunk, updateDrunkness} from "../../shortcuts.js";

function poisonerPoison() {
    for (const player of alivePlayers()) {
        if (player.role.name !== "Poisoner") continue;

        addToChambermaidList(player, "Poisoner");

        if (isDrunk(player)) continue;

        player.drunkTarget = alivePlayers().filter(p => p.isGood).sort(() => Math.random() - 0.5)[0] || player;
        if (!player.poisonerChain) player.poisonerChain = [];
        player.poisonerChain.push(player.drunkTarget.name);
        updateDrunkness(player);
    }
}

export {poisonerPoison};