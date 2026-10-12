// On s'assure d'avoir le même chemin que dans main.js
import jobs from "./asset/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Récupérer l'ID de l'offre dans l'URL (ex: job.html?id=2)
  const params = new URLSearchParams(window.location.search);
  const jobId = parseInt(params.get("id"));

  // 2. Trouver l'offre correspondante dans le tableau
  const job = jobs.find((j) => j.id === jobId);

  // Sécurité si l'offre n'existe pas ou si l'ID est invalide
  if (!job) {
    document.getElementById("main-content").innerHTML = `
            <div class="text-center py-20">
                <h1 class="text-3xl font-bold text-white mb-4">Offre introuvable</h1>
                <a href="index.html" class="text-blue-400 hover:underline">Retour à l'accueil</a>
            </div>`;
    return;
  }

  // 3. Injecter les données dans la partie "Détails"
  document.getElementById("job-title").textContent = job.titre;
  document.getElementById("job-company-location").textContent =
    `${job.entreprise} — ${job.lieu}`;
  document.getElementById("job-description").textContent = job.description;
  document.getElementById("job-salary").textContent = job.salaire;
  document.getElementById("job-contract").textContent = job.contrat;
  document.getElementById("job-remote").textContent = job.teletravail;
  document.getElementById("job-exp").textContent = job.experience;

  const tagsHTML = `
        <span class="inline-flex items-center rounded-md bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">${job.secteur}</span>
        <span class="inline-flex items-center rounded-md bg-gray-400/10 px-3 py-1 text-sm font-medium text-gray-400 ring-1 ring-inset ring-gray-400/30">Publié le ${job.datePublication}</span>
    `;
  document.getElementById("job-tags").innerHTML = tagsHTML;

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
    const annualSalary = parseSalaireToAnnual(job.salaire);
    const netMonthly = (annualSalary * 0.75) / 12;

    const chargesParis = 1040 + 91;
    const chargesOrleans = 480 + 52;

    const formatCurrency = (num) =>
      Math.round(num).toLocaleString("fr-FR") + " €";

    // Affichage des salaires nets
    document.getElementById("orleans-net").textContent =
      formatCurrency(netMonthly);
    document.getElementById("paris-net").textContent =
      formatCurrency(netMonthly);

    // Affichage du Reste à vivre
    document.getElementById("orleans-reste").textContent = formatCurrency(
      netMonthly - chargesOrleans,
    );
    document.getElementById("paris-reste").textContent = formatCurrency(
      netMonthly - chargesParis,
    );
  };

  runComparison();
});
