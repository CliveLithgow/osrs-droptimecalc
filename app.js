document.getElementById("dropForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const bossName = document.getElementById("bossName").value.trim();
  const killsPerHour = parseFloat(document.getElementById("killsPerHour").value);
  const itemsInput = document.getElementById("items").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!bossName || isNaN(killsPerHour) || killsPerHour <= 0 || !itemsInput) {
    resultsDiv.innerHTML = "<p>Please enter valid inputs for all fields.</p>";
    return;
  }

  const lines = itemsInput.split("\n");
  let totalHours = 0;
  let output = `<h2>Results for ${bossName}</h2><ul>`;

  lines.forEach(line => {
    const [itemNameRaw, dropRateStrRaw] = line.split(",");
    if (!itemNameRaw || !dropRateStrRaw) return;

    const itemName = itemNameRaw.trim();
    const dropRateStr = dropRateStrRaw.trim();

    let killsPerDrop = NaN;

    if (dropRateStr.includes("/")) {
      const [num, denom] = dropRateStr.split("/").map(Number);
      if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
        killsPerDrop = denom / num;
      }
    } else {
      const parsed = parseFloat(dropRateStr);
      if (!isNaN(parsed) && parsed > 0) {
        killsPerDrop = parsed;
      }
    }

    if (isNaN(killsPerDrop) || killsPerDrop <= 0) return;

    const expectedKills = killsPerDrop;
    const expectedHours = expectedKills / killsPerHour;
    totalHours += expectedHours;

    output += `<li><strong>${itemName}</strong>: ~${expectedKills.toFixed(1)} kills (~${expectedHours.toFixed(2)} hours)</li>`;
  });

  output += `</ul><p><strong>Total Estimated Time to Get All Drops:</strong> ~${(totalHours * 1).toFixed(2)} hours</p>`;
  resultsDiv.innerHTML = output;
});

