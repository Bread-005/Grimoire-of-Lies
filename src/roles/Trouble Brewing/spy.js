import {isDrunk} from "../../shortcuts.js";
import {outsiderRoles, townsfolkRoles} from "../../../roleSelection.js";

function spyBluffsAs(player, type) {
    if (player.role.name !== "Spy") return false;
    if (isDrunk(player)) return false;

    return type === "Townsfolk" && townsfolkRoles.includes(player.bluff) || type === "Outsider" && outsiderRoles.includes(player.bluff);
}

export {spyBluffsAs};