import {getPlayerByRole, getsFalseInfo, getsTrueInfo, isGood, night} from "../../shortcuts.js";
import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {players} from "../../../roleSelection.js";

function chefInfo(player) {
    if (player.bluff !== "Chef") return;
    if (night() > 1 && getPlayerByRole("Shabaloth")?.evilTarget?.name !== player.name) return;

    addToChambermaidList(player, "Chef");

    let number = 0;
    if (!isGood(players[0]) && !isGood(players[players.length - 1])) number++;
    for (let i = 1; i < players.length; i++) {
        if (!isGood(players[i]) && !isGood(players[i - 1])) number++;
    }

    if (getsTrueInfo(player)) {
        player.info += number;
    }
    if (getsFalseInfo(player)) {
        let fakeNumbers = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
        if (players.length > 9) fakeNumbers.push(2);
        if (players.length > 12) {
            fakeNumbers.push(0);
            fakeNumbers.push(1);
            fakeNumbers.push(1);
            fakeNumbers.push(2);
            fakeNumbers.push(3);
        }
        fakeNumbers = fakeNumbers.filter(number1 => number1 !== number);
        fakeNumbers.sort(() => Math.random() - 0.5);
        player.info += fakeNumbers[0];
    }
}

export {chefInfo};