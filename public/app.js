async function cargarEquipos() {

  const res = await fetch("/api/equipos");
  const equipos = await res.json();

  const lista = document.getElementById("listaEquipos");

  lista.innerHTML = "";

  equipos.forEach((equipo) => {

    const li = document.createElement("li");
    li.textContent = equipo;

    lista.appendChild(li);

  });
}

async function agregarEquipo() {

  const input = document.getElementById("equipoInput");

  const nombre = input.value.trim();

  if(nombre === ""){
    alert("Escribe un nombre");
    return;
  }

  await fetch("/api/equipos", {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      nombre
    })
  });

  input.value = "";

  cargarEquipos();
}

cargarEquipos();