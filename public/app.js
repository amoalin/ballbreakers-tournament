let equipos = [];

async function cargarEquipos(){

  const res = await fetch("/api/equipos");

  equipos = await res.json();

  mostrarEquipos();
}

function mostrarEquipos(){

  const lista = document.getElementById("listaEquipos");

  lista.innerHTML = "";

  equipos.forEach((equipo)=>{

    const li = document.createElement("li");

    li.textContent = equipo;

    lista.appendChild(li);

  });
}

async function agregarEquipo(){

  const input = document.getElementById("equipoInput");

  const nombre = input.value.trim();

  if(nombre === ""){
    alert("Escribe un nombre");
    return;
  }

  await fetch("/api/equipos",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      nombre
    })
  });

  input.value = "";

  cargarEquipos();
}

function generarGrupos(){

  const gruposContainer =
    document.getElementById("gruposContainer");

  gruposContainer.innerHTML = "";

  if(equipos.length < 4){
    alert("Necesitas mínimo 4 equipos");
    return;
  }

  let mezcla = [...equipos];

  mezcla.sort(()=>Math.random()-0.5);

  const grupos = {
    A:[],
    B:[]
  };

  mezcla.forEach((equipo,index)=>{

    if(index % 2 === 0){
      grupos.A.push(equipo);
    }else{
      grupos.B.push(equipo);
    }

  });

  for(let letra in grupos){

    const div = document.createElement("div");

    div.classList.add("grupo");

    div.innerHTML = `
      <h3>Grupo ${letra}</h3>
      <ul>
        ${grupos[letra]
          .map(eq=>`<li>${eq}</li>`)
          .join("")}
      </ul>
    `;

    gruposContainer.appendChild(div);

  }
}

cargarEquipos();