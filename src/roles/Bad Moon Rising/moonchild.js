import {players} from "../../../roleSelection.js";
import {alivePlayers} from "../../shortcuts.js";

function moonChildPick() {
    for (const player of players) {
        if (player.bluff === "Moonchild" && !player.isAlive && player.info.length === 0) {
            player.target = alivePlayers().sort(() => Math.random() - 0.5)[0];
            player.info = "Ich wähle " + player.target.seat;
        }
    }
}

export {moonChildPick};