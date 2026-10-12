// Importation des fausses données
import jobs from "./assetes/js/data.js";

// Attendre que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  // 1. On cible le conteneur HTML où on va injecter les offres
  const jobsContainer = document.getElementById("latest-jobs-container");

  // Si le conteneur n'existe pas, on arrête le script pour éviter une erreur bloquante
  if (!jobsContainer) return;

  // 2. On sélectionne les 3 offres les plus récentes (ou intéressantes) pour le teasing
  // Ici on prend les 3 premières pour l'exemple
  const latestJobs = jobs.slice(0, 3);

  // 3. On crée la logique de rendu HTML avec la méthode .map()
  const renderJobs = () => {
    // On transforme chaque objet "job" en une chaîne de caractères HTML
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
                        <button class="text-sm text-blue-400 font-medium hover:text-blue-300">Détails &rarr;</button>
                    </div>
                </div>
            `;
      })
      .join(""); // .join('') retire les virgules entre les éléments du tableau généré par map()

    // 4. On injecte le tout dans le DOM
    jobsContainer.innerHTML = jobsHTML;
  };

  // On exécute la fonction
  renderJobs();
});
