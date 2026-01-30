import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {getAliveNeighbor, getsFalseInfo, getsTrueInfo, isGood} from "../../shortcuts.js";
import {players} from "../../../roleSelection.js";

function empathInfo(player) {
    if (player.bluff !== "Empath") return;

    addToChambermaidList(player, "Empath");

    let number = 0;
    if (!isGood(getAliveNeighbor(player.seat, -1))) number++;
    if (!isGood(getAliveNeighbor(player.seat, 1))) number++;

    if (player.info.length > 0) player.info += " ";
    if (getsTrueInfo(player)) {
        player.info += number;
    }
    if (getsFalseInfo(player)) {
        let fakeNumbers = [0, 0, 0, 0, 1, 1, 1, 1];
        if (players.length > 6) fakeNumbers.push(2);
        fakeNumbers = fakeNumbers.filter(number1 => number1 !== number);
        fakeNumbers.sort(() => Math.random() - 0.5);
        player.info += fakeNumbers[0];
    }
}

export {empathInfo};