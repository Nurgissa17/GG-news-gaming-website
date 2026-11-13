function feedback(id, valid, message) {
    if (valid) {
        $("#" + id + "Feedback").text("✓").attr("class", "d-block text-success");
    } else {
        $("#" + id + "Feedback").text(message).attr("class", "d-block text-danger");
    }
}
function checkForm() {
    let name = $("#name").val().trim();
    let email = $("#email").val().trim();
    let message = $("#message").val().trim();
    let password = $("#password").val();
    let confirmPassword = $("#confirmPassword").val();
    let validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    feedback("name", name !== "", "Name is required.");
    feedback("email", validEmail, "Enter a valid email.");
    feedback("message", message !== "", "Message is required.");
    feedback("password", password !== "", "Password is required.");
    feedback("confirmPassword", password !== "" && password === confirmPassword, "Passwords must match.");
    let strength = "Weak";
    if (password.length >= 8) strength = "Medium";
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength = "Strong";
    $("#strength").text(password ? "Strength: " + strength : "");
    return name !== "" && validEmail && message !== "" && password !== "" && password === confirmPassword;
}
$("#registerForm input, #registerForm textarea").on("input", function () {
    checkForm();
    $("#formStatus").text("");
});
$("#registerForm").submit(function (event) {
    event.preventDefault();
    if (checkForm()) {
        $("#formStatus").text("Validation passed (demo only; no account created).");
    } else {
        $("#formStatus").text("Please correct the fields above.");
    }
});

let category = "all";
function filterNews() {
    let search = $("#search").val().toLowerCase();
    $(".news-item").each(function () {
        let textMatches = $(this).text().toLowerCase().includes(search);
        let categoryMatches = category === "all" || $(this).attr("data-category") === category;
        if (textMatches && categoryMatches) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}
$("#search").on("input", filterNews);
$(".category-btn").click(function () {
    category = $(this).attr("data-category");
    $(".category-btn").removeClass("btn-primary").addClass("btn-outline-primary");
    $(this).removeClass("btn-outline-primary").addClass("btn-primary");
    filterNews();
});

$("#gameForm").submit(function (event) {
    event.preventDefault();
    let name = $("#gameName").val().trim();
    let genre = $("#gameGenre").val().trim();
    let score = $("#gameScore").val().trim();
    if (!name || !genre || !score) {
        alert("Fill in all fields.");
        return;
    }
    let row = $("<tr>");
    row.append($("<td>").text(name));
    row.append($("<td>").text(genre));
    row.append($("<td>").text(score));
    row.append('<td><button class="btn btn-sm btn-primary edit">Edit</button> <button class="btn btn-sm btn-danger delete">Delete</button></td>');
    $("#gameRows").append(row);
    this.reset();
});
$("#gameRows").on("click", ".edit", function () {
    let cells = $(this).closest("tr").find("td");
    let name = prompt("Game", cells.eq(0).text());
    if (!name || !name.trim()) return;
    let genre = prompt("Genre", cells.eq(1).text());
    if (!genre || !genre.trim()) return;
    let score = prompt("Score", cells.eq(2).text());
    if (!score || !score.trim()) return;
    cells.eq(0).text(name.trim());
    cells.eq(1).text(genre.trim());
    cells.eq(2).text(score.trim());
});
$("#gameRows").on("click", ".delete", function () {
    if (confirm("Delete this game?")) {
        $(this).closest("tr").remove();
    }
});

let imageIndex = 0;
function showImage() {
    let image = $("#gallery img").eq(imageIndex);
    $("#largeImage").attr("src", image.attr("src")).attr("alt", image.attr("alt"));
}
$("#gallery img").click(function () {
    imageIndex = $("#gallery img").index(this);
    showImage();
    $("#lightbox").fadeIn(200);
});
function changeImage(step) {
    $("#largeImage").fadeOut(150, function () {
        imageIndex = (imageIndex + step + $("#gallery img").length) % $("#gallery img").length;
        showImage();
        $("#largeImage").fadeIn(150);
    });
}
$("#prevImage").click(function () { changeImage(-1); });
$("#nextImage").click(function () { changeImage(1); });
$("#closeImage").click(function () { $("#lightbox").fadeOut(200); });

function showTheme() {
    let theme = localStorage.getItem("ggTheme");
    if (theme !== "light") theme = "dark";
    $("html").attr("data-theme", theme);
    if (theme === "dark") {
        $("#themeButton").text("Light theme");
    } else {
        $("#themeButton").text("Dark theme");
    }
}
showTheme();
$("#themeButton").click(function () {
    if ($("html").attr("data-theme") === "dark") {
        localStorage.setItem("ggTheme", "light");
    } else {
        localStorage.setItem("ggTheme", "dark");
    }
    showTheme();
});

function showSignIn() {
    let email = localStorage.getItem("ggUser");
    if (email) {
        $("#signedInUser").text("Signed in: " + email);
        $("#signInLink, #signInForm").hide();
        $("#signOutButton").show();
        $("#signInStatus").text("You are signed in as " + email);
    } else {
        $("#signedInUser, #signInStatus").text("");
        $("#signInLink, #signInForm").show();
        $("#signOutButton").hide();
    }
}
showSignIn();
$("#signInForm").submit(function (event) {
    event.preventDefault();
    let email = $("#signInEmail").val().trim();
    let password = $("#signInPassword").val();
    if (!document.getElementById("signInEmail").checkValidity() || password === "") {
        $("#signInStatus").text("Enter a valid email and password.");
    } else {
        localStorage.setItem("ggUser", email);
        $("#signInPassword").val("");
        showSignIn();
    }
});
$("#signOutButton").click(function () {
    localStorage.removeItem("ggUser");
    showSignIn();
});

$(".faq-question").click(function () {
    $(this).next().slideToggle();
    let symbol = $(this).find("span");
    if (symbol.text() === "+") {
        symbol.text("−");
    } else {
        symbol.text("+");
    }
});

$("#steamForm").submit(function (event) {
    event.preventDefault();
    let search = $("#steamSearch").val().trim();
    $("#steamResults").empty();
    if (search === "") {
        $("#steamStatus").text("Enter a game name.");
        return;
    }
    $("#steamStatus").text("Loading Steam games...");
    let url = "https://proxy.cors.dev/https://store.steampowered.com/api/storesearch/?term=" + encodeURIComponent(search) + "&cc=us&l=en";
    fetch(url)
        .then(function (response) {
            if (!response.ok) throw new Error("Request failed");
            return response.json();
        })
        .then(function (data) {
            if (!data.items) throw new Error("No data");
            if (data.items.length === 0) {
                $("#steamStatus").text("No games found.");
                return;
            }
            $("#steamStatus").text("Steam results: " + data.items.length);
            for (let i = 0; i < data.items.length; i++) {
                let game = data.items[i];
                let card = $("<div class='card'>");
                card.append($("<h3>").text(game.name));
                if (game.tiny_image) card.append($("<img>").attr("src", game.tiny_image).attr("alt", game.name));
                if (game.price && game.price.final_formatted) card.append($("<p>").text(game.price.final_formatted));
                card.append($("<a>").attr("href", "https://store.steampowered.com/app/" + game.id).text("View on Steam"));
                $("#steamResults").append(card);
            }
        })
        .catch(function () {
            $("#steamStatus").text("Could not load Steam games. Try again later.");
        });
});