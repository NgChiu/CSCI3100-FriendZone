$(function() {
    if (localStorage.hasOwnProperty("token") === false && location.href !== "Login.html") {
        alert("Please sign in first.");
        location.replace("Login.html");
    }
});