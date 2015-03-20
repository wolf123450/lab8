$(document).ready(function(){
  var jobj;
  $("button#addComment").click(function(){
    var myobj = {Name:$("#Name").val(),Comment:$("#Comment").val()};
    jobj = JSON.stringify(myobj);
    $("#json").text(jobj);
    var posturl = "http://ninjabrawl.me/comment";
    // $.post(posturl,jobj,function(data,textStatus) {
    //   $("#done").append(textStatus);
    // });
    jQuery.ajax ({
            url: posturl,
            type: "POST",
            data: jobj,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(){
              $("#done").append("Success");
            }
        });
  });
  $("button#show").click(function() {
    var geturl = "http://ninjabrawl.me/comment"
    $.getJSON(geturl, function(data) {
      var everything;
      everything = "<ul>";
      $.each(data, function(i, item) {
        everything += "<li> Name: " + data[i].Name + " Comment: " + data[i].Comment;
      });
      everything += "</ul>";
      $("#currentComments").html(everything);
    });
  });
});