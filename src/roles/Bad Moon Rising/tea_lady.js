import {alivePlayers, getAliveNeighbor, isDrunk, isGood} from "../../shortcuts.js";

function isTeaLadyProtected(player) {
    for (const player1 of alivePlayers()) {
        if (player1.role.name === "Tea Lady" && !isDrunk(player1)) {
            if (player.name === getAliveNeighbor(player1.seat,1).name || player.name === getAliveNeighbor(player1.seat,-1).name) {
                if (isGood(getAliveNeighbor(player1.seat, 1)) && isGood(getAliveNeighbor(player1.seat,-1))) {
                    return true;
                }
            }
        }
    }
    return false;
}

export {isTeaLadyProtected};