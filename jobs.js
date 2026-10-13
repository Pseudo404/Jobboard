import jobs from "./asset/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  const allJobsContainer = document.getElementById("all-jobs-container");
  const searchInput = document.getElementById("search-input");

  if (allJobsContainer) {
    // Fonction qui rend les offres en fonction du tableau fourni
    const renderJobsList = (jobsToRender) => {
      // Cas où la recherche ne donne rien
      if (jobsToRender.length === 0) {
        allJobsContainer.innerHTML = `
          <div class="col-span-full text-center py-12">
            <p class="text-gray-400 text-lg">Aucune offre ne correspond à votre recherche.</p>
          </div>
        `;
        return;
      }

      // Génération du HTML pour les offres trouvées
      const jobsHTML = jobsToRender
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

    // 1. Rendu initial avec toutes les offres
    renderJobsList(jobs);

    // 2. Écouteur d'événement sur la barre de recherche
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        // On récupère la valeur tapée, mise en minuscules
        const query = e.target.value.toLowerCase().trim();

        // On filtre le tableau complet 'jobs'
        const filteredJobs = jobs.filter((job) => {
          return (
            job.titre.toLowerCase().includes(query) ||
            job.entreprise.toLowerCase().includes(query) ||
            job.lieu.toLowerCase().includes(query) ||
            job.secteur.toLowerCase().includes(query)
          );
        });

        // On redessine l'interface avec le résultat filtré
        renderJobsList(filteredJobs);
      });
    }
  }
});
