//

//Display event--------------------------------------------------
$("#update_btn").click(function(){
	alert('Events Updated!');
	$("#post_display").empty();
	let x = document.getElementById("category").value;
	if (x === ""){
		$.getJSON("/post",function(data) {
			for (var i = 0; i < data.length ; i++) {
				var input = $('<input type="button" name="join_event" id="' + data[i]._id + '" value="Join" class="mdl-button mdl-js-button mdl-button--raised" style="background-color: #48AAAD; float: right;">');
				$("#post_display").prepend("<h2>" + data[i].Title + "</h2> <p>Category: " + data[i].category + "</p> <p>Date:" + data[i].Date + " </p> <p>Venue: " + data[i].Venue + "</p> <p>Quota: " + data[i].Quota + "</p> <p>Number of participant(s): " + data[i].NumberOfParticipants + "</p><p>Detail: " + data[i].content + "</p><hr>");
				$("#post_display").prepend(input);
			}
		});
	}
	else{
		$.getJSON("/post/"+x,function(data) { 
			for (var i = 0; i < data.length ; i++) {
				var input = $('<input type="button" name="join_event" id="' + data[i]._id + '" value="Join" class="mdl-button mdl-js-button mdl-button--raised" style="background-color: #48AAAD; float: right;">');
				$("#post_display").prepend("<h2>" + data[i].Title + "</h2> <p>Category: " + data[i].category + "</p> <p>Date:" + data[i].Date + " </p> <p>Venue: " + data[i].Venue + "</p> <p>Quota: " + data[i].Quota + "</p> <p>Number of participant(s): " + data[i].NumberOfParticipants + "</p><p>Detail: " + data[i].content + "</p><hr>");
				$("#post_display").prepend(input);
			}
		});
	}
	
	
	//join event
	$("input[name= 'join_event']").click(function (){
		var post_ID = this.id;
		var participant;
		$.getJSON("/post/"+ post_ID, function(event){
			participant = event.NumberOfParticipants;
		})

    		$.ajax({
    			url: '/post/join/'+ post_ID,
    			type: 'POST',
    			dataType: 'json',
    			data: JSON.stringify({
    				NumberOfParticipants: participant + 1
    			}),
    			// .done(function (html){
    			// 	alert("Done");
    			// });
    			success: function(data){
    				$.getJSON("/post/join/"+ post_ID, function(host){
    					alert("Joined!");
    					alert("Please contact the host via Line: "+ host.LineID);
    				});
    				$.getJSON("member/myself", function(member){
    					$.ajax({
    						url: '/member/myself',
    						type: 'POST',
    						dataType: 'json',
    						data: JSON.stringify({
    							Username: member.Username,
    							UserID: member.UserID,
    							RPmark: member.RPmark,
    							JoinedPost: post_ID
    						}),
    					});
    				})
    			

    			}
    		});


	});
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
    		$.getJSON("/member/myself", function(member){
			line_ID = member.LineID;
		})

        	$.ajax({
    			url: '/post/create',
    			type: 'POST',
    			dataType: 'json',
    			data: JSON.stringify({
    				Title: title,
    				Category: category,
    				Quota: quota,
    				Content: content,
    				StartTime: start,
    				EndTime: end,
    				Date: date,
    				Venue: venue,
    				NumberOfParticipants: 0,
    				LineID: line_ID
    			}),
    			success: function(data){
    				alert("Event Created!");
    			}
    		})
});
