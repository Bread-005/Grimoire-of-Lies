document.addEventListener("DOMContentLoaded", () => {
    const playerCountInput = document.getElementById("player-count-input");

    createGrimoire();

    if (!localStorage.getItem("player-count")) {
        localStorage.setItem("player-count", "8");
    }
    playerCountInput.value = localStorage.getItem("player-count");

    playerCountInput.addEventListener("input", () => {
        if (playerCountInput.value > 12) {
            playerCountInput.value = 12;
        }
        localStorage.setItem("player-count", playerCountInput.value);
        createGrimoire();
    });


    function createGrimoire() {
        const grimoire = document.getElementById("grimoire");
        grimoire.innerHTML = "";

        const centerX = 300;
        const centerY = 300;
        const radius = 220;

        const playerCount = Number(localStorage.getItem("player-count"));

        for (let i = 0; i < playerCount; i++) {
            const offset = -Math.PI / 2;
            const angle = offset + (2 * Math.PI / playerCount) * i;

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const circle = document.createElement("div");
            circle.classList.add("player-circle");
            circle.style.left = x + "px";
            circle.style.top = y + "px";

            grimoire.append(circle);
        }
    }
});