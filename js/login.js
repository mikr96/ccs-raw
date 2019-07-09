// const client = new DirectusSDK({
//   url: "http://ccs.cyrix.my/cms/public",
//   project: "_"
// })

// let app = new Vue({
//   el: '#wrapper',
//   data: {
//     email: '',
//     password: ''
//   },
//   methods: {
//     login: async function () {
//       try {
//         const loginResponse = await client
//           .login({
//             url: "http://ccs.cyrix.my/cms/public",
//             project: "_",
//             email: this.email,
//             password: this.password
//           })

//         if (loginResponse) {
//           Swal.fire('Login Success', 'Welcome back', 'success')
//           sessionStorage.setItem("token", loginResponse.token);
//           window.location.href = "../../index.html";

//         }
//       } catch (err) {
//         Swal.fire('Something went wrong', err.message, 'error')
//       }
//     }
//   }
// })
const url = "https://ccs.cyrix.my/CCS-API/";
async function login() {
  event.preventDefault(); //prevent redirect/page refresh
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
    console.log(success);
    if (success.status) {
      Swal.fire({
        title: "Login Success",
        text: "Welcome back",
        type: "success"
      }).then(result => {
        sessionStorage.setItem("token", success.token);
        sessionStorage.setItem("laptop_id", success.laptop_id);
        if (result.value) {
          window.location.href = "page-verify.html";
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
}
