let apiUrl = "https://devserv.rsexpertiza.ru/";

$(document).ready(function () {
  let phoneNumber = "";
  let code = "";
  let timerInterval;
  $("#phone").mask("+7-999-999-99-99");

  function checkGetCodeButton() {
    let maskedPhone = $("#phone").val() || "";
    phoneNumber = maskedPhone.replace(/[-+]/g, "");

    if (
      maskedPhone != "" &&
      maskedPhone.length === 16 &&
      maskedPhone.match(/^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/)
    ) {
      fetch(`${apiUrl}api/auth/verify?phone=${phoneNumber}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            $("#get-code-btn").removeClass("disabled-btn");
          } else {
            console.log("Error:", response.status);
            $("#get-code-btn").addClass("disabled-btn");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  function checkConfirmButton() {
    code = $("#sms-code").val();
    if (code.length === 4 && code.length != 0) {
      fetch(`${apiUrl}api/auth/sms-confirm?code=${code}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            $("#confirm-btn").removeClass("disabled-btn");
          } else {
            console.log("Error:", response.status);
            $("#confirm-btn").addClass("disabled-btn");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  function showRegistrationForm() {
    $("#code-input-section").hide();
    $(".form-section-registration").show();
    $(".form-section-registration #phone")
      .val(phoneNumber)
      .addClass("filled-input");
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
        (minutes < 10 ? "0" : "") +
          minutes +
          ":" +
          (seconds < 10 ? "0" : "") +
          seconds
      );

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        $("#code-resend-message").hide();
        $("#resend-code").show();
      }
    }, 1000);
  }
  $(".password-toggle").click(function () {
    const targetId = $(this).data("target");
    const passwordInput = $("#" + targetId);
    const eyeClosedIcon = $(this).find(".eye-closed");
    const eyeOpenIcon = $(this).find(".eye-open");

    if (passwordInput.attr("type") === "password") {
      passwordInput.attr("type", "text");
      eyeClosedIcon.hide();
      eyeOpenIcon.show();
    } else {
      passwordInput.attr("type", "password");
      eyeClosedIcon.show();
      eyeOpenIcon.hide();
    }
  });

  $(".back").click(function () {
    $("#code-input-section").hide();
    $("#phone-input-section").show();
  });

  function checkAllFields() {
    const email = $("#registration #email").val().trim();
    const name = $("#registration #name").val().trim();
    const password = $("#registration #password").val();
    const repeatPassword = $("#registration #repeat-password").val();
    const checked = $("#registration #checked").is(":checked");
    if (
      email &&
      name &&
      password &&
      repeatPassword &&
      checked &&
      password === repeatPassword
    ) {
      $(".button-big").removeClass("disabled-btn");
      $("#registration").click(() => {
        fetch(`${apiUrl}api/auth/reg`, {
          method: "POST",
          body: JSON.stringify({
            login: email,
            name: name,
            password: password,
            confirm_password: repeatPassword,
            code: code,
            email: email,
            phone: phoneNumber.replace(/[-+]/g, ""),
          }),
        })
          .then((response) => {
            if (response.ok) {
              let link = document.location.href;
              window.location.href = `/account/`;
            } else {
              console.log("Error:", response.status);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    } else {
      $(".button-big").addClass("disabled-btn");
    }
  }

  $(
    " #registration #email,  #registration #name, #registration #password, #registration #repeat-password"
  ).on("input", checkAllFields);
  $("#checked").on("change", checkAllFields);
});

$(document).ready(function () {
  $(".form-section-remove, .removed-pass-messages, .removed-pass").hide();
  $(".form-section-auth").show();

  function checkAuthFields() {
    const email = $("#email").val().trim();
    const password = $("#password-auth").val();
    if (email && password && password.length >= 8) {
      $(".form-section-auth .button-big")
        .removeClass("disabled-btn")
        .prop("disabled", false);
      $("#autorize").on("click", function (event) {
        event.preventDefault();
        fetch(`${apiUrl}api/auth`, {
          method: "POST",
          body: JSON.stringify({
            login: email,
            password: password,
          }),
        })
          .then((response) => {
            if (response.ok) {
              // let link = document.location.href;
              window.location.href = `/account/`;
            } else {
              console.log("Error:", response.status);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    } else {
      $(".form-section-auth .button-big")
        .addClass("disabled-btn")
        .prop("disabled", true);
    }
  }

  $("#email, #password-auth").on("input", checkAuthFields);

  // Password recovery logic
  $(".remove-password").click(function (e) {
    e.preventDefault();
    $(".form-section-auth").hide();
    $(".form-section-remove").show();
  });

  // function checkRecoveryEmail() {
  //   const email = $(".form-section-remove #email2").val().trim();
  //   const button = $(".form-section-remove .button-big");

  //   if (email) {
  //     button.removeClass("disabled-btn").prop("disabled", false);
  //   } else {
  //     button.addClass("disabled-btn").prop("disabled", true);
  //   }
  // }

  // $(".form-section-remove #email2").on("input", checkRecoveryEmail);

  // checkRecoveryEmail();

  // $(".form-section-remove .button-big").click(function (e) {
  //   e.preventDefault();
  //   if (!$(this).hasClass("disabled-btn")) {
  //     $(".form-section-remove").hide();
  //     $(".removed-pass").show();
  //   }
  // });

  // function checkNewPasswords() {
  //   const password = $(".removed-pass #password-removed").val();
  //   const repeatPassword = $(".removed-pass #repeat-password-removed").val();
  //   const button = $(".removed-pass .button-big");

  //   if (password && repeatPassword) {
  //     button.removeClass("disabled-btn").prop("disabled", false);
  //   } else {
  //     button.addClass("disabled-btn").prop("disabled", true);
  //   }
  // }

  // $(
  //   ".removed-pass #password-removed, .removed-pass #repeat-password-removed"
  // ).on("input", checkNewPasswords);

  // // Initial check
  // checkNewPasswords();

  // // Back button functionality
  // $(".back").click(function () {
  //   $(".form-section-remove, .removed-pass").hide();
  //   $(".form-section-auth").show();
  // });
});
