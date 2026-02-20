import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {alivePlayers, getRandomAlivePlayer, isDrunk} from "../../shortcuts.js";
import {storage} from "../../../shortcuts.js";

function monkProtect() {
    if (storage.night === 1) return;
    for (const player of alivePlayers()) {
        if (player.bluff !== "Monk") continue;

        addToChambermaidList(player, "Monk");

        player.target = getRandomAlivePlayer(player.name);
        player.info += (player.info.length === 0 ? "" : " ") + player.target.seat;

        for (const pukka of alivePlayers()) {
            if (pukka.role.name === "Pukka" && player.role.name === "Monk" && !isDrunk(player) && pukka.drunkTarget?.name === player.target?.name) {
                pukka.drunkTarget.drunkSources = pukka.drunkTarget.drunkSources.filter(role => role !== "Pukka");
                delete pukka.drunkTarget;
            }
        }
    }
}

function isMonkProtected(player, attacker) {
    if (attacker.role.characterType !== "Demon") return false;
    for (const player1 of alivePlayers()) {
        if (player1.role.name === "Monk" && !isDrunk(player1) && player1?.target?.name === player?.name) {
            return true;
        }
    }
    return false;
}

export {monkProtect, isMonkProtected};