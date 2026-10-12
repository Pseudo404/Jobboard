document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("job-form");
  const successMsg = document.getElementById("success-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // 1. Récupération des jobs existants dans le localStorage
    const existingJobs = JSON.parse(localStorage.getItem("capval_jobs")) || [];

    // 2. Génération de la date du jour au format YYYY-MM-DD
    const today = new Date();
    const datePublication = today.toISOString().split("T")[0];

    // 3. Création du nouvel ID (le plus grand ID actuel + 1)
    const maxId = existingJobs.reduce((max, job) => Math.max(max, job.id), 0);

    // 4. Création de l'objet de la nouvelle offre
    const newJob = {
      id: maxId + 1,
      titre: document.getElementById("titre").value,
      entreprise: document.getElementById("entreprise").value,
      secteur: document.getElementById("secteur").value,
      contrat: document.getElementById("contrat").value,
      salaire: document.getElementById("salaire").value,
      lieu: document.getElementById("lieu").value,
      teletravail: document.getElementById("teletravail").value,
      experience: document.getElementById("experience").value,
      description: document.getElementById("description").value,
      evolution: document.getElementById("evolution").value,
      datePublication: datePublication,
    };

    // 5. Ajout et Sauvegarde
    existingJobs.unshift(newJob); // unshift met l'offre au début du tableau (la plus récente)
    localStorage.setItem("capval_jobs", JSON.stringify(existingJobs));

    // 6. UX : Message de succès et redirection
    successMsg.classList.remove("hidden");
    form.querySelector('button[type="submit"]').disabled = true;

    setTimeout(() => {
      window.location.href = "jobs.html";
    }, 1500);
  });
});
