const client = new DirectusSDK({
  url: "http://ccs.cyrix.my/cms/public",
  project: "_"
})

let app = new Vue({
  el: '#wrapper',
  data: {
    email: '',
    password: ''
  },
  methods: {
    login: async function () {
      try {
        const loginResponse = await client
          .login({
            url: "http://ccs.cyrix.my/cms/public",
            project: "_",
            email: this.email,
            password: this.password
          })

        if (loginResponse) {
          Swal.fire('Login Success', 'Welcome back', 'success')
          sessionStorage.setItem("token", loginResponse.token);
          window.location.href = "../../index.html";

        }
      } catch (err) {
        Swal.fire('Something went wrong', err.message, 'error')
      }
    }
  }
})
