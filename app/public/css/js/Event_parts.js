//

//join event function
function JoinEvent(inputbtn){
	var post_ID = inputbtn.id;
	//alert("The post id is "+ post_ID);
	$.ajax({
			url: 'http://localhost:3000/catalog/post/join',
			type: 'POST',
			dataType: 'json',
			data:{
				postID: post_ID,
				token: localStorage.getItem("token")
			},
			success: function(response){
				alert("You have joined the event! \n Please contact the host via Line to have further details.\n Host's LineID: "+ response.LineID);
			},
			error: function(response){
				alert(response.responseText);
			}
	});
}

  //show host
function ShowHostInfo(id){
  document.getElementById("ShowHost"+id).classList.toggle("show");
}

  //show participant
function ShowPartiInfo(id){
  document.getElementById("ShowParti"+id).classList.toggle("show");
}

//Display event--------------------------------------------------
$("#update_btn").click(function(){
	alert('Events Updated!');
	$("#post_display").empty();
	let x = document.getElementById("category").value;
	if (x === ""){
		var j = 1;
		var ppl = 0;
		$.getJSON("http://localhost:3000/catalog/post",function(data) {
			if(data.posts.length === 0) console.log("NO Post yet.");
			for (var i = 0; i < data.posts.length ; i++) {
				var input = $('<input type="button" name="join_event" id="' + data.posts[i]._id + '" value="Join" onclick="JoinEvent(this)" class="mdl-button mdl-js-button mdl-button--raised" style="background-color: #48AAAD; float: right;">');
				$("#post_display").prepend("<hr>");
				for (j = ppl; j < (ppl + data.posts[i].NumberOfParticipants) ; j++){
					$("#post_display").prepend("<p>" + (data.postList[i].NumberOfParticipants + ppl - j) + ") UserID: " + data.PartiIDList[j] + "[RP mark: " + data.PartiMarkList[j] + "]</p>");
				}
				ppl = ppl + data.posts[i].NumberOfParticipants;
				$("#post_display").prepend("<p>Participants' Information: </p>");
				$("#post_display").prepend("<p>Host's Information: UserID: " + data.HostIDList[i] + "[RP mark: " + data.HostMarkList[i] + "]</p>");
				$("#post_display").prepend("<h2>" + data.posts[i].Title + "</h2> <p>Category: " + data.posts[i].Category + "</p> <p>Date:" + data.posts[i].Date + " </p> <p>Venue: " + data.posts[i].Venue + "</p> <p>Quota: " + data.posts[i].Quota + "</p> <p>Number of participant(s): " + data.posts[i].NumberOfParticipants + "</p><p>Detail: " + data.posts[i].Content + "</p>");
				$("#post_display").prepend(input);
			}
		});
	}
	else{
		var j = 1;
		var ppl = 0;
		$.getJSON("http://localhost:3000/catalog/post/"+x,function(data) {
			if(data.postList.length === 0) console.log("NO Post yet.");
			for (var i = 0; i < data.postList.length ; i++) {
				var input = $('<input type="button" name="join_event" id="' + data.postList[i]._id + '" value="Join" onclick="JoinEvent(this)" class="mdl-button mdl-js-button mdl-button--raised" style="background-color: #48AAAD; float: right;">');
				$("#post_display").prepend("<hr>");
				for (j = ppl; j < ppl + data.postList[i].NumberOfParticipants ; j++){
					$("#post_display").prepend("<p>" + (data.postList[i].NumberOfParticipants + ppl - j) + ") UserID: " + data.PartiIDList[j] + "[RP mark: " + data.PartiMarkList[j] + "]</p>");
				}
				ppl = ppl + data.postList[i].NumberOfParticipants;
				$("#post_display").prepend("<p>Participants' Information: </p>");
				$("#post_display").prepend("<p>Host's Information: UserID: " + data.HostIDList[i] + "[RP mark: " + data.HostMarkList[i] + "]</p>");
				$("#post_display").prepend("<h2>" + data.postList[i].Title + "</h2> <p>Category: " + data.postList[i].Category + "</p> <p>Date:" + data.postList[i].Date + " </p> <p>Venue: " + data.postList[i].Venue + "</p> <p>Quota: " + data.postList[i].Quota + "</p> <p>Number of participant(s): " + data.postList[i].NumberOfParticipants + "</p><p>Detail: " + data.postList[i].Content + "</p>");
				$("#post_display").prepend(input);
			}
		});
	}
	
});



//Create Event--------------------------------------------------------------------------
$( "#create" ).submit( function (){
    //alert("created");
    var title = $.trim($('#event_name').val());
    var venue = $.trim($('#venue').val());
    var date = $.trim($('#date').val());
    var category = $.trim($('#category').val());
    var start = $.trim($('#start_time').val());
    var end = $.trim($('#end_time').val());
    var tar = $.trim($('#target').val());
    var quota = $.trim($('#quota').val());
    var content = $.trim($('#describe').val());
    var line_ID;
            // $.getJSON("http://localhost:3000/catalog/member/myself", function(member){
            //     line_ID = member.LineID;
            //  })

            $.ajax({
                url: 'http://localhost:3000/catalog/post/create',
                type: 'POST',
                dataType: 'json',
                data: {
                    Title: title,
                    Category: category,
                    Quota: quota,
                    StartTime: start,
                    EndTime: end,
                    Date: date,
		    Content: content,
                    Venue: venue,
		    token: localStorage.getItem("token")

                },
                success: function(response){
                    alert("Event Created!");
	            window.location.href = "index.html";
                },
		error: function(response){
		    alert(response.responseText);
	            window.location.href = "newevent.html";	
		}
            })
});


//Quit Event-------------------------------------------------------------
$("#quit_event").click(function(){

	$.ajax({
		url: 'http://localhost:3000/catalog/post/quit',
		type: 'POST',
		dataType: 'json',
		data: {
			token: localStorage.getItem("token")
		},
		success: function(response){
			alert("You have quit the event.");
	                window.location.href = "Myself.html";
		},
		error: function(response){
			alert(response.responseText);
		}
	});
});



//Delete Event------------------------------------------------------------
$("#delete_event").click(function(){

	$.ajax({
		url: 'http://localhost:3000/catalog/post/delete',
		type: 'POST',
		dataType: 'json',
		data: {
			token: localStorage.getItem("token")
		},
		success: function(response){
			alert("You have dismissed the event.");
	                window.location.href = "Myself.html";
		},
		error: function(response){
			alert(response.responseText);
		}
	});

});
