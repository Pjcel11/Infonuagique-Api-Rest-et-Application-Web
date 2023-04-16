const apiEndpoint = "https://serene-beyond-46661.herokuapp.com";
const indexValue = 4.85003;

// Démarrer le site web http-server -p 3000
$(document).ready(function() {
    // Trigger DDL pour changer la div affichée au démarrage
    $("#ddl").change();
    // Ajoute les jobs dans les modals d'ajout et modif d'employé
    getAllJobsEmployee();
});

// S'active au changement de valeur de la DDL
// Affiche/cache les divs en fonction de la valeur choisie 
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

function launchBlankModal(title, text) {
    $("#blankModalTitle").html(title);
    $("#blankModalText").html(text);
    $("#blankModal").modal('show');
}




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

    var text = years + " ans " + months + " mois";
    return text;
}

// Calcule la différence entre deux dates et renvoie le nombre de mois
function getMonths(date1, date2) {
    // On calcule la différence en ms entre les deux dates 
    var diff = Math.abs(Math.floor(date1 - date2));

    // Définition d'un jour en ms
    var month = 1000 * 60 * 60 * 24 * 31;
    var months = Math.floor(diff/month);

    return months;
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
                // On ajoute des données au boutons avec les arguments "data-XXX=YYY".
                // On peut récupérer les valeurs en jquery en faisait YYY = $(this).data("XXX")
                // Utile pour récupérer des données sans avoir à passer par les valeurs des autres cellules
                const seniority = dateDiff(Date.parse(employee.seniority), Date.now());
                const months = getMonths(Date.parse(employee.seniority), Date.now());
                const html = `<tr id="employee-${employee.id}" class="employeesRows">
                                <td>${employee.lastName}</td>
                                <td>${employee.firstName}</td>
                                <td>${employee.email}</td>
                                <td>${employee.job.label}</td>
                                <td title="${"À rejoint le " + employee.seniority}">${seniority}</td>
                                <td>
                                    <button id="calcE-${employee.id}" class="btn btn-success calcE" data-name="${employee.lastName} ${employee.firstName}" data-job="${employee.jobId}" data-months="${months}" data-level="${employee.level}" title="Calculer le salaire brut de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-money-check-dollar"></i></button>
                                    <button id="editE-${employee.id}" class="btn btn-warning editE" data-id="${employee.id}" data-lastname="${employee.lastName}" data-firstname="${employee.firstName}" data-email="${employee.email}" data-job="${employee.jobId}" data-seniority="${employee.seniority}" data-level="${employee.level}" title="Modifier le profil de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-user-pen"></i></button>
                                    <button id="delE-${employee.id}" class="btn btn-danger delE" data-id="${employee.id}" data-name="${employee.lastName} ${employee.firstName}" title="Supprimer le profil de ${employee.firstName} ${employee.lastName}"><i class="fa-solid fa-trash"></i></button>
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

// Activée au click pour ajouter un employé
// Met le bon titre et desc au modal et l'affiche
$(document).on('click', '#addEmployeButton', function() {
    $("#employeeConfirm").data("type", "add");

    $("#firstName").val("");
    $("#lastName").val("");
    $("#email").val("");
    $("#date").val("");
    $("#job").val("");
    $("#level").val("");

    $("#employeeModalTitle").html("Ajout d'employé");
    $("#employeeModalDesc").html("Entrez les informations du nouvel employé :");
    $("#employeeConfirm").html("Ajouter");
    $("#employeeModal").modal("show");
});

// Activée au click pour edit un employé
// Met le bon titre et desc au modal et l'affiche
$(document).on('click', '.editE', function() {
    $("#employeeConfirm").data("id", $(this).data("id"));
    $("#employeeConfirm").data("type", "edit");

    $("#firstName").val($(this).data("firstname"));
    $("#lastName").val($(this).data("lastname"));
    $("#email").val($(this).data("email"));
    $("#date").val($(this).data("seniority"));
    $("#job").val($(this).data("job"));
    $("#level").val($(this).data("level"));

    $("#employeeModalTitle").html("Modification d'employé");
    $("#employeeModalDesc").html("Entrez les informations de l'employé à modifier :")
    $("#employeeConfirm").html("Modifier");
    $("#employeeModal").modal("show");
});

// Activée au click sur le bouton de confirmation du modal d'ajout/modif d'un employé
// Ajoute l'employé et l'affiche dans le tableau
// Ou modifie l'employé existant
$(document).on('click', '#employeeConfirm', function() {
    // On récupere les valeurs des champs
    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#email").val();
    const date = $("#date").val();
    const jobId = $("#job").val();
    const level = $("#level").val();

    if ((!firstName || firstName == "") || 
        (!lastName || lastName == "") || 
        (!email || email == "") || 
        (!date || date == "") || 
        (!jobId || jobId == "") || 
        (!level || level == "")) {
        launchBlankModal("Ajout d'employé", `Le formulaire contient des champs non-remplis. Veuillez reessayer.`);
    }
    else if (Date.parse(date) > Date.now()) {
        launchBlankModal("Ajout d'employé", `Le formulaire contient une date de début de contrat ultérieure à la date du jour. Veuillez reessayer.`);
    }
    else {
        console.log(Date.parse(date) > Date.now())
        // On recupere le type de requête à faire
        const type = $("#employeeConfirm").data("type");

        if (type == "add") {
            // Ajout d'employé. On crée l'objet JSON
            const employee = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "jobId": jobId,
                "seniority": date,
                "level": level
            };
        
            // Requête AJAX à l'API
            $.ajax({
                type: "POST",
                url: apiEndpoint + "/employees",   
                data: JSON.stringify(employee),
                contentType: "application/json",
                success: function() {
                    getAllEmployees();
                    launchBlankModal("Ajout d'employé", `L'employé <b>${lastName} ${firstName}</b> a été ajouté à la base de données.`);
                },
                error: function(response) {
                    console.log("API failed. See error below.");
                    console.log(response);
                    launchBlankModal("Ajout d'employé", `L'employé <b>${lastName} ${firstName}</b> n'a pas pu être ajouté à la base de données. Veuillez reessayer.`);
                }
            });
        } 
        else if (type == "edit") {
            // Modification d'employé. On récupère l'ID de l'employé à modifier
            const id = $("#employeeConfirm").data("id");
            // On crée l'objet JSON
            const employee = {
                "id": id,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "jobId": jobId,
                "seniority": date,
                "level": level
            };

            // Requête AJAX à l'API
            $.ajax({
                type: "PUT",
                url: apiEndpoint + "/employees/" + id,   
                data: JSON.stringify(employee),
                contentType: "application/json",
                success: function(response) {
                    getAllEmployees();
                    launchBlankModal("Modification d'employé", `L'employé <b>${lastName} ${firstName}</b> a été modifié avec succès.`);
                },
                error: function(response) {
                    console.log("API failed. See error below.");
                    console.log(response);
                    launchBlankModal("Modification d'employé", `L'employé <b>${lastName} ${firstName}</b> n'a pas pu être modifié. Veuillez reessayer.`);
                }
            });
        }
    }
});

