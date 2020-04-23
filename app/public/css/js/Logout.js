$(function() {
    $("#logoutbtn").click(function() {
        if (localStorage.hasOwnProperty("token") === false)
            alert("you didn't log in yet!");
        else
            localStorage.removeItem("token");
        location.replace("Login.html");
    });
});
