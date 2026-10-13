import jobs from "./asset/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  const jobsContainer = document.getElementById("latest-jobs-container");

  if (jobsContainer) {
    let filteredJobs = jobs.filter((job) => job.secteur === "Informatique");
    if (filteredJobs.length === 0) filteredJobs = jobs;
    const latestJobs = filteredJobs.slice(0, 3);

    const renderJobs = () => {
      const jobsHTML = latestJobs
        .map((job) => {
          return `
            <div class="rounded-xl bg-white p-6 border border-cvl-blue/10 hover:border-cvl-blue transition duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-4">
                        <span class="inline-flex items-center rounded-md bg-cvl-pale px-2 py-1 text-xs font-bold text-cvl-blue ring-1 ring-inset ring-cvl-blue/20">
                            ${job.contrat}
                        </span>
                        <span class="text-xs text-gray-400">${job.datePublication}</span>
                    </div>
                    <h3 class="text-xl font-bold text-cvl-dark mb-1">${job.titre}</h3>
                    <p class="text-cvl-blue text-sm font-bold mb-4">${job.entreprise} - ${job.lieu}</p>
                    <p class="text-gray-600 text-sm mb-6 line-clamp-2">${job.description}</p>
                </div>
                <div class="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                    <span class="text-sm font-bold text-cvl-dark">${job.salaire}</span>
                    <a href="job.html?id=${job.id}" class="text-sm bg-white border border-cvl-blue/30 px-4 py-2 rounded-lg text-cvl-blue font-bold hover:bg-cvl-blue hover:text-white transition shadow-sm">
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

  const salaryInput = document.getElementById("salaryInput");
  if (salaryInput) {
    const chargesParis = 1040 + 91;
    const chargesOrleans = 480 + 52;
    const calculateResteAVivre = () => {
      const salaireBrutAnnuel = Number(salaryInput.value) || 0;
      const salaireNetMensuel = (salaireBrutAnnuel * 0.75) / 12;
      const salaireNetMensuelParis = (salaireBrutAnnuel * 0.75 * 1.15) / 12;
      const formatCurrency = (num) =>
        Math.round(num).toLocaleString("fr-FR") + " €";
      if (document.getElementById("paris-net"))
        document.getElementById("paris-net").textContent = formatCurrency(
          salaireNetMensuelParis,
        );
      if (document.getElementById("orleans-net"))
        document.getElementById("orleans-net").textContent =
          formatCurrency(salaireNetMensuel);
      if (document.getElementById("paris-reste"))
        document.getElementById("paris-reste").textContent = formatCurrency(
          salaireNetMensuelParis - chargesParis,
        );
      if (document.getElementById("orleans-reste"))
        document.getElementById("orleans-reste").textContent = formatCurrency(
          salaireNetMensuel - chargesOrleans,
        );
    };
    salaryInput.addEventListener("input", calculateResteAVivre);
    calculateResteAVivre();
  }
});
