var interval = null;
var conversationID;
$(document).ready(function() {

    $("#tForm").submit(function(evt) {
        evt.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/api',
            data: $("#tForm").serialize(),
            success: function(data) {
                //do something with the data via front-end framework
                //location.reload();

                $("#output").prepend(data);
            }
        }); //end ajax post
        interval = setInterval(updateData, 1000);

    });

    // set app status to false

    var response;

    function request() {
        if (response == true) {
            // This makes it unable to send a new request
            // unless you get response from last request
            response = false;
            var req = $.ajax({
                type: "POST",
                url: "/api",
                data: $("#tForm").serialize(),
                success: function(data) {
                    $("#output").prepend(data);
                    response = true;
                }


            });

            // setTimeout(request(), 1000);
        }
    }



    var $output = $("#output");
    var formStatus = false;

    function checkForm() {

        var twilioSID = $("#accountSID").val();
        var authToken = $("#authToken").val();
        var callFrom = $("#callFrom").val();
        var callTo = $("#callTo").val();
        var x = 0;

        if (twilioSID == "") {
            $output.prepend('<p class="output invalid">Twilio SID nu este prezent</p>')
        } else {
            $output.prepend('<p class="output valid">Twilio SID este prezent:  ' + twilioSID + '</p>')
            x += 1;
        } //end Twilio SID

        if (authToken == "") {
            $output.prepend('<p class="output invalid">Auth Token nu este prezent</p>')
        } else {
            $output.prepend('<p class="output valid">Auth Token este prezent:  ' + authToken + '</p>')
            x += 1;
        } //end auth token

        if (callFrom == "") {
            $output.prepend('<p class="output invalid">Trebuie sa incarci numere care for fi folosite sa suni ! Trebuiesc intruse in formatul urmator: +16175551212, (plus inainte de numar si virgula dupa numar)</p>')
        } else {
            $output.prepend('<p class="output valid">Numere Twilio au fost incarcate</p>')
            x += 1;
        } //end call from

        if (callTo == "") {
            $output.prepend('<p class="output invalid">Trebuie sa incarci numere care vor fi sunate ! Trebuiesc intruse in formatul urmator: +16175551212, (plus inainte de numar si virgula dupa numar)</p>')
        } else {
            $output.prepend('<p class="output valid">Numere pentru apelat au fost incarcate</p>')
            x += 1;
        }
        if (x === 4) {
            formStatus = true;
            $output.prepend('<p class="output start">Aplicatia a pornit</p>')
            $(".start").css("color", "blue")
        } else {
            $output.prepend('<p class="output invalid">Aplicatia nu a poate fi pornita te rog sa verifici informatiile introduse</p>')
        }
    } // end check form function

    $("#clearInterval").click(function() {
        clearInterval(interval);
        $("#output").prepend('<p class="output invalid">Am oprit consola !</p>')
    }); //end clear interval
    $("#clearOutput").click(function() {
        $("#output").html('<p class="output valid">Am golit consola !</p>')
        formStatus = false;

    }); // end click event

    $("#appStatus").click(function() {
        if ($(this).val() == "off") {

            $(this).val("on");
            $("#output").prepend('<p class="output valid">Auto-Repeat: ON !</p>')
        } else if ($(this).val() == "on") {

            $(this).val("off");

            $.ajax({
                type: 'POST',
                url: '/stop',
                data: {
                    "appStatus": "stop"
                },
                success: function(data) {
                    $("#output").prepend('<p class="output invalid">Auto-Repeat: OFF !</p>')
                }
            }); //end ajax
        }; //end elseif
    }); // end appStatus


    function updateData() {
        $.ajax({
            type: 'POST',
            url: '/getdata',
            data: 'getdata',
            dataType: "json",
            success: function(data) {
              var oldcontent = $("#uniqueID").html();
              if ( oldcontent !== data.callId ) {
                $("#output").prepend('<p class="output invalid">' + 'Numar apelat: ' + data.calledNumber + ' - ' + ' Durata apel: ' + data.duration + ' - ' + ' Cost total: ' + data.totalCost + ' - ' + ' Robot: ' + data.machine + '</p>');
                $("#uniqueID").html(data.callId);
              }; //end if
            }
        }); //end ajax
    }; //end checkData


}); // end document ready function
