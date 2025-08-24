function login(){
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  let role = "";

  if(user === "admin" && pass === "1234"){
    role = "admin";
  } else if(user === "atendente" && pass === "5678"){
    role = "atendente";
  } else {
    document.getElementById("error").innerText = "Usuário ou senha incorretos!";
    return;
  }

  localStorage.setItem("userRole", role);
  window.location.href = "dashboard.html";
}