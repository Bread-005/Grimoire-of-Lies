import {isTeaLadyProtected} from "../Bad Moon Rising/tea_lady.js";
import {isMonkProtected} from "./monk.js";
import {alivePlayers, isDrunk} from "../../shortcuts.js";

function mayorRedirect(player, attacker) {
    if (player.role.name !== "Mayor") return player;
    if (isDrunk(player)) return player;
    if (Math.random() < 0.3) return player;

    if (isMonkProtected(player, attacker)) return player;
    if (isTeaLadyProtected(player)) return player;

    const player1 = alivePlayers().filter(p => p.isGood && p.name !== player.name);
    if (!player1) return player;

    return player1;
}

export {mayorRedirect};