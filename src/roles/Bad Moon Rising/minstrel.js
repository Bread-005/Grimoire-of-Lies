import {alivePlayers, isDrunk} from "../../shortcuts.js";

function minstrelCheck(executed) {
    if (executed.role.characterType !== "Minion") return;
    if (executed.isAlive) return;

    for (const player of alivePlayers()) {
        if (player.role.name === "Minstrel" && !isDrunk(player)) {
            player.minstrelDay = true;
            for (const player1 of alivePlayers()) {
                if (player1 !== player) {
                    player1.drunkSources.push("Minstrel");
                }
            }
        }
    }
}

export {minstrelCheck};