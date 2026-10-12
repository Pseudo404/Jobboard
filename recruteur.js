document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("job-form");
  const successMsg = document.getElementById("success-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // 1. Récupération des jobs existants
    const existingJobs = JSON.parse(localStorage.getItem("capval_jobs")) || [];

    // 2. Génération de la date du jour
    const today = new Date();
    const datePublication = today.toISOString().split("T")[0];

    // 3. Création du nouvel ID
    const maxId = existingJobs.reduce((max, job) => Math.max(max, job.id), 0);

    // 4. Formatage automatique du salaire
    let salaireSaisi = document.getElementById("salaire").value.trim();
    if (!salaireSaisi.toLowerCase().includes("€")) {
      salaireSaisi += " €/an";
    }

    // 5. Création de l'objet
    const newJob = {
      id: maxId + 1,
      titre: document.getElementById("titre").value,
      entreprise: document.getElementById("entreprise").value,
      secteur: document.getElementById("secteur").value,
      contrat: document.getElementById("contrat").value,
      salaire: salaireSaisi, // Utilisation de la valeur formatée
      lieu: document.getElementById("lieu").value,
      teletravail: document.getElementById("teletravail").value,
      experience: document.getElementById("experience").value,
      description: document.getElementById("description").value,
      evolution: document.getElementById("evolution").value,
      datePublication: datePublication,
    };

    // 6. Ajout et Sauvegarde
    existingJobs.unshift(newJob);
    localStorage.setItem("capval_jobs", JSON.stringify(existingJobs));

    // 7. UX : Message de succès et redirection
    successMsg.classList.remove("hidden");
    form.querySelector('button[type="submit"]').disabled = true;

    setTimeout(() => {
      window.location.href = "jobs.html";
    }, 1500);
  });
});
