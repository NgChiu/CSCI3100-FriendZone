$(function() {//logout function
    $("#logoutbtn").click(function() { //when sign out button is clicked
        if (localStorage.hasOwnProperty("token") === false) //if user has not logged in yet
            alert("you didn't log in yet!"); //show message
        else
            localStorage.removeItem("token"); //else remove token from localstorage
        location.replace("Login.html");  //redirect to Login page
    });
});
