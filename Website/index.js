const apiEndpoint = "http://localhost:5000";

$(document).ready(function() {
    console.log("JQuery operational!");

    // Trigger DDL pour changer la div affichée au démarrage 
    $("#ddl").change();

    $.ajax({
        type: "GET",
        url: apiEndpoint + "/",   
        contentType: "application/json",
        success: function(result) {
            console.log("API operational!");
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
        }
    })
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
            break;
        case "jobs": // Quand on sélectionne "Postes"
            $(".employees").hide();
            $(".salaries").hide();
            $(".jobs").show();
            getAllJobs();
            break;
    }
});

// Récupère la liste des employés et l'affiche dans la table des employés
// TODO : Gérer erreurs
// TODO : Afficher job plutot que jobId
// TODO : Ajouter ancienneté plutot que date
function getAllEmployees() {
    $(".employee").remove();
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/employees/",   
        contentType: "application/json",
        success: function(result) {
            const employees = result.data;
            for (const employee of employees) {
                const html = `<tr id="employee-${employee.id}" class="employee">
                                <td>${employee.lastName}</td>
                                <td>${employee.firstName}</td>
                                <td>${employee.email}</td>
                                <td>${employee.jobId}</td>
                                <td>${employee.seniority}</td>
                                <td>
                                    <button id="calcE-${employee.id}" class="btn btn-success calcE" data-id="${employee.id}" title="Calculer le salaire de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-money-check-dollar"></i></button>
                                    <button id="editE-${employee.id}" class="btn btn-warning editE" data-id="${employee.id}" title="Modifier le profil de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-user-pen"></i></button>
                                    <button id="delE-${employee.id}" class="btn btn-danger delE" data-id="${employee.id}" title="Supprimer le profil de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-user-pen"></i></button>
                                </td>
                            </tr>`;
                $('#employeesTable tr:last').after(html);
            }
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
        }
    });
}

// ????
// TODO : Do
function getAllSalaries(gridNumber) {
    $(".salary").remove();
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/salarygrid/" + gridNumber,   
        contentType: "application/json",
        success: function(result) {
            console.log(result.data);
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
        }
    });
}

// Récupère la liste des postes et l'affiche dans la table des postes
// TODO : Gérer erreurs
function getAllJobs() {
    $(".job").remove();
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/jobs/",   
        contentType: "application/json",
        success: function(result) {
            const jobs = result.data;
            for (const job of jobs) {
                const html = `<tr id="job-${job.id}" class="job">
                                <td>${job.label}</td>
                            </tr>`;
                $('#jobsTable tr:last').after(html);
            }
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
        }
    });
}