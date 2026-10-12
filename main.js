// Importation des fausses données
import jobs from "./assetes/js/data.js";

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // ÉLÉMENTS DU DOM
  // ==========================================
  const jobsContainer = document.getElementById("latest-jobs-container");
  const salaryInput = document.getElementById("salaryInput");
  const parisNetDisplay = document.getElementById("paris-net");
  const parisResteDisplay = document.getElementById("paris-reste");
  const orleansNetDisplay = document.getElementById("orleans-net");
  const orleansResteDisplay = document.getElementById("orleans-reste");
  const simulateurSection = document.getElementById("simulateur");

  // ==========================================
  // LOGIQUE MÉTIER : LE PARSEUR DE SALAIRE
  // ==========================================
  const parseSalaireToAnnual = (salaireStr) => {
    // Cas particulier : Alternance / Selon âge
    if (!salaireStr || salaireStr.toLowerCase().includes("selon âge")) {
      return 21203; // Valeur du SMIC annuel brut approximatif
    }

    // Nettoyage : minuscules, pas d'espaces, virgule devient point
    const cleanStr = salaireStr
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/,/g, ".");

    // Extraction des nombres via Regex
    const numbers = cleanStr.match(/\d+(\.\d+)?/g);
    if (!numbers) return 0;

    // Conversion en vrai type Number
    const parsedNumbers = numbers.map(Number);
    let baseValue = 0;

    // Moyenne si c'est une fourchette (ex: 32000 - 38000)
    if (parsedNumbers.length >= 2) {
      baseValue = (parsedNumbers[0] + parsedNumbers[1]) / 2;
    } else {
      baseValue = parsedNumbers[0];
    }

    // Application des multiplicateurs selon la période
    if (cleanStr.includes("mois")) {
      return baseValue * 12;
    } else if (cleanStr.includes("heure")) {
      return baseValue * 35 * 52; // 35h par semaine sur 52 semaines
    } else {
      return baseValue; // C'est déjà "par an" par défaut
    }
  };

  // ==========================================
  // LOGIQUE MÉTIER : LE SIMULATEUR
  // ==========================================
  const chargesParis = 1040 + 91;
  const chargesOrleans = 480 + 52;

  const calculateResteAVivre = () => {
    if (!salaryInput) return;

    const salaireBrutAnnuel = Number(salaryInput.value) || 0;
    const salaireNetMensuel = (salaireBrutAnnuel * 0.75) / 12;

    const resteParis = salaireNetMensuel - chargesParis;
    const resteOrleans = salaireNetMensuel - chargesOrleans;

    const formatCurrency = (num) =>
      Math.round(num).toLocaleString("fr-FR") + " €";

    if (parisNetDisplay)
      parisNetDisplay.textContent = formatCurrency(salaireNetMensuel);
    if (orleansNetDisplay)
      orleansNetDisplay.textContent = formatCurrency(salaireNetMensuel);
    if (parisResteDisplay)
      parisResteDisplay.textContent = formatCurrency(resteParis);
    if (orleansResteDisplay)
      orleansResteDisplay.textContent = formatCurrency(resteOrleans);
  };

  // Écouteur en temps réel si l'utilisateur tape à la main
  if (salaryInput) {
    salaryInput.addEventListener("input", calculateResteAVivre);
    calculateResteAVivre(); // Calcul initial
  }

  // ==========================================
  // LOGIQUE MÉTIER : LE JOBBOARD ET LA CONNEXION
  // ==========================================
  if (jobsContainer) {
    // Sélectionne les offres "Informatique" d'abord, sinon on prend les premières
    let filteredJobs = jobs.filter((job) => job.secteur === "Informatique");
    if (filteredJobs.length === 0) filteredJobs = jobs; // Fallback de sécurité

    const latestJobs = filteredJobs.slice(0, 3);

    const renderJobs = () => {
      const jobsHTML = latestJobs
        .map((job, index) => {
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
                            <!-- Le bouton magique avec l'attribut data-raw-salaire -->
                            <button 
                                class="btn-simuler text-sm bg-blue-600 px-3 py-1.5 rounded-lg text-white font-medium hover:bg-blue-500 transition shadow-sm"
                                data-raw-salaire="${job.salaire}">
                                Comparer
                            </button>
                        </div>
                    </div>
                `;
        })
        .join("");

      jobsContainer.innerHTML = jobsHTML;
      attachSimulateEvents(); // On attache les écouteurs APRÈS avoir injecté le HTML
    };

    // Fonction pour relier les clics des boutons au simulateur
    const attachSimulateEvents = () => {
      const buttons = document.querySelectorAll(".btn-simuler");
      buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          // 1. On récupère la phrase de salaire brute cachée dans le bouton
          const rawSalaire = e.target.getAttribute("data-raw-salaire");

          // 2. On la passe dans notre nettoyeur magique
          const annualSalaire = parseSalaireToAnnual(rawSalaire);

          // 3. On met à jour l'input du simulateur
          if (salaryInput) {
            salaryInput.value = annualSalaire;

            // 4. On déclenche le calcul instantanément
            calculateResteAVivre();

            // 5. UX : On fait défiler la page doucement jusqu'au simulateur
            if (simulateurSection) {
              simulateurSection.scrollIntoView({ behavior: "smooth" });
            }
          }
        });
      });
    };

    renderJobs();
  }
});