// Activée au click sur le bouton de suppression d'un employé
// Récupère les infos de l'employé pour les mettre dans le modal, et affiche le modal
$(document).on('click', '.delE', function() {
    // On récupère les infos de l'employé
    const employeeId = $(this).data("id");
    const employeeName = $(this).data("name");

    // On set l'ID de l'employé dans le bouton et le texte du modal
    $("#deleteEmployeeConfirm").data("id", employeeId);
    $("#deleteEmployeeConfirm").data("name", employeeName);
    $("#deleteEmployeeModalText").html(`Êtes-vous sûr de voulour supprimer l'employé <b>${employeeName}</b> ? Cette action est irreversible.`);

    // On lance le modal
    $("#deleteEmployeeModal").modal("show");
});

// Activée au click sur le bouton de confirmation du modal pour supprimer d'un employé
// Supprime l'employé et l'enlève du tableau
$(document).on('click', '#deleteEmployeeConfirm', function() {
    // On récupère les infos de l'employé
    const employeeId = $(this).data("id");
    const employeeName = $(this).data("name");

    // Requête AJAX à l'API
    $.ajax({
        type: "DELETE",
        url: apiEndpoint + "/employees/" + employeeId,   
        contentType: "application/json",
        success: function(result) {
            $(`#employeesTable tr#employee-${employeeId}`).remove();
            launchBlankModal("Suppression d'employé", `L'employé <b>${employeeName}</b> a été supprimé de la base de données.`)
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
            launchBlankModal("Suppression d'employé", `L'employé <b>${employeeName}</b> n'a pas pu être supprimé. Veuillez reessayer.`)
        }
    });
});




