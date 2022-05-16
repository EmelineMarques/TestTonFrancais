let validation = false;
let score = 0;
let round = 0;
let vosReponses = [];
let profile = [];
$("#ecranResultat").hide();
$("#progress").hide();

let questions = `[{
		"question":"Comment s’écrit le participe passé de : ",
        "phrase":"Ils se sont ... compte de leur  erreur",
		"reponses":[
		"rendu",
		"rendus", 
		"rendue"
		], 
		"reponseCorrecte":0,
        "numero": 1,
        "resultat": 0
	},
	{
		"question":"Quel verbe s'écrit avec un t à l'indicatif présent, à la 3e personne du singulier ?",
        "phrase":"",
		"reponses":[
			"Aimer",
			"Diriger", 
			"Habiter",
            "Regarder",
            "Voir"
		], 
		"reponseCorrecte":4,
        "numero": 2,
        "resultat": 0        
	},
    {
		"question":"Avec quelle forme verbale compléter cette phrase à l'indicatif futur ?",
        "phrase":"Les beaux jours ...-ils ?",
		"reponses":[
			"Reviendra",
			"Reviendrons", 
			"Reviendront"
		], 
		"reponseCorrecte":2,
        "numero": 3,
        "resultat": 0
	},
    {
		"question":"Avec quelle forme verbale au subjonctif présent compléter cette phrase ? ",
        "phrase":"Il s'est mis à pleuvoir avant que nous ... le temps de nous mettre à l'abri.",
		"reponses":[
			"Ayons",
			"Ayions", 
			"Ayons eu"
		], 
		"reponseCorrecte":0,
        "numero": 4,
        "resultat": 0
	},
    {
		"question":"Parmi ces verbes, lequel n'est pas au passé simple ?",
        "phrase":"",
		"reponses":[
			"il déjeuna",
			"je descendis", 
			"ils mirent",
            "tu partais",
            "elles passèrent"
		], 
		"reponseCorrecte":3,
        "numero": 5,
        "resultat": 0
	},
    {
		"question":"À quel temps de l'indicatif le verbe est-il conjugué ?",
        "phrase":"Il a rajeuni de dix ans.",
		"reponses":[
			"présent",
			"imparfait", 
			"passé composé"
		], 
		"reponseCorrecte":2,
        "numero": 6,
        "resultat": 0
	},
    {
		"question":"Dans cette liste d’expressions, laquelle ne constitue pas un pléonasme ?",
        "phrase":"",
		"reponses":[
			"Allumer la lumière",
			"Commémorer un souvenir", 
			"Marcher à pied",
            "Célébrer un anniversaire",
            "Pondre un oeuf"
		], 
		"reponseCorrecte":3,
        "numero": 7,
        "resultat": 0
	},
    {
		"question":"Dans cette liste de noms, un seul est féminin : lequel ?",
        "phrase":"",
		"reponses":[
			"Arôme",
			"Espèce", 
			"Épisode",
            "Emblême",
            "Hémisphère",
            "Intervalle"
		], 
		"reponseCorrecte":1,
        "numero": 8,
        "resultat": 0
	},
    {
		"question":"Tous ces adjectifs doublent leur n final au féminin, sauf un : lequel ?",
        "phrase":"",
		"reponses":[
            "Lapon",
			"Ancien",
			"Bon", 
            "Méditerranéen"
		], 
		"reponseCorrecte": 0,
        "numero": 9,
        "resultat": 0
	},
    {
		"question":"Dans cette liste de noms, un seul est masculin : lequel ?",
        "phrase":"",
		"reponses":[
			"Armistice",
			"Autoroute", 
			"Écharpe",
            "Idole",
            "Interview",
            "Stalactite"
		], 
		"reponseCorrecte":0,
        "numero": 10,
        "resultat": 0
	}
]`

questions = JSON.parse(questions);

let barWidth = 0;

function growBar() {
    barWidth += 10;
    if (barWidth <= 100) {
        $('.bar').css({
            "width": barWidth + '%'
        });
    }
}
function progress() {
    growBar(barWidth);
}

$("#formulaire").validate({
    onfocusout: false,
    rules: {
        prenom: {
            required: true,
            maxlength: 100,
            alphanumeric: true
        },
        nom: {
            required: true,
            maxlength: 100,
            alphanumeric: true
        },
        date: {
            required: true,
            dateInferieur: true
        },
        statut: "required"
    },
    messages: {
        prenom: {
            required: "Le prénom est obligatoire.",
            maxlength: "Le prénom ne peut pas être plus long que..."
        },
        nom: {
            required: "Le nom est obligatoire.",
            maxlength: "Le nom ne peut pas être plus long que..."
        },
        date: {
            required: "Le date de naissance est requise."
        },
        statut: {
            required: "Le statut est requis."
        }
    },
    submitHandler: function () {
        quizz();
        profile = $("form").serializeArray();
        $("#erreurs").hide();
        $("#formulaire").hide();
        $("#ecranResultat").hide();
        $("#progress").hide();
        progress();
    },
    showErrors: function (errorMap, errorList) {
        if (validation) {
            const ul = $("<ul></ul>");
            $.each(errorList, function () {
                ul.append(`<li>${this.message}</li>`);
            });
            $('#erreurs').html(ul)
            validation = false;
            $('#erreurs').addClass("alert alert-danger w-50 mx-auto");
        }
        $("#erreurs").show();
        this.defaultShowErrors();
    },
    invalidHandler: function (form, validator) {
        $("#accordion").hide();
        validation = true;
    },
});
jQuery.validator.addMethod(
    "alphanumeric",
    function (value, element) {
        return this.optional(element) || /^[\w.]+$/i.test(value);
    },
    "Lettres et chiffres uniquement."
);
$.validator.addMethod(
    "dateInferieur",
    function (value, element) {
        const dateActuelle = new Date();
        return this.optional(element) || dateActuelle >= new Date(value);
    },
    "La date de naissance doit être inférieure à la date d'aujourd'hui."
);

