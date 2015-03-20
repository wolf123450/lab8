$("#button").click(function(e) {
			var value = $("#cityField").val();
			$("#dispCity").text(value);
			var api = "https://api.wunderground.com/api/0621c3021e9f1f0f/geolookup/conditions/q/UT/";
			api += value;
			api += ".json"
			$.getJSON(api, function(data){
				var all = "Current Weather <ul>";
				all += "<li> Location: " + data.location.city + "</li>";
				all += "<li> Temperature: " + data.current_observation.temp_f + "</li>";
				all += "<li> Weather: " + data.current_observation.weather + "</li>";
				all += "</ul>";
				$("#weather").html(all);
				console.log(data);
			});
			e.preventDefault();
		});
		$("#cityField").keyup(function () {
			var url = "http://ninjabrawl.me/getcity?q=";
			url += $("#cityField").val();
			console.log(url);
			$.getJSON(url,function(data) {
				var everything = "<ul>";
				$.each(data, function(i,item) {
					everything += "<li> " + item.city + "</li>";
				});
				$("#txtHint").html(everything);
				console.log(data);
				console.log("got "+data[0].city);
			
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				console.log("Status: "+textStatus);
				console.log("content: "+jqXHR.responseText);
				console.log(errorThrown);
			})
			.done(function(){
				console.log("Done");
			});
			$("#txtHint").text($("#cityField").val());
		});