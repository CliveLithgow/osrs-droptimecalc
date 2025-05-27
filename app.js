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
  let totalExpectedKills = 0;
  let output = `<h2>Results for ${bossName}</h2><ul>`;

  lines.forEach(line => {
    const [itemName, dropRateStr] = line.split(",");
    if (!itemName || !dropRateStr) return;

    const dropRateParts = dropRateStr.split("/");
    const numerator = parseFloat(dropRateParts[0]);
    const denominator = parseFloat(dropRateParts[1]);

    let dropRate = denominator;
    if (!isNaN(numerator) && !isNaN(denominator)) {
      dropRate = denominator / numerator;
    } else if (!isNaN(parseFloat(dropRateStr))) {
      dropRate = parseFloat(dropRateStr);
    }

    const expectedKills = dropRate;
    const expectedHours = expectedKills / killsPerHour;
    totalExpectedKills += expectedKills;

    output += `<li><strong>${itemName.trim()}</strong>: 
      ~${expectedKills.toFixed(1)} kills 
      (~${expectedHours.toFixed(2)} hours)</li>`;
  });

  const totalHours = totalExpectedKills / killsPerHour;
  output += `</ul><p><strong>Total Estimated Time:</strong> ~${totalExpectedKills.toFixed(1)} kills (~${totalHours.toFixed(2)} hours)</p>`;

  resultsDiv.innerHTML = output;
});
