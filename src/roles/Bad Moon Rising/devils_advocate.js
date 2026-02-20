import {addToChambermaidList} from "./chambermaid.js";
import {alivePlayers, getAliveNeighbor} from "../../shortcuts.js";

function devilsAdvocateChoice() {
    for (const player of alivePlayers()) {
        if (player.role.name !== "Devils Advocate") continue;

        addToChambermaidList(player, "Devils Advocate");

        const evilPlayers = alivePlayers().filter(p => !p.isGood && p.name !== player?.evilTarget?.name);
        for (const player1 of evilPlayers) {
            if (player1.bluff === "Tea Lady") {
                evilPlayers.push(getAliveNeighbor(player1.seat,1));
                evilPlayers.push(getAliveNeighbor(player1.seat,-1));
            }
        }
        const randomGoodPlayer = alivePlayers().filter(p => p.isGood && p.name !== player?.evilTarget?.name).sort(() => Math.random() - 0.5)[0];
        player.evilTarget = evilPlayers.sort(() => Math.random() - 0.5)[0] || randomGoodPlayer;
        if (!player.devilsAdvocateChain) player.devilsAdvocateChain = [];
        player.devilsAdvocateChain.push(player.evilTarget.name);
    }
}

export {devilsAdvocateChoice};