let quizz = function () {
    $(document).ready(function () {
        $("#accordion").show("slow");
        $("#progress").show();
        $("#btnSuivant").hide();
        $("#ecranResultat").hide();

        let round = 0;
        let point = 0;

        displayOption(questions, round);

        function displayOption(array, round) {
            $(".list-group-item").remove();
            $.each(array, function () {
                $(".card-title").text(`${round+1}. ${array[round].question}`);
                $(".phrase").text(`${array[round].phrase}`);
            });
            for (let i = 0; i < array[round].reponses.length; i++) {
                $a = $("<a></a>");
                $a.addClass("list-group-item");
                $a.text(array[round].reponses[i]);
                $(".list-group").append($a);
            }
        }
        $(".list-group").on("click", function (e) {
            if (e.target.nodeName == "A") {
                $(e.target)
                    .siblings()
                    .removeClass("active");
                $(e.target).addClass("active");
                $("#btnSuivant").show("slow");
            }
            e.preventDefault();
        });
        $("#btnSuivant").on("click", function (e) {
            checkAnswer(e);
            $("#btnSuivant").hide();
        });

        function checkAnswer(e) {
            e.preventDefault();
            if ($(".active").length) {
                let optionIndex = $(".active").index();
                if (questions[round].reponseCorrecte === optionIndex) {
                    questions[round].resultat = 1;
                    point++;
                }
                if (round < questions.length - 1) {
                    round++;
                    progress();
                    displayOption(questions, round);
                    console.log(point);
                    return point;
                } else {
                    round++
                    $.each(profile, function () {
                        if (this.name === "prenom")
                            $("#resultatPrenom").text(this.value);
                        if (this.name === "nom")
                            $("#resultatNom").text(this.value);
                        if (this.name === "date") {
                            let dob = new Date(this.value);
                            let today = new Date();
                            let age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
                            $("#resultatAge").text(age);
                        }
                        if (this.name === "statut")
                            $("#resultatStatut").text(this.value);
                    });
                    $("#resultatScore").text(point + " / " + questions.length);

                    $('#myTable').DataTable({
                        data: questions,
                        columns: [{
                                data: 'numero'
                            },
                            {
                                data: 'question'
                            },
                            {
                                data: 'resultat'
                            }
                        ],
                        columnDefs: [{
                            render: function (data, type, row) {
                                if (data == 0) return "Mauvaise réponse";
                                return "Bonne réponse";
                            },
                            targets: 2,
                        }, ],
                        bPaginate: false,
                        bFilter: false,
                        info: false
                    });

                    $.each(questions, function () {
                        let h3 = $("<h3>" + this.numero + ". " + this.question + "</h3>");
                        let div = $("<div><p><b>" + this.phrase + "</b></p><p>" + this.reponses + "</p></div>");
                        $("#accordionResultat").append(h3);
                        $("#accordionResultat").append(div);
                    });

                    $("#accordionResultat").accordion({
                        collapsible: true,
                        heightStyle: "content",
                        active: false
                    });

                    if (point > 7) {
                        $(".modal-content").addClass("alert-success succes-score");
                        $(".modal-body>p").text(`C'est un véritable succès ! Tu as eu : ${point}/${questions.length}.`);
                        $("#monModal").modal("show");
                        $("#accordion").hide();
                        $("#progress").hide();
                        $("#ecranResultat").show();
                        $('.alert').alert().show().removeClass("alert-dark").addClass("alert-success succes-score").text(`C'est un véritable succès ! Tu as eu : ${point}/10.`);
                    } else if (point >= 6) {
                        $(".modal-content").addClass("alert-warning bon-score");
                        $(".modal-body>p").text(`C'est bon, mais tu peux faire mieux. Tu as eu : ${point}/${questions.length}.`);
                        $("#monModal").modal("show");
                        $("#accordion").hide();
                        $("#progress").hide();
                        $("#ecranResultat").show();
                        $('.alert').alert().show().removeClass("alert-dark").addClass("alert-warning bon-score").text(`C'est bon, mais tu peux faire mieux. Tu as eu : ${point}/10.`);
                    } else if (point <= 5) {
                        $(".modal-content").addClass("alert-danger echec-score");
                        $(".modal-body>p").text(`C'est un véritable échec, tu as eu : ${point}/${questions.length}.`);
                        $("#monModal").modal("show");
                        $("#accordion").hide();
                        $("#progress").hide();
                        $("#ecranResultat").show();
                        $('.alert').alert().show().removeClass("alert-dark").addClass("alert-danger echec-score").text(`C'est un véritable échec, tu as eu : ${point}/10.`);
                    } else if (point = 10) {
                        $(".modal-content").addClass("alert-success succes-score");
                        $(".modal-body>p").text(`Score parfait ! Tu as eu : ${point}/${questions.length}.`);
                        $("#monModal").modal("show");
                        $("#accordion").hide();
                        $("#progress").hide();
                        $("#ecranResultat").show();
                        $('.alert').alert().show().removeClass("alert-dark").addClass("alert-success succes-score").text(`Tu as fait un score parfait, de ${point}/10.`);
                    }
                }
            } else {
                return false;
            }
        }
    });
}