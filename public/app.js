let equipos = [];
let gruposGlobal = {};
let partidosGlobal = [];

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

  gruposGlobal = grupos;

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

  generarFixture();

}

function generarFixture(){

  const fixtureContainer =
    document.getElementById("fixtureContainer");

  fixtureContainer.innerHTML = "";

  partidosGlobal = [];

  for(let grupo in gruposGlobal){

    const equiposGrupo = gruposGlobal[grupo];

    const div = document.createElement("div");

    div.classList.add("grupo");

    let partidosHTML = "";

    for(let i = 0; i < equiposGrupo.length; i++){

      for(let j = i + 1; j < equiposGrupo.length; j++){

        partidosGlobal.push({
          grupo,
          local:equiposGrupo[i],
          visitante:equiposGrupo[j],
          puntosLocal:0,
          puntosVisitante:0
        });

        partidosHTML += `
          <li style="margin-bottom:15px;">

            🏐 ${equiposGrupo[i]}
            vs
            ${equiposGrupo[j]}

            <br><br>

            <input
              type="number"
              id="local-${grupo}-${i}-${j}"
              placeholder="25"
              style="width:70px;"
            >

            <input
              type="number"
              id="visitante-${grupo}-${i}-${j}"
              placeholder="18"
              style="width:70px;"
            >

            <button onclick="
              guardarResultado(
                '${equiposGrupo[i]}',
                '${equiposGrupo[j]}',
                'local-${grupo}-${i}-${j}',
                'visitante-${grupo}-${i}-${j}'
              )
            ">
              Guardar
            </button>

          </li>
        `;

      }

    }

    div.innerHTML = `
      <h3>
        Fixture Grupo ${grupo}
      </h3>

      <ul>
        ${partidosHTML}
      </ul>
    `;

    fixtureContainer.appendChild(div);

  }

  generarTabla();

}

function guardarResultado(
  local,
  visitante,
  inputLocalId,
  inputVisitanteId
){

  const puntosLocal =
    parseInt(
      document.getElementById(inputLocalId).value
    );

  const puntosVisitante =
    parseInt(
      document.getElementById(inputVisitanteId).value
    );

  if(
    isNaN(puntosLocal) ||
    isNaN(puntosVisitante)
  ){
    alert("Ingresa los marcadores");
    return;
  }

  const partido =
    partidosGlobal.find((p)=>
      p.local === local &&
      p.visitante === visitante
    );

  if(!partido){
    alert("Partido no encontrado");
    return;
  }

  partido.puntosLocal = puntosLocal;
  partido.puntosVisitante = puntosVisitante;

  generarTabla();

}

function generarTabla(){

  const tablaContainer =
    document.getElementById("tablaContainer");

  if(!tablaContainer){
    return;
  }

  tablaContainer.innerHTML = "";

  let tabla = {};

  equipos.forEach((equipo)=>{

    tabla[equipo] = {
      pj:0,
      pg:0,
      pp:0,
      pts:0
    };

  });

  partidosGlobal.forEach((partido)=>{

    if(
      partido.puntosLocal === 0 &&
      partido.puntosVisitante === 0
    ){
      return;
    }

    tabla[partido.local].pj++;
    tabla[partido.visitante].pj++;

    if(partido.puntosLocal > partido.puntosVisitante){

      tabla[partido.local].pg++;
      tabla[partido.local].pts += 2;

      tabla[partido.visitante].pp++;
      tabla[partido.visitante].pts += 1;

    }else{

      tabla[partido.visitante].pg++;
      tabla[partido.visitante].pts += 2;

      tabla[partido.local].pp++;
      tabla[partido.local].pts += 1;

    }

  });

  let html = `
    <table style="
      width:100%;
      border-collapse:collapse;
      background:white;
    ">
      <tr>
        <th>Equipo</th>
        <th>PJ</th>
        <th>PG</th>
        <th>PP</th>
        <th>PTS</th>
      </tr>
  `;

  for(let equipo in tabla){

    html += `
      <tr>
        <td>${equipo}</td>
        <td>${tabla[equipo].pj}</td>
        <td>${tabla[equipo].pg}</td>
        <td>${tabla[equipo].pp}</td>
        <td>${tabla[equipo].pts}</td>
      </tr>
    `;

  }

  html += "</table>";

  tablaContainer.innerHTML = html;

}

cargarEquipos();