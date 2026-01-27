document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("grimoire");

    const centerX = 300;
    const centerY = 300;
    const radius = 220;

    const playerCount = 12;

    for (let i = 0; i < playerCount; i++) {
        const offset = -Math.PI / 2;
        const angle = offset + (2 * Math.PI / playerCount) * i;

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const circle = document.createElement("div");
        circle.classList.add("player-circle");
        circle.style.left = x + "px";
        circle.style.top = y + "px";

        container.append(circle);
    }
});