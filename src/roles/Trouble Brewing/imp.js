import {alivePlayers, isDrunk} from "../../shortcuts.js";

function assignNewImp(oldImp) {
    if (oldImp.role.name !== "Imp") return;
    let candidates = alivePlayers().filter(p => p.role.characterType === "Minion");
    if (candidates.length === 0) return;

    const scarletWoman = candidates.find(p => p.role.name === "Scarlet Woman" && !isDrunk(p));
    const newImp = scarletWoman || candidates.sort(() => Math.random() - 0.5)[0];

    if (newImp) {
        newImp.startingRole = newImp.role.name;
        newImp.role.name = "Imp";
        newImp.role.characterType = "Demon";
        if (newImp.seat > oldImp.seat) {
            newImp.wasStarPassedTo = true;
        }
    }
}

export {assignNewImp};