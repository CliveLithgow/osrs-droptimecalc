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
  const dropRates = []; // store drop rates as probabilities
  let output = `<h2>Results for ${bossName}</h2><ul>`;

  lines.forEach(line => {
    const [itemNameRaw, dropRateStrRaw] = line.split(",");
    if (!itemNameRaw || !dropRateStrRaw) return;

    const itemName = itemNameRaw.trim();
    const dropRateStr = dropRateStrRaw.trim();

    let dropRate = NaN;

    if (dropRateStr.includes("/")) {
      const [num, denom] = dropRateStr.split("/").map(Number);
      if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
        dropRate = num / denom;
      }
    } else {
      const parsed = parseFloat(dropRateStr);
      if (!isNaN(parsed) && parsed > 0) {
        dropRate = 1 / parsed;
      }
    }

    if (isNaN(dropRate) || dropRate <= 0 || dropRate >= 1) return;

    dropRates.push(dropRate);

    output += `<li><strong>${itemName}</strong>: 1 in ${(1 / dropRate).toFixed(1)} chance per kill</li>`;
  });

  output += "</ul>";

  if (dropRates.length === 0) {
    resultsDiv.innerHTML = "<p>Please enter valid item drop rates.</p>";
    return;
  }

  // ✅ CALCULATE expected kills using generalized coupon collector logic
  // Reference: https://math.stackexchange.com/questions/104113
  let expectedKills = 0;
  let remaining = dropRates.length;

  // Use harmonic-like approximation
  const used = new Set();

  while (remaining > 0) {
    let sum = 0;
    dropRates.forEach((p, i) => {
      if (!used.has(i)) {
        sum += p;
      }
    });

    if (sum === 0) break;

    expectedKills += 1 / sum;

    // Simulate that one new item was obtained on average
    let bestProb = 0;
    let bestIndex = -1;

    dropRates.forEach((p, i) => {
      if (!used.has(i) && p > bestProb) {
        bestProb = p;
        bestIndex = i;
      }
    });

    used.add(bestIndex);
    remaining--;
  }

  const expectedHours = expectedKills / killsPerHour;

  // ✅ Probability of finishing all drops in E[X] ki
