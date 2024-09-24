$(document).ready(function () {
    let phoneNumber = '';
    let timerInterval;
    let existingТumber = "+7-996-335-92-00"


    $("#phone").mask("+7-999-999-99-99");

    function checkGetCodeButton() {
        phoneNumber = $("#phone").val();
        if (phoneNumber.length === 16 && phoneNumber.match(/^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/)) {
            $("#get-code-btn").removeClass("disabled-btn");
        }
        else {
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

    function showRegistrationForm() {
        $("#code-input-section").hide();
        $(".form-section-registration").show();
        $(".form-section-registration #phone").val(phoneNumber).addClass('filled-input');
    }

    $("#get-code-btn").click(function () {
        if (!$(this).hasClass("disabled-btn")) {
            phoneNumber = $("#phone").val();
            $("#phone-input-section").hide();
            $("#code-input-section").show();
            $("#entered-phone").text(phoneNumber);
            startTimer();
        }
    });

    $("#confirm-btn").click(function () {
        if (!$(this).hasClass("disabled-btn")) {
            let code = $("#sms-code").val();
            showRegistrationForm();
        }
    });

    $("#resend-code").click(function (e) {
        e.preventDefault();
        $("#resend-code").hide();
        $("#code-resend-message").show();
        startTimer();
    });

    $("#phone").on("keyup", checkGetCodeButton);

    $("#sms-code").on("keyup", checkConfirmButton);

    function startTimer() {
        let timeLeft = 60;
        $("#timer").text("01:00");
        $("#code-resend-message").show();

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
                $("#code-resend-message").hide();
                $("#resend-code").show();
            }
        }, 1000);
    }
    $('.password-toggle').click(function () {
        const targetId = $(this).data('target');
        const passwordInput = $('#' + targetId);
        const eyeClosedIcon = $(this).find('.eye-closed');
        const eyeOpenIcon = $(this).find('.eye-open');

        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            eyeClosedIcon.hide();
            eyeOpenIcon.show();
        } else {
            passwordInput.attr('type', 'password');
            eyeClosedIcon.show();
            eyeOpenIcon.hide();
        }
    });

    $('.back').click(function () {
        $('#code-input-section').hide();
        $('#phone-input-section').show();
    });

    function checkAllFields() {
        const email = $('#email').val().trim();
        const name = $('#name').val().trim();
        const password = $('#password').val();
        const repeatPassword = $('#repeat-password').val();
        const checked = $('#checked').is(":checked");

        // Password validation
        // const isEnglishOnly = /^[A-Za-z0-9]*$/.test(password);
        // const isLongEnough = password.length >= 8;
        // const passwordsMatch = password === repeatPassword;

        if (email && name && password && repeatPassword && checked) {
            $('.button-big').removeClass('disabled-btn');
        } else {
            $('.button-big').addClass('disabled-btn');
        }
    }

    $('#email, #name, #password, #repeat-password').on('input', checkAllFields);
    $('#checked').on('change', checkAllFields);


});