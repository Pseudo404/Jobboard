import jobs from "./asset/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  const allJobsContainer = document.getElementById("all-jobs-container");

  if (allJobsContainer) {
    const renderAllJobs = () => {
      const jobsHTML = jobs
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
                    <a href="job.html?id=${job.id}" class="text-sm bg-blue-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-500 transition shadow-sm">
                        Voir l'offre
                    </a>
                </div>
            </div>
          `;
        })
        .join("");

      allJobsContainer.innerHTML = jobsHTML;
    };

    renderAllJobs();
  }
});
