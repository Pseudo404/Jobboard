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

  // Injecter les données de l'offre
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

  // Calcul du comparateur
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

    // Nouvelles charges incluant l'alimentaire
    const chargesParis = 1040 + 91 + 350; // Loyer + Navigo + Courses
    const chargesOrleans = 480 + 52 + 250; // Loyer + TAO + Courses

    const formatCurrency = (num) =>
      Math.round(num).toLocaleString("fr-FR") + " €";

    document.getElementById("orleans-net").textContent =
      formatCurrency(netMonthly);
    document.getElementById("paris-net").textContent =
      formatCurrency(netMonthly);

    document.getElementById("orleans-reste").textContent = formatCurrency(
      netMonthly - chargesOrleans,
    );
    document.getElementById("paris-reste").textContent = formatCurrency(
      netMonthly - chargesParis,
    );
  };

  runComparison();
});
