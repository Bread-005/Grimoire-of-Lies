import {twoPingRealInfo} from "./washerwoman.js";
import {addToChambermaidList} from "../Bad Moon Rising/chambermaid.js";
import {getPlayerByRole, getRandomPlayerNotAs, getsFalseInfo, getsTrueInfo, night} from "../../shortcuts.js";
import {minionRoles, players} from "../../../roleSelection.js";

function investigatorInfo(player) {
    if (player.bluff !== "Investigator") return;
    if (night() > 1 && getPlayerByRole("Shabaloth")?.evilTarget?.name !== player.name) return;

    addToChambermaidList(player, "Investigator");

    if (getsTrueInfo(player)) {
        let randomPlayer = players.filter(p => p.role.characterType === "Minion" && p.name !== player.name).sort(() => Math.random() - 0.5)[0];
        if (!randomPlayer) {
            player.info += "Es gibt keine Minions";
            return;
        }
        let role = randomPlayer.role.name;
        if (Math.random() < 0.3 && players.find(p => p.role.name === "Recluse")) {
            randomPlayer = players.find(p => p.role.name === "Recluse");
            role = minionRoles.sort(() => Math.random() - 0.5)[0];
        }
        twoPingRealInfo(player, {name: randomPlayer.name, seat: randomPlayer.seat, role: role});
    }
    if (getsFalseInfo(player)) {
        const randomMinionRole = minionRoles.sort(() => Math.random() - 0.5)[0];
        const list = [];
        list.push(getRandomPlayerNotAs(player.name, "", "", randomMinionRole));
        list.push(getRandomPlayerNotAs(player.name, list[0].name, "", randomMinionRole));
        list.sort(() => Math.random() - 0.5);
        player.info += list[0].seat + " oder " + list[1].seat + " ist " + randomMinionRole;
    }
}

export {investigatorInfo};