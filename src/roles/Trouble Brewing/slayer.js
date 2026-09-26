import {alivePlayers, isDrunk} from "../../shortcuts.js";
import {dies, players} from "../../../roleSelection.js";
import {createPopup} from "../../../shortcuts.js";

async function slayerShoot(seat1, seat2) {
    const shooter = alivePlayers().find(p => p.seat === seat1);
    const target = players.find(p => p.seat === seat2);

    if (shooter.bluff !== "Slayer") {
        createPopup(shooter.name + " does not claim to be Slayer!", {backgroundColor: "red", duration: 5000});
        return;
    }

    if (!shooter) {
        createPopup(shooter.name + " does not live or does not exist!", {backgroundColor: "red", duration: 5000});
        return;
    }
    if (!target) {
        createPopup(target.name + " does not exist!", {backgroundColor: "red", duration: 5000});
        return;
    }
    if (shooter.slayerHasShot) {
        createPopup(shooter.name + " has already used their Slayer shot!", {backgroundColor: "red", duration: 5000});
        return;
    }

    shooter.slayerHasShot = true;
    document.getElementById("player-info" + shooter.seat).style.visibility = "visible";
    if (shooter.role.name === "Slayer" && !isDrunk(shooter)) {
        if (target.role.characterType === "Demon" || target.role.name === "Recluse" && !isDrunk(target) && Math.random() < 0.3) {
            shooter.info = "I killed " + target.seat;
            document.getElementById("player-info" + shooter.seat).textContent = shooter.info;
            await dies(target, "day", shooter);
            return;
        }
    }
    shooter.info = "I tried to shoot " + target.seat;
    document.getElementById("player-info" + shooter.seat).textContent = shooter.info;
}

export {slayerShoot};
