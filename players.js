const game = document.getElementById("game");

const container = document.createElement("div");
container.id = "main";
container.classList.add("container");
game.append(container);

const header = document.createElement("h3");
header.textContent = "Enter Player Details";
container.append(header);

const playControl = document.createElement("div");
playControl.id = "play-control";
playControl.classList.add("input-group");

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.classList.add("form-control");
nameInput.placeholder = "Enter player name";
nameInput.id = "player-name";

const teamInput = document.createElement("input");
teamInput.type = "text";
teamInput.classList.add("form-control");
teamInput.placeholder = "Enter team name";
teamInput.id = "team-name";

const addButton = document.createElement("button");
addButton.classList.add("btn", "btn-primary");
addButton.textContent = "Add Player";


playControl.append(nameInput, teamInput, addButton);
container.append(playControl);


const playerList = document.createElement("ol");
playerList.id = "basketball";
playerList.classList.add("list-group", "player-list");
container.append(playerList);

const playButton = document.createElement("button");
playButton.id = "play-button";
playButton.classList.add("btn", "btn-success");
playButton.textContent = "Play Game";

game.append(playButton);

const gameInfo = document.createElement("div");
gameInfo.id = "game-info";
game.append(gameInfo);

const roundsContainer = document.createElement("div");
roundsContainer.id = "rounds";
gameInfo.append(roundsContainer);

addButton.addEventListener("click", function() {
    const playerName = nameInput.value.trim();
    const teamName = teamInput.value.trim();

    if (playerName && teamName) {
        const playerItem = document.createElement("li");
        playerItem.classList.add("list-group-item");
        playerItem.textContent = `${playerName} (${teamName})`;
        playerList.appendChild(playerItem);

        nameInput.value = "";
        teamInput.value = "";
    } else {
        alert("Both player name and team are required!");
    }
});

function playRound(players, roundType = "Round") {
    const roundResults = [];
    players.forEach(player => {
        const successfulShots = Math.floor(Math.random() * 6); 
        player.score += successfulShots;
        roundResults.push(`${player.name} scored ${successfulShots} successful shots.`);
    });

    players.sort((a, b) => b.score - a.score);
    const rankingResults = players.map((player, index) => `${index + 1}. ${player.name} - ${player.score} points`).join("\n");

    return { roundResults, rankingResults };
}

function tieBreaker(players) {
    let tiedPlayers = players.filter(player => player.score === players[0].score);

    if (tiedPlayers.length > 1) {
        const tiebreakerResults = [];
        while (tiedPlayers.length > 1) {
            tiebreakerResults.push("🔥 Tiebreaker needed between: " + tiedPlayers.map(player => player.name).join(", "));
            tiedPlayers = playRound(tiedPlayers, "Tiebreaker Round").roundResults;
            tiedPlayers = tiedPlayers.filter(player => player.score === tiedPlayers[0].score);
        }
        return { tiebreakerResults, winner: tiedPlayers[0] };
    }
    return { tiebreakerResults: [], winner: tiedPlayers[0] };
}

playButton.addEventListener("click", function() {
    const players = [];
    const listItems = playerList.getElementsByTagName("li");

    for (let i = 0; i < listItems.length; i++) {
        const playerText = listItems[i].textContent.split(" (");
        const name = playerText[0];
        const team = playerText[1].replace(")", "");
        players.push({ name, team, score: 0 });
    }

    const roundResult = playRound(players, `Round 1`);
    roundsContainer.innerHTML = `
        <pre>🏀 ${roundResult.roundResults.join("\n")}</pre>
        <pre>🏆 Rankings after Round 1:\n${roundResult.rankingResults}</pre>
    `;

    const { tiebreakerResults, winner } = tieBreaker(players);
    if (tiebreakerResults.length > 0) {
        roundsContainer.innerHTML += `<pre>${tiebreakerResults.join("\n")}</pre>`;
    }


    roundsContainer.innerHTML += `
        <pre>🏆 The champion is ${winner.name} with ${winner.score} points!</pre>
    `;


    playButton.disabled = true;
    playButton.textContent = "Game In Progress...";
});