//////////////
// SALARIES //
//////////////

// Récupère les postes et les met dans la DDL pour sélection de la grille de salaire
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
                                    <td>${salary.durationMonths == null ? "-" : salary.durationMonths}</td>
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

// Activée quand on clique un bouton de calcul de salaire
// Calcule le salaire de l'employé référencé et l'affiche à l'écran
$(document).on('click', '.calcE', function() { 
    // On récupère les infos de l'employé
    const employeeName = $(this).data("name");
    const employeeLevel = $(this).data("level");
    const employeeJobId = $(this).data("job");
    const employeeMonths = $(this).data("months");
    
    // Requète AJAX à l'API
    // On récupère la ligne de salaire associée à poste/ancienneté/échelon
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/salarygrid/" + employeeJobId + "/" + employeeMonths + "/" + employeeLevel,   
        contentType: "application/json",
        success: function(result) {
            const salaryInfo = result.data[0];
            var salary = 0;
            // Si salaire non null, on a récupéré le salaire
            // Sinon, on le calcule manuellement et on l'envoie en BDD
            if (salaryInfo.grossSalary != null) {
                salary = salaryInfo.grossSalary;
            } else {
                salary = (salaryInfo.increasedIndex * indexValue).toFixed(2);
                // JSON de la ligne
                const line = {
                    "id": salaryInfo.id,
                    "jobId": employeeJobId,
                    "level": salaryInfo.level,
                    "increasedIndex": salaryInfo.increasedIndex,
                    "durationMonths": salaryInfo.durationMonths,
                    "grossSalary": salary
                };

                // Requête AJAX à l'API
                $.ajax({
                    type: "PUT",
                    url: apiEndpoint + "/salarygrid/" + salaryInfo.id,   
                    data: JSON.stringify(line),
                    contentType: "application/json",
                    error: function(response) {
                        console.log("API failed. See error below.");
                        console.log(response);
                    }
                });
            }
            launchBlankModal("Calcul de salaire", `Le salaire brut de ${employeeName} est <b>${salary}€.</b>`)
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
            launchBlankModal("Calcul de salaire", `Le salaire brut de ${employeeName} n'a pas pu être calculé. Veuillez reessayer <b>${salary}€.</b>`)
        }
    });
});

