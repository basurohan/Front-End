function retrieveQuote() {
    $.ajax({
        type: "GET",
        url: "https://random-quote-generator.herokuapp.com/api/quotes/random",
        success: function(response){
            var obj = response;
            $("#author").html(obj.author);
            $("#displayQuote").html(obj.quote);               
            var share = "https://twitter.com/intent/tweet?text=" + obj.quote;
            $("#tweet").attr("href", share);
        }
    });

}

retrieveQuote();

$(document).ready(function() {
    $("#getQuote").on("click", function(e) {
        e.preventDefault();
        retrieveQuote(); 
    });
});