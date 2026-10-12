import jobs from "./asset/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const jobId = parseInt(params.get("id"));
  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    document.getElementById("main-content").innerHTML = `
            <div class="text-center py-20">
                <h1 class="text-3xl font-bold text-white mb-4">Offre introuvable</h1>
                <a href="index.html" class="text-blue-400 hover:underline">Retour à l'accueil</a>
            </div>`;
    return;
  }

  // 1. Injection des données basiques
  document.getElementById("job-title").textContent = job.titre;
  document.getElementById("job-company-location").textContent =
    `${job.entreprise} — ${job.lieu}`;
  document.getElementById("job-description").textContent = job.description;
  document.getElementById("job-salary").textContent = job.salaire;
  document.getElementById("job-contract").textContent = job.contrat;
  document.getElementById("job-remote").textContent = job.teletravail;
  document.getElementById("job-exp").textContent = job.experience;

  const evolutionElement = document.getElementById("job-evolution");
  if (evolutionElement) {
    evolutionElement.textContent =
      job.evolution ||
      "Évolution à définir avec le manager lors des entretiens.";
  }

  document.getElementById("job-tags").innerHTML = `
        <span class="inline-flex items-center rounded-md bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">${job.secteur}</span>
        <span class="inline-flex items-center rounded-md bg-gray-400/10 px-3 py-1 text-sm font-medium text-gray-400 ring-1 ring-inset ring-gray-400/30">Publié le ${job.datePublication}</span>
    `;

  // 2. Dictionnaire des coûts par ville (Hackathon Mockup)
  const cityData = {
    Orléans: { rentPerM2: 12, transport: 52, food: 250 },
    Tours: { rentPerM2: 13, transport: 42, food: 250 },
    Blois: { rentPerM2: 10, transport: 15, food: 230 },
    Chartres: { rentPerM2: 14, transport: 40, food: 260 },
    Bourges: { rentPerM2: 10, transport: 30, food: 220 },
    Châteauroux: { rentPerM2: 9, transport: 15, food: 210 },
    Saran: { rentPerM2: 11, transport: 52, food: 250 },
    default: { rentPerM2: 11, transport: 30, food: 240 }, // Valeur moyenne Région Centre
  };

  // 3. Parser le nom de la ville depuis "Ville (XX)"
  // Ex: "Blois (41)" -> "Blois". On prend le premier mot.
  const cityName = job.lieu.split(" ")[0].trim();
  const localCosts = cityData[cityName] || cityData["default"];

  // 4. Logique du Comparateur
  const parseSalaireToAnnual = (salaireStr) => {
    if (!salaireStr || salaireStr.toLowerCase().includes("selon âge"))
      return 21203;
    const cleanStr = salaireStr
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/,/g, ".");
    const numbers = cleanStr.match(/\d+(\.\d+)?/g);
    if (!numbers) return 0;

    const parsedNumbers = numbers.map(Number);
    const baseValue =
      parsedNumbers.length >= 2
        ? (parsedNumbers[0] + parsedNumbers[1]) / 2
        : parsedNumbers[0];

    if (cleanStr.includes("mois")) return baseValue * 12;
    if (cleanStr.includes("heure")) return baseValue * 35 * 52;
    return baseValue;
  };

  const runComparison = () => {
    // Salaire Local
    const annualSalaryLocal = parseSalaireToAnnual(job.salaire);
    const netMonthlyLocal = (annualSalaryLocal * 0.75) / 12;

    // Salaire Parisien (+15%)
    const annualSalaryParis = annualSalaryLocal * 1.15;
    const netMonthlyParis = (annualSalaryParis * 0.75) / 12;

    // Calcul des charges totales
    const localRentTotal = localCosts.rentPerM2 * 40; // Pour un 40m2
    const chargesLocal =
      localRentTotal + localCosts.transport + localCosts.food;

    const chargesParis = 1040 + 91 + 350; // Fixe Paris : Loyer 26€/m2 + Navigo + Food

    const formatCurrency = (num) =>
      Math.round(num).toLocaleString("fr-FR") + " €";

    // MAJ UI - Titres et Labels locaux
    document.getElementById("local-city-title").textContent = cityName;
    document.getElementById("local-rent-m2").textContent = localCosts.rentPerM2;

    // MAJ UI - Dépenses locales
    document.getElementById("local-rent-cost").textContent =
      "- " + formatCurrency(localRentTotal);
    document.getElementById("local-transport-cost").textContent =
      "- " + formatCurrency(localCosts.transport);
    document.getElementById("local-food-cost").textContent =
      "- " + formatCurrency(localCosts.food);

    // MAJ UI - Salaires Nets
    document.getElementById("local-net").textContent =
      formatCurrency(netMonthlyLocal);
    document.getElementById("paris-net").textContent =
      formatCurrency(netMonthlyParis);

    // MAJ UI - Reste à vivre
    document.getElementById("local-reste").textContent = formatCurrency(
      netMonthlyLocal - chargesLocal,
    );
    document.getElementById("paris-reste").textContent = formatCurrency(
      netMonthlyParis - chargesParis,
    );

    // Calcul du gain d'espace (Bonus visuel)
    // Combien de m2 je peux louer en région avec le prix d'un loyer de 40m2 à Paris (1040€) ?
    const possibleM2 = Math.round(1040 / localCosts.rentPerM2);
    document.getElementById("local-space-gain").textContent =
      `~${possibleM2}m²`;
  };

  runComparison();
});
