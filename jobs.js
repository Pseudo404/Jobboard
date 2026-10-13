import jobs from "./asset/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  const allJobsContainer = document.getElementById("all-jobs-container");
  const searchInput = document.getElementById("search-input");

  if (allJobsContainer) {
    const renderJobsList = (jobsToRender) => {
      if (jobsToRender.length === 0) {
        allJobsContainer.innerHTML = `<div class="col-span-full text-center py-12"><p class="text-gray-500 text-lg font-medium">Aucune offre ne correspond à votre recherche.</p></div>`;
        return;
      }

      const jobsHTML = jobsToRender
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
      allJobsContainer.innerHTML = jobsHTML;
    };

    renderJobsList(jobs);

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filteredJobs = jobs.filter((job) => {
          return (
            job.titre.toLowerCase().includes(query) ||
            job.entreprise.toLowerCase().includes(query) ||
            job.lieu.toLowerCase().includes(query) ||
            job.secteur.toLowerCase().includes(query)
          );
        });
        renderJobsList(filteredJobs);
      });
    }
  }
});
