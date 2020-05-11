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
	                	window.location.href = "index.html";
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
		var ppl = 0;
		$.getJSON("http://localhost:3000/catalog/post",function(data) {
      		if (data.posts.length == 0)
          		$("#post_display").append("<strong>No post is available yet.</strong>");
        	var cnt_mod = data.posts.length % 2;
        	var cnt_set = data.posts.length / 2;
        	var PartiInfo_ID = 0;
        	var HostInfo_ID = 0;
        	var i = 0;
        	if (cnt_mod == 1){

          		$("#post_display").prepend('<div class="row"><div class="col-sm-6"><div class="mdl-shadow--2dp card"><div class="card-body"><h5 class="card-title">' + data.posts[i].Title + '</h5><p class="card-text">Category: '+ data.posts[i].Category +'</p><p class="card-text">Date: '+ data.posts[i].Date +'</p><p class="card-text">Venue: '+ data.posts[i].Venue +'</p><p class="card-text">Quota: '+ data.posts[i].Quota +'</p><p class="card-text">Number of participant(s): '+ data.posts[i].NumberOfParticipants +'</p><p class="card-text">Detail: '+ data.posts[i].Content +'</p><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowHostInfo('+HostInfo_ID+')" style="margin:10px;">Show Host</button><div id="ShowHost'+HostInfo_ID+'" class="dropdown-content"><a>UserID: '+ data.HostIDList[i] +' [RP mark: '+ data.HostMarkList[i] +']</a></div></div><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowPartiInfo('+PartiInfo_ID+')" style="margin:10px;">Show Participants</button><div id="ShowParti'+PartiInfo_ID+'" class="dropdown-content"></div></div><div class="mdl-card__actions mdl-card--border"><a id="' + data.posts[i]._id + '"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="JoinEvent(this)">Join</a></div></div></div></div></div><br>');

          		for (var j = 0; j < data.posts[i].NumberOfParticipants ; j++){
            		$("#ShowParti"+PartiInfo_ID).append('<a>UserID: '+ data.PartiIDList[ppl] +' [RP mark: '+ data.PartiMarkList[ppl] +']</a>');
            		ppl++;
          		}
          		PartiInfo_ID++;
          		HostInfo_ID++;
          		i++;
        	}


        	for (var z = 0; z < cnt_set; z++){
          		$("#post_display").prepend('<div class="row"><div class="col-sm-6"><div class="mdl-shadow--2dp card"><div class="card-body"><h5 class="card-title">' + data.posts[i].Title + '</h5><p class="card-text">Category: '+ data.posts[i].Category +'</p><p class="card-text">Date: '+ data.posts[i].Date +'</p><p class="card-text">Venue: '+ data.posts[i].Venue +'</p><p class="card-text">Quota: '+ data.posts[i].Quota +'</p><p class="card-text">Number of participant(s): '+ data.posts[i].NumberOfParticipants +'</p><p class="card-text">Detail: '+ data.posts[i].Content +'</p><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowHostInfo('+HostInfo_ID+')" style="margin:10px;">Show Host</button><div id="ShowHost'+HostInfo_ID+'" class="dropdown-content"><a>UserID: '+ data.HostIDList[i] +' [RP mark: '+ data.HostMarkList[i] +']</a></div></div><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowPartiInfo('+PartiInfo_ID+')" style="margin:10px;">Show Participants</button><div id="ShowParti'+PartiInfo_ID+'" class="dropdown-content"></div></div><div class="mdl-card__actions mdl-card--border"><a id="' + data.posts[i]._id + '"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="JoinEvent(this)">Join</a></div></div></div></div><div class="col-sm-6"><div class="mdl-shadow--2dp card"><div class="card-body"><h5 class="card-title">' + data.posts[i+1].Title + '</h5><p class="card-text">Category: '+ data.posts[i+1].Category +'</p><p class="card-text">Date: '+ data.posts[i+1].Date +'</p><p class="card-text">Venue: '+ data.posts[i+1].Venue +'</p><p class="card-text">Quota: '+ data.posts[i+1].Quota +'</p><p class="card-text">Number of participant(s): '+ data.posts[i+1].NumberOfParticipants +'</p><p class="card-text">Detail: '+ data.posts[i+1].Content +'</p><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowHostInfo('+(HostInfo_ID+1)+')" style="margin:10px;">Show Host</button><div id="ShowHost'+(HostInfo_ID+1)+'" class="dropdown-content"><a>UserID: '+ data.HostIDList[i+1] +' [RP mark: '+ data.HostMarkList[i+1] +']</a></div></div><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowPartiInfo('+(PartiInfo_ID+1)+')" style="margin:10px;">Show Participants</button><div id="ShowParti'+(PartiInfo_ID+1)+'" class="dropdown-content"></div></div><div class="mdl-card__actions mdl-card--border"><a id="' + data.posts[i+1]._id + '"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="JoinEvent(this)">Join</a></div></div></div></div></div><br>');
          		
          		for (var j = 0; j < data.posts[i].NumberOfParticipants ; j++){
            		$("#ShowParti"+PartiInfo_ID).append('<a>UserID: '+ data.PartiIDList[ppl] +' [RP mark: '+ data.PartiMarkList[ppl] +']</a>');
            		ppl++;
          		}
          		PartiInfo_ID++;
          		HostInfo_ID++
          		for (var j = 0; j < data.posts[i+1].NumberOfParticipants ; j++){
            		$("#ShowParti"+PartiInfo_ID).append('<a>UserID: '+ data.PartiIDList[ppl] +' [RP mark: '+ data.PartiMarkList[ppl] +']</a>');
            		ppl++;
          		}
          		PartiInfo_ID++;
          		HostInfo_ID++;
          		i = i + 2;
        	}
    	});
	}
	else{
		var ppl = 0;
		$.getJSON("http://localhost:3000/catalog/post/"+x,function(data) {
			if (data.postList.length == 0)
          		$("#post_display").append("<strong>No post is available yet.</strong>");
        	var cnt_mod = data.postList.length % 2;
        	var cnt_set = data.postList.length / 2;
        	var PartiInfo_ID = 0;
        	var HostInfo_ID = 0;
        	var i = 0;
        	if (cnt_mod == 1){

          		$("#post_display").prepend('<div class="row"><div class="col-sm-6"><div class="mdl-shadow--2dp card"><div class="card-body"><h5 class="card-title">' + data.postList[i].Title + '</h5><p class="card-text">Category: '+ data.postList[i].Category +'</p><p class="card-text">Date: '+ data.postList[i].Date +'</p><p class="card-text">Venue: '+ data.postList[i].Venue +'</p><p class="card-text">Quota: '+ data.postList[i].Quota +'</p><p class="card-text">Number of participant(s): '+ data.postList[i].NumberOfParticipants +'</p><p class="card-text">Detail: '+ data.postList[i].Content +'</p><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowHostInfo('+HostInfo_ID+')" style="margin:10px;">Show Host</button><div id="ShowHost'+HostInfo_ID+'" class="dropdown-content"><a>UserID: '+ data.HostIDList[i] +' [RP mark: '+ data.HostMarkList[i] +']</a></div></div><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowPartiInfo('+PartiInfo_ID+')" style="margin:10px;">Show Participants</button><div id="ShowParti'+PartiInfo_ID+'" class="dropdown-content"></div></div><div class="mdl-card__actions mdl-card--border"><a id="' + data.postList[i]._id + '"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="JoinEvent(this)">Join</a></div></div></div></div></div><br>');

          		for (var j = 0; j < data.postList[i].NumberOfParticipants ; j++){
            		$("#ShowParti"+PartiInfo_ID).append('<a>UserID: '+ data.PartiIDList[ppl] +' [RP mark: '+ data.PartiMarkList[ppl] +']</a>');
            		ppl++;
          		}
          		PartiInfo_ID++;
          		HostInfo_ID++;
          		i++;
        	}


        	for (var z = 0; z < cnt_set; z++){
          		$("#post_display").prepend('<div class="row"><div class="col-sm-6"><div class="mdl-shadow--2dp card"><div class="card-body"><h5 class="card-title">' + data.postList[i].Title + '</h5><p class="card-text">Category: '+ data.postList[i].Category +'</p><p class="card-text">Date: '+ data.postList[i].Date +'</p><p class="card-text">Venue: '+ data.postList[i].Venue +'</p><p class="card-text">Quota: '+ data.postList[i].Quota +'</p><p class="card-text">Number of participant(s): '+ data.postList[i].NumberOfParticipants +'</p><p class="card-text">Detail: '+ data.postList[i].Content +'</p><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowHostInfo('+HostInfo_ID+')" style="margin:10px;">Show Host</button><div id="ShowHost'+HostInfo_ID+'" class="dropdown-content"><a>UserID: '+ data.HostIDList[i] +' [RP mark: '+ data.HostMarkList[i] +']</a></div></div><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowPartiInfo('+PartiInfo_ID+')" style="margin:10px;">Show Participants</button><div id="ShowParti'+PartiInfo_ID+'" class="dropdown-content"></div></div><div class="mdl-card__actions mdl-card--border"><a id="' + data.postList[i]._id + '"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="JoinEvent(this)">Join</a></div></div></div></div><div class="col-sm-6"><div class="mdl-shadow--2dp card"><div class="card-body"><h5 class="card-title">' + data.postList[i+1].Title + '</h5><p class="card-text">Category: '+ data.postList[i+1].Category +'</p><p class="card-text">Date: '+ data.postList[i+1].Date +'</p><p class="card-text">Venue: '+ data.postList[i+1].Venue +'</p><p class="card-text">Quota: '+ data.postList[i+1].Quota +'</p><p class="card-text">Number of participant(s): '+ data.postList[i+1].NumberOfParticipants +'</p><p class="card-text">Detail: '+ data.postList[i+1].Content +'</p><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowHostInfo('+(HostInfo_ID+1)+')" style="margin:10px;">Show Host</button><div id="ShowHost'+(HostInfo_ID+1)+'" class="dropdown-content"><a>UserID: '+ data.HostIDList[i+1] +' [RP mark: '+ data.HostMarkList[i+1] +']</a></div></div><div class="dropdown"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect dropbtn" onclick="ShowPartiInfo('+(PartiInfo_ID+1)+')" style="margin:10px;">Show Participants</button><div id="ShowParti'+(PartiInfo_ID+1)+'" class="dropdown-content"></div></div><div class="mdl-card__actions mdl-card--border"><a id="' + data.postList[i+1]._id + '"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="JoinEvent(this)">Join</a></div></div></div></div></div><br>');
          		for (var j = 0; j < data.postList[i].NumberOfParticipants ; j++){
            		$("#ShowParti"+PartiInfo_ID).append('<a>UserID: '+ data.PartiIDList[ppl] +' [RP mark: '+ data.PartiMarkList[ppl] +']</a>');
            		ppl++;
          		}
          		PartiInfo_ID++;
          		HostInfo_ID++
          		for (var j = 0; j < data.postList[i+1].NumberOfParticipants ; j++){
            		$("#ShowParti"+PartiInfo_ID).append('<a>UserID: '+ data.PartiIDList[ppl] +' [RP mark: '+ data.PartiMarkList[ppl] +']</a>');
            		ppl++;
          		}
          		PartiInfo_ID++;
          		HostInfo_ID++;
          		i = i + 2;
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
