import {twoPingFakeInfo, twoPingRealInfo} from "./washerwoman.js";
import {spyBluffsAs} from "./spy.js";
import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {getPlayerByRole, getRandomPlayerNotAs, getsFalseInfo, getsTrueInfo} from "../../shortcuts.js";
import {outsiderRoles, players} from "../../../roleSelection.js";
import {storage} from "../../../shortcuts.js";

function librarianInfo(player) {
    if (player.bluff !== "Librarian") return;
    if (storage.night > 1 && getPlayerByRole("Shabaloth")?.evilTarget?.name !== player.name) return;

    addToChambermaidList(player, "Librarian");

    if (getsTrueInfo(player)) {
        if (players.filter(p => p.role.characterType === "Outsider").length === 0) {
            player.info += "0 Outsiders in-play";
        } else {
            const randomPlayer = players.filter(p => p.name !== player.name && (p.role.characterType === "Outsider" || spyBluffsAs(p,"Outsider"))).sort(() => Math.random() - 0.5)[0];
            const role = randomPlayer.role.name === "Spy" ? randomPlayer.bluff : randomPlayer.role.name;
            twoPingRealInfo(player, {name: randomPlayer.name, seat: randomPlayer.seat, role: role});
        }
    }
    if (getsFalseInfo(player)) {
        const outsiderBluffPlayers = players.filter(p => !p.isGood && p.name !== player.name && outsiderRoles.includes(p.bluff));
        if (outsiderBluffPlayers.length === 0) {
            const list = [];
            list.push(getRandomPlayerNotAs(player.name,"","","Drunk"));
            list.push(getRandomPlayerNotAs(player.name, list[0].name, "", "Drunk"));
            player.info += list[0].seat + " or " + list[1].seat + " is Drunk";
        } else {
            const randomBluffPlayer = outsiderBluffPlayers.sort(() => Math.random() - 0.5)[0];
            twoPingFakeInfo(player, randomBluffPlayer);
        }
    }
}

export {librarianInfo};