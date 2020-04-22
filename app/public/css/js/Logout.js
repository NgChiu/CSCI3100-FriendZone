$(document).ready(function () {
    $("#logoutbtn").click(function() {
        alert("you try to log out!");
        if (localStorage.hasOwnProperty("token") === false)
            alert("you didn't log in yet!");
        else
            localStorage.removeItem("token");
        window.location.href = "Login.html";
    })
});
