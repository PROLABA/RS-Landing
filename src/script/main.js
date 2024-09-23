$(document).ready(function () {
    let phoneNumber = '';
    let timerInterval;
    let existingPhoneNumbers = [
        "+7-996-335-92-00",
        "+7-999-999-99-99",
    ];


    $("#phone").mask("+7-999-999-99-99");

    function checkGetCodeButton() {
        phoneNumber = $("#phone").val();
        if (phoneNumber.length === 16 && phoneNumber.match(/^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/)) {
            $("#get-code-btn").removeClass("disabled-btn");
        } else {
            $("#get-code-btn").addClass("disabled-btn");
        }
    }

    function checkConfirmButton() {
        let code = $("#sms-code").val();
        if (code.length === 4) {
            $("#confirm-btn").removeClass("disabled-btn");
        } else {
            $("#confirm-btn").addClass("disabled-btn");
        }
    }

    // Handle "Get Code" button click
    $("#get-code-btn").click(function () {
        if (!$(this).hasClass("disabled-btn")) {
            phoneNumber = $("#phone").val();
            $("#phone-input-section").hide();
            $("#code-input-section").show();
            $("#entered-phone").text(phoneNumber);
            startTimer();
        }
    });

    // Handle "Confirm" button click
    $("#confirm-btn").click(function () {
        if (!$(this).hasClass("disabled-btn")) {
            let code = $("#sms-code").val();
            // Here you would typically send this code to your server for verification
            alert("Код подтвержден Регистрация завершена.");
        }
    });

    // Handle "Resend Code" link click
    $("#resend-code").click(function (e) {
        e.preventDefault();
        $("#resend-code").hide(); // Hide the resend button
        $("#code-resend-message").show(); // Show the timer message
        startTimer(); // Restart the timer
    });

    // Check the phone number input field on keyup
    $("#phone").on("keyup", checkGetCodeButton);

    // Check the SMS code input field on keyup
    $("#sms-code").on("keyup", checkConfirmButton);

    function startTimer() {
        let timeLeft = 60;
        $("#timer").text("01:00");
        $("#code-resend-message").show(); // Ensure the message is visible

        clearInterval(timerInterval);
        timerInterval = setInterval(function () {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            $("#timer").text(
                (minutes < 10 ? "0" : "") + minutes + ":" +
                (seconds < 10 ? "0" : "") + seconds
            );

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                $("#code-resend-message").hide(); // Hide the message and timer
                $("#resend-code").show(); // Show the resend button
            }
        }, 1000);
    }
});