$(document).on('click', '#calcAll', function() {
    const employeesNb = $('.employeesRows').length
    var sumSalaries = 0;
    var jobIdArray = [];
    var jobIdSalary = [];
    var jobLabelArray = [];
    var isAlright = true;

    for (var i = 0; i < employeesNb; i++) {
        const jobLabel = $(`#employeesTable tr.employeesRows:eq(${i}) td:nth-child(4)`).html();
        const salaryButton = $(`#employeesTable tr.employeesRows:eq(${i}) td:nth-child(6) button:nth-child(1)`);
        const job = salaryButton.data("job");
        const level = salaryButton.data("level");
        const months = salaryButton.data("months");

        if (!jobIdArray.includes(job)) {
            jobIdArray.push(job);
            jobLabelArray[job] = jobLabel;
            jobIdSalary[job] = 0;
        }

        $.ajax({
            type: "GET",
            url: apiEndpoint + "/salarygrid/" + job + "/" + months + "/" + level,   
            contentType: "application/json",
            async: false,
            success: function(result) {
                const salaryInfo = result.data[0];
                var salary = 0;
                // Si salaire non null, on a récupéré le salaire
                // Sinon, on le calcule manuellement
                if (salaryInfo.grossSalary != null)
                    salary = salaryInfo.grossSalary;
                else
                    salary = (salaryInfo.increasedIndex * indexValue).toFixed(2);

                sumSalaries += parseInt(salary);
                jobIdSalary[job] += parseInt(salary);
            },
            error: function(response) {
                console.log("API failed. See error below.");
                console.log(response);
                isAlright = false;
            }
        });
    }

    if (isAlright) {
        $(".calcAllRows").remove();
        $("#calcAllTotal").html(`Le salaire brut total des employés est de <b>${sumSalaries}€</b>.`);
        for (const jobId of jobIdArray) {
            $("#calcAllTable tbody").append(`<tr class="calcAllRows"><td>${jobLabelArray[jobId]}</td><td><b>${jobIdSalary[jobId]}€</b></td></tr>`)
        }
        $("#calcAllModal").modal("show");
    }
    else {
        launchBlankModal("Calcul de salaire", `Le salaire brut total des employés n'a pas pu être calculé. Veuillez reessayer.`);

    }
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

// Récupère la liste des postes et l'ajoute dans les select d'ajout et de modification d'employé
function getAllJobsEmployee() {
    // On vide les select pour remettre les lignes et eviter les doublons
    $("#job").empty();

    // Requête AJAX à l'API
    $.ajax({
        type: "GET",
        url: apiEndpoint + "/jobs/",   
        contentType: "application/json",
        success: function(result) {
            const jobs = result.data;
            // On ajoute une ligne pour chaque poste
            for (const job of jobs) {
                $('#job').append($(`<option value="${job.id}"}>${job.label}</option>`));
            }
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
        }
    });
}

// Déclanchée au click du bouton d'ajout d'un nouveau job
// Nettoie et affiche le modal
$(document).on('click', '#addJobButton', function() {
    // On reset les champs
    $("#jobLabel").val("");
    $(".newJobRows").remove();
    // On affiche le modal
    $("#jobModal").modal("show");
});

// Déclanchée quand on clique sur le "+" du modal de nouveau job pour ajouter une nouvelle ligne de grille de salaire
// Ajoute une nouvelle ligne
$(document).on('click', '#jobAddLine', function() {
    // On récupère l'ID de la ligne à ajouter
    const id = $(this).data("id");
    // HTML de la ligne
    const html = `<div class="row newJobRows">
                    <div class="col">
                        <input id="level-${id}" type="text" class="form-control" placeholder="Echelon">
                    </div>
                    <div class="col">
                        <input id="index-${id}" type="text" class="form-control" placeholder="Indice majoré">
                    </div>
                    <div class="col">
                        <input id="months-${id}" type="text" class="form-control" placeholder="Ancienneté (mois)">
                    </div>
                </div>`;
    // On ajoute la ligne
    $("#jobSalaryGrid .row:last").after(html);
    // On incrémente l'ID de 1 pour avoir un nouvel ID au prochain ajout
    $(this).data("id", id + 1);
});

// Déclanchée quand on clique sur le bouton de confirmation d'ajout de job
// Ajoute le job et sa grille de salaire à la BDD
$(document).on('click', '#jobConfirm', function() {
    const label = $("#jobLabel").val();

    // On crée l'objet JSON
    const job = {
        "label": label
    };

    // Requête AJAX à l'API
    $.ajax({
        type: "POST",
        url: apiEndpoint + "/jobs",   
        data: JSON.stringify(job),
        contentType: "application/json",
        success: function(result) {
            // On récupère l'ID du job créé
            const jobId = result.data.id;
            // Nombre de lignes a ajouter
            const lineNb = $("#jobAddLine").data("id");
            // On crée l'objet JSON
            let salaryGrid = {};
            // On itère sur chaque ligne
            for (let i = 0; i < lineNb; i++) {
                // On récupère les valeurs des champs et on les ajoute dans un objet JSON
                const salaryLine = {
                    "jobId": jobId,
                    "level": $(`#level-${i}`).val(),
                    "increasedIndex": $(`#index-${i}`).val(),
                    "durationMonths": $(`#months-${i}`).val(),
                };
                // On ajoute cet objet à l'objet JSON parent
                salaryGrid[i] = salaryLine;
            }

            // Requête AJAX à l'API
            $.ajax({
                type: "POST",
                url: apiEndpoint + "/salarygrid",   
                data: JSON.stringify(salaryGrid),
                contentType: "application/json",
                success: function(result) {
                    launchBlankModal("Ajout de poste", `Le poste <b>${label}</b> a été ajouté avec succès.`);
                    getAllJobs();
                },
                error: function(response) {
                    console.log("API failed. See error below.");
                    console.log(response);
                    launchBlankModal("Ajout de poste", `Le poste <b>${label}</b> n'a pas pu être ajouté. Veuillez reessayer.`);
                }
            });
        },
        error: function(response) {
            console.log("API failed. See error below.");
            console.log(response);
            launchBlankModal("Ajout de poste", `Le poste <b>${label}</b> n'a pas pu être ajouté. Veuillez reessayer.`);
        }
    });
});