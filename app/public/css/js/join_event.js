	
//join event

    $(".join").click(function (){

		var post_ID = this.id;
		alert("The post id is "+ post_ID);
		var participant;

		$.getJSON("http://localhost:3000/catalog/post/", function(event){
			participant = event.NumberOfParticipants;
		})

    	$.ajax({
    		url: 'http://localhost:3000/catalog/post/join/',
    		type: 'POST',
    		dataType: 'json',
    		data: {
    			NumberOfParticipants: participant + 1
    		},
    		// .done(function (html){
    		// 	alert("Done");
    		// });
    		success: function(data){
    			$.getJSON("http://localhost:3000/catalog/post/"+ post_ID, function(host){
    				alert("Joined!");
    				alert("Please contact the host via Line: "+ host.LineID);
    			});
    			$.getJSON("http://localhost:3000/catalog/member/myself", function(member){
    				$.ajax({
    					url: '/member/myself',
    					type: 'POST',
    					dataType: 'json',
    					data: {
    						Username: member.Username,
    						UserID: member.UserID,
    						RPmark: member.RPmark,
    						JoinedPost: post_ID
    					},
    				});
    			})
    			

    		}
    	});


	});