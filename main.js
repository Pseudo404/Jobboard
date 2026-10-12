import jobs from "./asset/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // LOGIQUE MÉTIER : LE JOBBOARD (Teasing Accueil)
  // ==========================================
  const jobsContainer = document.getElementById("latest-jobs-container");

  if (jobsContainer) {
    let filteredJobs = jobs.filter((job) => job.secteur === "Informatique");
    if (filteredJobs.length === 0) filteredJobs = jobs;
    const latestJobs = filteredJobs.slice(0, 3);

    const renderJobs = () => {
      const jobsHTML = latestJobs
        .map((job) => {
          return `
            <div class="rounded-xl bg-slate-800 p-6 border border-slate-700 hover:border-blue-500 transition shadow-lg flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-4">
                        <span class="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                            ${job.contrat}
                        </span>
                        <span class="text-xs text-gray-400">${job.datePublication}</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-1">${job.titre}</h3>
                    <p class="text-blue-400 text-sm font-medium mb-4">${job.entreprise} - ${job.lieu}</p>
                    <p class="text-gray-400 text-sm mb-6 line-clamp-2">${job.description}</p>
                </div>
                
                <div class="border-t border-slate-700 pt-4 flex justify-between items-center mt-auto">
                    <span class="text-sm font-semibold text-white">${job.salaire}</span>
                    <!-- Lien vers la nouvelle page dédiée en passant l'ID dans l'URL -->
                    <a href="job.html?id=${job.id}" class="text-sm bg-blue-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-500 transition shadow-sm">
                        Voir l'offre
                    </a>
                </div>
            </div>
          `;
        })
        .join("");

      jobsContainer.innerHTML = jobsHTML;
    };
    renderJobs();
  }

  // ==========================================
  // LOGIQUE MÉTIER : LE SIMULATEUR LIBRE (Accueil)
  // ==========================================
  const salaryInput = document.getElementById("salaryInput");
  const parisNetDisplay = document.getElementById("paris-net");
  const parisResteDisplay = document.getElementById("paris-reste");
  const orleansNetDisplay = document.getElementById("orleans-net");
  const orleansResteDisplay = document.getElementById("orleans-reste");

  if (salaryInput) {
    const chargesParis = 1040 + 91;
    const chargesOrleans = 480 + 52;

    const calculateResteAVivre = () => {
      const salaireBrutAnnuel = Number(salaryInput.value) || 0;
      const salaireNetMensuel = (salaireBrutAnnuel * 0.75) / 12;
      const formatCurrency = (num) =>
        Math.round(num).toLocaleString("fr-FR") + " €";

      if (parisNetDisplay)
        parisNetDisplay.textContent = formatCurrency(salaireNetMensuel);
      if (orleansNetDisplay)
        orleansNetDisplay.textContent = formatCurrency(salaireNetMensuel);
      if (parisResteDisplay)
        parisResteDisplay.textContent = formatCurrency(
          salaireNetMensuel - chargesParis,
        );
      if (orleansResteDisplay)
        orleansResteDisplay.textContent = formatCurrency(
          salaireNetMensuel - chargesOrleans,
        );
    };

    salaryInput.addEventListener("input", calculateResteAVivre);
    calculateResteAVivre();
  }
});
