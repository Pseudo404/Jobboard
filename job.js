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

  // 1. Injection des données de l'offre
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

  // 2. Dictionnaire Dynamique Enrichi (Sources : TomTom Traffic Index / Urbanisme)
  const cityData = {
    Orléans: {
      rentPerM2: 12,
      transport: 52,
      food: 250,
      trafficHours: 55,
      greenSpace: 45,
    },
    Tours: {
      rentPerM2: 13,
      transport: 42,
      food: 250,
      trafficHours: 74,
      greenSpace: 40,
    },
    Blois: {
      rentPerM2: 10,
      transport: 15,
      food: 230,
      trafficHours: 30,
      greenSpace: 50,
    },
    Chartres: {
      rentPerM2: 14,
      transport: 40,
      food: 260,
      trafficHours: 42,
      greenSpace: 40,
    },
    Bourges: {
      rentPerM2: 10,
      transport: 30,
      food: 220,
      trafficHours: 35,
      greenSpace: 50,
    },
    Châteauroux: {
      rentPerM2: 9,
      transport: 15,
      food: 210,
      trafficHours: 25,
      greenSpace: 45,
    },
    Saran: {
      rentPerM2: 11,
      transport: 52,
      food: 250,
      trafficHours: 55,
      greenSpace: 45,
    }, // Saran = Banlieue Orléans
    default: {
      rentPerM2: 11,
      transport: 30,
      food: 240,
      trafficHours: 45,
      greenSpace: 45,
    },
  };

  const cityName = job.lieu.split(" ")[0].trim();
  const localCosts = cityData[cityName] || cityData["default"];

  // Paris de référence
  const parisTrafficHours = 101;

  // 3. Parseur de salaire verrouillé sur le plancher (fourchette basse)
  const parseSalaireToAnnual = (salaireStr) => {
    if (!salaireStr || salaireStr.toLowerCase().includes("selon âge"))
      return 21203; // Base SMIC

    const cleanStr = salaireStr
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/,/g, ".");
    const numbers = cleanStr.match(/\d+(\.\d+)?/g);

    if (!numbers) return 0;
    const baseValue = numbers.map(Number)[0]; // On sécurise en prenant que le minimum

    if (cleanStr.includes("mois")) return baseValue * 12;
    if (cleanStr.includes("heure")) return baseValue * 35 * 52;

    return baseValue;
  };

  // 4. Exécution du calcul
  const runComparison = () => {
    // Salaire
    const annualSalaryLocal = parseSalaireToAnnual(job.salaire);
    const netMonthlyLocal = (annualSalaryLocal * 0.75) / 12;
    const annualSalaryParis = annualSalaryLocal * 1.15; // Le fameux Paris +15%
    const netMonthlyParis = (annualSalaryParis * 0.75) / 12;

    // Charges
    const localRentTotal = localCosts.rentPerM2 * 40;
    const chargesLocal =
      localRentTotal + localCosts.transport + localCosts.food;
    const chargesParis = 1040 + 91 + 350;

    const formatCurrency = (num) =>
      Math.round(num).toLocaleString("fr-FR") + " €";

    // MAJ Financière
    document.getElementById("local-city-title").textContent = cityName;
    document.getElementById("local-rent-m2").textContent = localCosts.rentPerM2;
    document.getElementById("local-rent-cost").textContent =
      "- " + formatCurrency(localRentTotal);
    document.getElementById("local-transport-cost").textContent =
      "- " + formatCurrency(localCosts.transport);
    document.getElementById("local-food-cost").textContent =
      "- " + formatCurrency(localCosts.food);
    document.getElementById("local-net").textContent =
      formatCurrency(netMonthlyLocal);
    document.getElementById("paris-net").textContent =
      formatCurrency(netMonthlyParis);
    document.getElementById("local-reste").textContent = formatCurrency(
      netMonthlyLocal - chargesLocal,
    );
    document.getElementById("paris-reste").textContent = formatCurrency(
      netMonthlyParis - chargesParis,
    );

    // MAJ Qualité de vie dynamique
    const spaceGainEl = document.getElementById("local-space-gain");
    if (spaceGainEl)
      spaceGainEl.textContent = `~${Math.round(1040 / localCosts.rentPerM2)}m²`;

    const trafficEl = document.getElementById("local-traffic");
    const timeGainEl = document.getElementById("local-time-gain");
    if (trafficEl && timeGainEl) {
      trafficEl.textContent = `${localCosts.trafficHours}h`;
      const hoursSaved = parisTrafficHours - localCosts.trafficHours;
      timeGainEl.textContent = `+ ${hoursSaved} heures`;
    }

    const greenSpaceEl = document.getElementById("local-green-space");
    if (greenSpaceEl) {
      greenSpaceEl.textContent = `${localCosts.greenSpace} m²`;
    }
  };

  runComparison();
});
