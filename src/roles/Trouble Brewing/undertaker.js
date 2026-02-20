import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {storage} from "../../../shortcuts.js";
import {getsFalseInfo, getsTrueInfo} from "../../shortcuts.js";
import {evilRoles} from "../../../roleSelection.js";

function undertakerInfo(player) {
    if (player.bluff !== "Undertaker") return;
    if (storage.night === 1) return;
    if (!player.target) return;

    addToChambermaidList(player, "Undertaker");

    const executed = player.target;

    if (player.info.length > 0) player.info += " ";
    if (getsTrueInfo(player)) {
        let role = executed.role.name;
        if (executed.role.name === "Recluse") role = evilRoles.sort(() => Math.random() - 0.5)[0];
        if (executed.role.name === "Spy") role = executed.bluff;
        player.info = executed.seat + " is " + role;
    }
    if (getsFalseInfo(player)) {
        if (executed.role.name === "Drunk" || !executed.isGood) {
            player.info = executed.seat + " is " + executed.bluff;
        } else {
            player.info = executed.seat + " is " + evilRoles.sort(() => Math.random() - 0.5)[0];
        }
    }
}

export {undertakerInfo};