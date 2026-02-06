import {spyBluffsAs} from "./spy.js";
import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {getPlayerByRole, getRandomPlayer, getsFalseInfo, getsTrueInfo, night} from "../../shortcuts.js";
import {players, townsfolkRoles} from "../../../roleSelection.js";

function washerwomanInfo(player) {
    if (player.bluff !== "Washerwoman") return;
    if (night() > 1 && getPlayerByRole("Shabaloth")?.evilTarget?.name !== player.name) return;

    addToChambermaidList(player, "Washerwoman");

    if (getsTrueInfo(player)) {
        const randomPlayer = players.filter(p => p.name !== player.name && (p.role.characterType === "Townsfolk" || spyBluffsAs(p,"Townsfolk"))).sort(() => Math.random() - 0.5)[0];
        twoPingRealInfo(player, {name: randomPlayer.name, seat: randomPlayer.seat, role: randomPlayer.bluff});
    }
    if (getsFalseInfo(player)) {
        const randomBluffPlayer = players.filter(p => p.role.name !== p.bluff && p.name !== player.name && townsfolkRoles.includes(p.bluff)).sort(() => Math.random() - 0.5)[0];
        twoPingFakeInfo(player, randomBluffPlayer || player);
    }
}

function twoPingRealInfo(player, randomPlayer) {
    const list = [];
    list.push(randomPlayer);
    list.push(getRandomPlayer(player.name, list[0].name));
    list.sort(() => Math.random() - 0.5);
    player.info += list[0].seat + " oder " + list[1].seat + " ist " + randomPlayer.role;
}

function twoPingFakeInfo(player, randomBluffPlayer) {
    const list = [];
    list.push(randomBluffPlayer);
    list.push(getRandomPlayer(player.name, randomBluffPlayer.name));
    list.sort(() => Math.random() - 0.5);
    player.info += list[0].seat + " oder " + list[1].seat + " ist " + randomBluffPlayer.bluff;
}

export {washerwomanInfo, twoPingRealInfo, twoPingFakeInfo};