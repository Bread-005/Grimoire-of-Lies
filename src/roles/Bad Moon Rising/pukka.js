import {addToChambermaidList} from "./chambermaid.js";
import {isMonkProtected} from "../Trouble Brewing/monk.js";
import {alivePlayers, isDrunk, updateDrunkness} from "../../shortcuts.js";
import {storage} from "../../../shortcuts.js";

async function pukkaPoisoning() {
    for (const pukka of alivePlayers()) {
        if (pukka.role.name !== "Pukka") continue;

        if (!pukka.isExorcistChosen) {
            addToChambermaidList(pukka, "Pukka");
        }

        if (isDrunk(pukka)) continue;

        pukka.killTarget = pukka.drunkTarget;
        if (!pukka.isExorcistChosen) {
            pukka.drunkTarget = alivePlayers().filter(p => p.isGood && !p.drunkSources.includes("Pukka")).sort(() => Math.random() - 0.5)[0] ||
                alivePlayers().filter(p => p.name !== pukka.name)[0];
        }
        if (pukka.isExorcistChosen) {
            delete pukka.isExorcistChosen;
        }

        if (isMonkProtected(pukka.drunkTarget, pukka)) delete pukka.drunkTarget;

        if (pukka.drunkTarget?.role.name === "Soldier" && !isDrunk(pukka.drunkTarget)) {
            delete pukka.drunkTarget;
        }

        if (pukka.drunkTarget) {
            updateDrunkness(pukka);
        }

        if (storage.night > 1 && pukka.killTarget) {
            dies(pukka.killTarget, "night", pukka);
            pukka.killTarget.drunkSources = pukka.killTarget.drunkSources.filter(role => role !== "Pukka");
            updateDrunkness(pukka.killTarget);
            delete pukka.killTarget;
        }
    }
}

export {pukkaPoisoning};