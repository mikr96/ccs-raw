// const url = "https://ccs.cyrix.my/CCS-API/";

$('form#login').submit(async function (e) {
  e.preventDefault()
const url = "https://cyrixmy-api.herokuapp.com/";
  var formData = JSON.stringify({
    username: $("#username").val(),
    password: $("#password").val()
  });

  try {
    const loginResponse = await fetch(url + "login", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      body: formData
    });

    const success = await loginResponse.json();

    if (success.status === 1) {
      Swal.fire({
        title: "Login Success",
        text: "Welcome back",
        type: "success"
      }).then(result => {
        sessionStorage.setItem("profile", JSON.stringify(success));
        sessionStorage.setItem("role", success.role);
        sessionStorage.setItem("token", success.token);
        sessionStorage.setItem("laptop_id", success.laptop_id);
        if (result.value) {
          if (success.role == "admin" || success.role == "supervisor") {
            window.location.href = "../../index.html";
          } else {
            window.location.href = "page-verify.html";
          }
        }
      });
    } else {
      Swal.fire({
        title: "Authentication Failed",
        text: "Please re-assign your username and password",
        type: "error"
      });
    }
  } catch (err) {
    Swal.fire("Something went wrong", err.message, "error");
  }
})