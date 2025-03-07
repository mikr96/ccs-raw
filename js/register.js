//Registration form
const url = "https://ccs.cyrix.my/CCS-API/";
async function registration() {
  event.preventDefault(); //prevent redirect/page refresh

  var formData = JSON.stringify({
    fullname: $("#fullname").val(),
    username: $("#username").val(),
    password: $("#password").val(),
    gender: $("#gender").val(),
    race: $("#race").val(),
    age: $("#age").val(),
    role: "operator",
    laptop_id: "L000",
    region: "undefined"
  });

  try {
    const accountCreate = await fetch(url + "registration", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache'
      },
      body: formData
    });

    const created = await accountCreate.json();

    if (created.insertstatus) {
      Swal.fire({
        title: "Congratulation",
        text: "Successfully Created",
        type: "success"
      }).then(result => {
        if (result.value) {
          window.location.href = "page-login.html";
        }
      });
    } else {
      Swal.fire({
        title: "Fail",
        text: "Please refill the registration form",
        type: "error"
      });
    }
  } catch (err) {
    Swal.fire("Something went wrong", err.message, "error");
  }
}