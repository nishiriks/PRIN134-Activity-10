document.addEventListener("DOMContentLoaded", function () {
  const game = document.getElementById("game");


  const header = document.createElement("h1");
  header.textContent = "Basketball Mini Game";
  header.classList.add("text-center", "mt-4"); // Center the text and add margin-top

  // Append the header to the game container
  game.appendChild(header);

  const container = document.createElement("div");
  container.classList.add("container");
  game.appendChild(container);

  const row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  function createColumn(content, side) {
    const column = document.createElement("div");
    column.classList.add("col-md-6", "p-3");
    if (side === "left") column.classList.add("border-end");
    column.innerHTML = content;
    return column;
  }

  const leftColumn = createColumn("", "left");

  const header1 = document.createElement("h3");
  header1.textContent = "Enter Player Details";
  leftColumn.append(header1);

  const playControl = document.createElement("div");
  playControl.id = "play-control";
  playControl.classList.add("input-group");
  playControl.style.marginBottom = "20px";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.classList.add("form-control");
  nameInput.placeholder = "Enter player name";
  nameInput.id = "player-name";

  const addButton = document.createElement("button");
  addButton.classList.add("btn", "btn-primary");
  addButton.textContent = "ADD";

  playControl.append(nameInput, addButton);
  leftColumn.append(playControl);

  const header2 = document.createElement("h3");
  header2.textContent = "PLAYERS";
  leftColumn.append(header2);

  const playerList = document.createElement("ol");
  playerList.id = "basketball";
  playerList.style.marginTop = "20px";
  playerList.classList.add("list-group");
  leftColumn.append(playerList);

  const rightColumn = createColumn("", "right");

  // Result Container placed in the right column
  const resultContainer = document.createElement("div");
  resultContainer.id = "result-container";
  resultContainer.classList.add("mt-5");
  rightColumn.append(resultContainer);

  row.appendChild(leftColumn);
  row.appendChild(rightColumn);

  // Play Button
  const playButton = document.createElement("button");
  playButton.id = "play-button";
  playButton.classList.add("btn", "btn-success", "btn-lg", "w-25", "mt-3");
  playButton.textContent = "PLAY";
  
  const playButtonWrapper = document.createElement("div");
  playButtonWrapper.classList.add("text-center");
  playButtonWrapper.appendChild(playButton);

  game.append(playButtonWrapper);
  
  

  // Add Players
  addButton.addEventListener("click", function () {
    const playerName = nameInput.value.trim();
    if (playerName) {
      const playerItem = document.createElement("li");
      playerItem.classList.add("list-group-item", "d-flex", "justify-content-between");
      playerItem.dataset.name = playerName;

      const playerText = document.createElement("span");
      playerText.textContent = playerName;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-sm", "btn-danger", "ms-2");
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", function () {
        playerItem.remove();
      });

      playerItem.appendChild(playerText);
      playerItem.appendChild(deleteButton);
      playerList.appendChild(playerItem);
      nameInput.value = "";
    } else {
      alert("Player name is required!");
    }
  });

  // Game Logic
  playButton.addEventListener("click", function () {
    const listItems = playerList.querySelectorAll("li");

    if (listItems.length < 2) {
      alert("At least 2 players are required to play.");
      return;
    }

    const players = Array.from(listItems).map(li => ({
      name: li.dataset.name,
      score: 0
    }));

    resultContainer.innerHTML = ""; // Clear old results
    const attempts = 5;

    function playRound(roundPlayers) {
      roundPlayers.forEach(player => {
        player.score = 0;
        for (let i = 0; i < attempts; i++) {
          if (Math.random() < 0.5) {
            player.score++;
          }
        }
      });
    }
    
    function showResults(players, roundNum) {
      const sorted = [...players].sort((a, b) => b.score - a.score);
      const results = document.createElement("div");
      results.id = "results-id";
      results.classList.add("p-5", "rounded", "border");
      results.innerHTML = `<h4>🏀 ROUND ${roundNum}</h4>
        <ul>
          ${sorted.map(p => `<li>${p.name} - ${p.score} points</li>`).join('')}
        </ul>`;
      
      resultContainer.appendChild(results);
    }
    
    let round = 1;
    let currentPlayers = players;
    let winnerDeclared = false;

    while (!winnerDeclared) {
      playRound(currentPlayers);
      showResults(currentPlayers, round);

      const topScore = Math.max(...currentPlayers.map(p => p.score));
      const topPlayers = currentPlayers.filter(p => p.score === topScore);

      if (topPlayers.length === 1) {
        const winner = document.createElement("h4");
        winner.innerHTML = `🏆 Winner: <strong>${topPlayers[0].name}</strong> with <strong>${topPlayers[0].score}</strong> points!`;
        resultContainer.appendChild(winner);
        winner.style.paddingTop = "10px";
        winnerDeclared = true;
      } else {
        const tieNotice = document.createElement("p");
        tieNotice.innerHTML = `🔥 Tiebreaker between: ${topPlayers.map(p => p.name).join(", ")}`;
        tieNotice.style.paddingTop = "10px";
        resultContainer.appendChild(tieNotice);
        
        currentPlayers = topPlayers;
        round++;
      }
    }
  });
});