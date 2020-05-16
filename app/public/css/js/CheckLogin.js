$(function() { //when any pages starts except login page and register page, check whether the user has logged in or not 
    if (localStorage.hasOwnProperty("token") === false) { // if localstorage has no token, implies haven't logged in yet
        alert("Please sign in first.");  //tells user to login forst
        location.replace("Login.html"); // redirect users to login page
    }
});
