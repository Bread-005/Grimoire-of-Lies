import {addToChambermaidList} from "./Bad Moon Rising/chambermaid.js";
import {storage} from "../../shortcuts.js";
import {getRandomPlayerNotAs, getsFalseInfo, getsTrueInfo} from "../shortcuts.js";
import {players} from "../../roleSelection.js";

function knightInfo(player) {
    if (player.bluff !== "Knight") return;
    if (storage.night > 1) return;

    addToChambermaidList(player, "Knight");

    const list = [];
    if (getsTrueInfo(player)) {
        list.push(getRandomPlayerNotAs(player.name, "", "Demon"));
    }
    if (getsFalseInfo(player)) {
        list.push(players.find(player => player.role.characterType === "Demon"));
    }
    list.push(getRandomPlayerNotAs(player.name, list[0].name, "Demon"));
    list.sort(() => Math.random() - 0.5);
    player.info += list[0].seat + " is " + list[1].seat + " no Demon";
}

export {knightInfo};