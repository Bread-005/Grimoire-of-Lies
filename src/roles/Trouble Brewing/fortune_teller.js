import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {getRandomPlayer, getsFalseInfo, getsTrueInfo} from "../../shortcuts.js";
import {players} from "../../../roleSelection.js";
import {addToLogs} from "../../../shortcuts.js";

function fortuneTellerInfo(player) {
    if (player.bluff !== "Fortune Teller") return;

    addToChambermaidList(player, "Fortune Teller");

    const list = [];
    list.push(getRandomPlayer(player.name));
    list.push(getRandomPlayer(player.name, list[0].name));
    if (player.role.name === "Fortune Teller" && !player.redHering) player.redHering = players.filter(p => p.isGood).sort(() => Math.random() - 0.5)[0].name;

    if (getsTrueInfo(player)) {
        if (list[0].role.characterType === "Demon" || list[1].role.characterType === "Demon" ||
            list[0].name === player.redHering || list[1].name === player.redHering ||
            list[0].role.name === "Recluse" || list[1].role.name === "Recluse") {
            player.info = list[0].seat + " or " + list[1].seat + " is Demon";
        } else {
            player.info = list[0].seat + " and " + list[1].seat + " no Demon";
        }
    }
    if (getsFalseInfo(player)) {
        if (list[0].role.characterType === "Demon" || list[1].role.characterType === "Demon" ||
            list[0].role.name === "Recluse" || list[1].role.name === "Recluse") {
            player.info = list[0].seat + " and " + list[1].seat + " no Demon";
        } else {
            player.info = list[0].seat + " or " + list[1].seat + " is Demon";
        }
    }
    addToLogs( "FT: " + player.info);
}

export {fortuneTellerInfo};