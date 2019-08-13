var laptop_id = sessionStorage.getItem("laptop_id");

if (laptop_id === "L000") {
  document.getElementById("buttonVerify").disabled = true;
  sessionStorage.clear();
}

var p = document.getElementById("laptop");
p.innerHTML = laptop_id;

function redirectToIndex() {
  window.location = "../../index.html";
}