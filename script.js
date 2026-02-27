const datos = {
    "Sillas": { "Oficina": 8, "Comedor": 10 },
    "Mesas": { "Rectangular": 4, "Redonda": 2 },
    "Butacos": { "Barra": 5 },
    "Sofas": { "3 Puestos": 1 }
};

const ciudades = { "Medellin": 40000, "Bogota": 50000, "Cali": 45000 };
let listaEnvios = [];

// Poblar desplegables
function actualizarProductos() {
    const cat = document.getElementById('categoria').value;
    const prodSelect = document.getElementById('producto');
    prodSelect.innerHTML = "";
    Object.keys(datos[cat]).forEach(item => {
        prodSelect.innerHTML += `<option value="${item}">${item}</option>`;
    });
}

function agregarAlCarrito() {
    const cat = document.getElementById('categoria').value;
    const prod = document.getElementById('producto').value;
    const cant = parseInt(document.getElementById('cantidad').value);
    const divisor = datos[cat][prod];
    const paquetes = Math.ceil(cant / divisor);
    
    listaEnvios.push({ prod, cant, paquetes });
    
    const tbody = document.querySelector("#tablaEnvios tbody");
    tbody.innerHTML += `<tr><td>${prod}</td><td>${cant}</td><td>${paquetes}</td></tr>`;
}

function calcularTotal() {
    const ciudad = document.getElementById('ciudad').value;
    const totalPaquetes = listaEnvios.reduce((acc, item) => acc + item.paquetes, 0);
    const total = totalPaquetes * ciudades[ciudad];
    document.getElementById('resultado').innerText = `Total: $${total.toLocaleString()}`;
}

// Inicializar
window.onload = () => {
    actualizarProductos();
    const ciuSelect = document.getElementById('ciudad');
    Object.keys(ciudades).forEach(c => ciuSelect.innerHTML += `<option value="${c}">${c}</option>`);
};