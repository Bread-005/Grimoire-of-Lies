let popupZIndex = 1000;

function endGame(text = "", winningTeam = "") {
    createPopup("The Game ended", "35%");
    createPopup(text, "42%");
    createPopup("The " + winningTeam + " Team has won", "49%");
    localStorage.setItem("game-is-running", "false");
    setTimeout(() => window.location.reload(), 11000);
}

function createPopup(text, top = "20%", right = "50%", duration = 10000, backgroundColor = "lime") {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.style.top = top;
    popup.style.right = right;
    popup.style.backgroundColor = backgroundColor;
    popupZIndex++;
    popup.style.zIndex = popupZIndex.toString();
    const p = document.createElement("p");
    p.textContent = text;
    popup.append(p);
    document.getElementById("grimoire").append(popup);

    setTimeout(() => {
        document.getElementById("grimoire").removeChild(popup);
        popupZIndex--;
    }, duration);
}

export {endGame, createPopup};