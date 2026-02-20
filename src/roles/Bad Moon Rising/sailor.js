import {addToChambermaidList} from "./chambermaid.js";
import {alivePlayers, getRandomPlayer, isDrunk, updateDrunkness} from "../../shortcuts.js";

function sailorPick() {
    for (const player of alivePlayers()) {
        if (player.bluff === "Sailor") {
            player.target = getRandomPlayer(player.name) || player;
            player.info = "I chose " + player.target.seat;

            addToChambermaidList(player, "Sailor");

            if (player.role.name === "Sailor" && !isDrunk(player)) {
                player.drunkTarget = player.target;
                if (player.drunkTarget.role.characterType === "Townsfolk" && Math.random() < 0.8 ||
                    player.drunkTarget.role.characterType === "Outsider" && Math.random() < 0.3 ||
                    player.drunkTarget.role.characterType === "Minion" && Math.random() < 0.2 ||
                    player.drunkTarget.role.characterType === "Demon" && Math.random() < 0.1) {
                    updateDrunkness(player);
                } else {
                    player.drunkTarget = player;
                    updateDrunkness(player);
                }
            }
        }
    }
}

export {sailorPick};