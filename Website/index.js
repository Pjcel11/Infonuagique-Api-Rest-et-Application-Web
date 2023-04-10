const apiEndpoint = "http://localhost:5000";

$(document).ready(function() {
    // Trigger DDL pour changer la div affichée au démarrage 
    $("#ddl").change();
});

// S'active au changement de valeur de la DDL
// Affiche/cache les divs en fonction de la valeur choisie 
// TODO : Ajouter appel fonction getSalaires
$("#ddl").change(function() {
    switch(this.value) {
        case "employees": // Quand on sélectionne "Employées"
            $(".employees").show();
            $(".salaries").hide();
            $(".jobs").hide();
            getAllEmployees();
            break;
        case "salaries": // Quand on sélectionne "Salaires"
            $(".employees").hide();
            $(".salaries").show();
            $(".jobs").hide();
            getSalariesJobs();
            break;
        case "jobs": // Quand on sélectionne "Postes"
            $(".employees").hide();
            $(".salaries").hide();
            $(".jobs").show();
            getAllJobs();
            break;
    }
});

///////////////
// EMPLOYEES //
///////////////

// Calcule la différence entre deux dates et renvoie sous forme de texte
function dateDiff(date1, date2) {
    // On calcule la différence en ms entre les deux dates 
    var diff = Math.abs(Math.floor(date1 - date2));

    // Définition d'un jour en ms
    var month = 1000 * 60 * 60 * 24 * 31;
    var years = Math.floor(diff/month/12);
    var months = Math.floor(diff/month) - years * 12;

    var text = years + " ans " + months + " mois"
    return text
}

// Récupère la liste des employés et l'affiche dans la table des employés
function getAllEmployees() {   
    // On vide la table pour actualiser les lignes
    $(".employeesRows").remove();

    // Requête AJAX à l'API
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/employees/",   
        contentType: "application/json",
        success: function(result) {
            const employees = result.data;
            // On ajoute une ligne pour chaque employé
            for (const employee of employees) {
                const seniority = dateDiff(Date.parse(employee.seniority), Date.now());
                const html = `<tr id="employee-${employee.id}" class="employeesRows">
                                <td>${employee.lastName}</td>
                                <td>${employee.firstName}</td>
                                <td>${employee.email}</td>
                                <td>${employee.job.label}</td>
                                <td title="${"À rejoint le " + employee.seniority}">${seniority}</td>
                                <td>
                                    <button id="calcE-${employee.id}" class="btn btn-success calcE" data-id="${employee.id}" title="Calculer le salaire de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-money-check-dollar"></i></button>
                                    <button id="editE-${employee.id}" class="btn btn-warning editE" data-id="${employee.id}" title="Modifier le profil de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-user-pen"></i></button>
                                    <button id="delE-${employee.id}" class="btn btn-danger delE" data-id="${employee.id}" title="Supprimer le profil de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>`;
                $('#employeesTable tr:last').after(html);
            }
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
            // On ajoute une ligne entière qui span la table entière
            const html = `<tr id="employee-null" class="employeesRows">
                                <td colspan=6>Aucun employé trouvé</td>
                            </tr>`;
            $('#employeesTable tr:last').after(html);
        }
    });
}

//////////////
// SALARIES //
//////////////

function getSalariesJobs() {
    // On vide la DDL
    $("#ddlSalaries").empty();

    // Requête AJAX à l'API
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/jobs/",   
        contentType: "application/json",
        success: function(result) {
            const jobs = result.data;
            // On ajoute une ligne pour chaque poste
            console.log(jobs)
            for (const job of jobs) {
                $('#ddlSalaries').append($(`<option value="${job.id}"}>${job.label}</option>`));
            }
            $("#ddlSalaries").change();
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
        }
    });
}

// Lancée quand on change la valeur de la DDL des salaires
// Récupère la grille de salaire en fonction de la valeur de la DDL
$("#ddlSalaries").change(function() {
    // On vide la table pour la reremplir avec la grille de salaire et eviter les doublons
    $(".salariesRows").remove();

    // Requète AJAX à l'API
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/salarygrid/" + this.value,   
        contentType: "application/json",
        success: function(result) {
            const salaries = result.data;
            // Si l'on a rien récupéré, on affiche le message d'erreur classique
            if (salaries.length == 0) {
                const html = `<tr id="salary-null-null" class="salariesRows">
                                <td colspan=4>Aucune grille indiciaire trouvée pour ce poste</td>
                            </tr>`;
                $('#salariesTable tr:last').after(html);
            } else {
                // On ajoute chaque ligne de la grille à la table
                for (const salary of salaries) {
                    const html = `<tr id="salary-${this.value}-${salary.id}" class="salariesRows">
                                    <td>${salary.level}</td>
                                    <td>${salary.increasedIndex}</td>
                                    <td>${salary.durationMonths}</td>
                                    <td>${salary.grossSalary == null ? "Inconnu" : salary.grossSalary}</td>
                                </tr>`;
                    $('#salariesTable tr:last').after(html);
                } 
            }
            
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
            const html = `<tr id="salary-null-null" class="salariesRows">
                                <td colspan=4>Aucune grille indiciaire trouvée pour ce poste</td>
                            </tr>`;
            $('#salariesTable tr:last').after(html);
        }
    });
});

//////////
// JOBS //
//////////

// Récupère la liste des postes et l'affiche dans la table des postes
function getAllJobs() {
    // On vide la table pour remettre les lignes et eviter les doublons
    $(".jobRows").remove();

    // Requête AJAX à l'API
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/jobs/",   
        contentType: "application/json",
        success: function(result) {
            const jobs = result.data;
            // On ajoute une ligne pour chaque poste
            for (const job of jobs) {
                const html = `<tr id="job-${job.id}" class="jobRows">
                                <td>${job.label}</td>
                            </tr>`;
                $('#jobsTable tr:last').after(html);
            }
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
            const html = `<tr id="job-null" class="jobRows">
                            <td>Aucun poste trouvé</td>
                        </tr>`;
            $('#jobsTable tr:last').after(html);        }
    });
}