import {players} from "../roleSelection.js";
import {storage} from "../shortcuts.js";

function getRandomPlayer(name = "", name2 = "") {
    return players.filter(player => player.name !== name && player.name !== name2).sort(() => Math.random() - 0.5)[0];
}

function getRandomPlayerNotAs(name = "", name2 = "", type = "", role = "") {
    return players.filter(player => player.name !== name && player.name !== name2 && player.role.characterType !== type && player.role.name !== role).sort(() => Math.random() - 0.5)[0];
}

function alivePlayers() {
    return players.filter(p => p.isAlive);
}

function getAliveNeighbor(startIndex, direction) {
    let index = startIndex;
    for (let i = 0; i < players.length; i++) {
        index += direction;
        if (index < 0) index = players.length - 1;
        if (index >= players.length) index = 0;

        if (players[index].isAlive) {
            return players[index];
        }
    }
    return players[startIndex];
}

function getRandomAlivePlayer(name = "", name2 = "") {
    return alivePlayers().filter(player => player.name !== name && player.name !== name2).sort(() => Math.random() - 0.5)[0];
}

function roleIsSoberAlive(role) {
    for (const player of alivePlayers()) {
        if (player.role.name === role && !isDrunk(player)) {
            return true;
        }
    }
    return false;
}

function getsFalseInfo(player) {
    if (!player.isGood || isDrunk(player) || player.role.name === "Spy") return true;

    if (storage.night > 1) {
        for (const player1 of alivePlayers()) {
            if (player1.role.name === "Monk" && !isDrunk(player1) && player.name === player1?.target?.name) {
                return false;
            }
        }
    }
    return roleIsSoberAlive("Vortox");
}

function getsTrueInfo(player) {
    return !getsFalseInfo(player);
}

function isGood(player) {
    if (player.role.name === "Spy" && !isDrunk(player)) return true;
    if (player.role.name === "Recluse" && !isDrunk(player)) return false;
    return player.isGood;
}

function getPlayerByRole(role) {
    for (const player of alivePlayers()) {
        if (player.role.name === role) {
            return player;
        }
    }
    return undefined;
}

function isDrunk(player) {
    return player?.drunkSources?.length > 0;
}

function updateDrunkness(player) {
    if (!player.drunkTarget) return;

    if (!isDrunk(player)) player.drunkTarget.drunkSources.push(player.role.name);
    else player.drunkTarget.drunkSources = player.drunkTarget.drunkSources.filter(role => role !== player.role.name);

    if (player.name === player.drunkTarget.name) return;
    updateDrunkness(player.drunkTarget);
}

export {getRandomPlayer, getRandomPlayerNotAs, alivePlayers, getAliveNeighbor, getRandomAlivePlayer, roleIsSoberAlive,
    getsFalseInfo, getsTrueInfo, isGood, getPlayerByRole, isDrunk, updateDrunkness};