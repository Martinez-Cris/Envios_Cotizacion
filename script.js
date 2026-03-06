/* ==========================================================================
   CONFIGURACIÓN INICIAL Y DATOS
   ========================================================================== */

// Definición de divisores por producto
const datos = {
    "Sillas": { "karla/4tubos": 8, "Eva S.B/C.B": 8, "MonoPieza": 5, "Rustica": 4 },
    "Mesas": { "90x60cm H": 4, "60cm Cruceta": 4, "90x60cm y 60x60 dado/4patas": 2 },
    "Butacos": { "Butacos Evas": 2, "Butacos Karla/4tubos": 4 },
    "Sofas": { "1 metro": 2, "1.5 metros": 2, "2 metros": 1, "puff 40cm": 4, "puff 1m": 2 }
};

// Variable global para almacenar ciudades y precios
let ciudades = {}; 

// Lista para almacenar los productos agregados
let listaEnvios = [];


/* ==========================================================================
   GESTIÓN DE ARCHIVOS (IMPORTACIÓN CSV)
   ========================================================================== */

// Evento que se activa al cargar el archivo
document.getElementById('inputArchivo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        procesarCSV(text);
    };
    reader.readAsText(file);
});


// Función para transformar el CSV en un objeto de JavaScript
function procesarCSV(text) {
    const lineas = text.split('\n').filter(l => l.trim() !== '');

    // Detectar automáticamente el separador
    const separador = lineas[0].includes(';') ? ';' : ',';

    ciudades = {};

    for (let i = 1; i < lineas.length; i++) {
        const fila = lineas[i].split(separador);

        if (fila.length >= 2) {
            const ciudad = fila[0].trim();

            let precioRaw = fila[1]
                .replace('$', '')
                .replace(/\./g, '')
                .replace(',', '')
                .trim();

            const precio = parseInt(precioRaw);

            if (ciudad && !isNaN(precio)) {
                ciudades[ciudad] = precio;
            }
        }
    }

    console.log("Ciudades cargadas:", ciudades);
    actualizarDesplegableCiudades();
}


/* ==========================================================================
   ACTUALIZACIÓN DE INTERFAZ (DOM)
   ========================================================================== */

// Actualiza el selector de productos según la categoría seleccionada
function actualizarProductos() {
    const cat = document.getElementById('categoria').value;
    const prodSelect = document.getElementById('producto');
    prodSelect.innerHTML = "";
    
    Object.keys(datos[cat]).forEach(item => {
        prodSelect.innerHTML += `<option value="${item}">${item}</option>`;
    });
}


// Actualiza el desplegable de ciudades después de cargar el CSV
function actualizarDesplegableCiudades() {
    const ciuSelect = document.getElementById('ciudad');
    ciuSelect.innerHTML = "";

    Object.keys(ciudades).forEach(c => {
        ciuSelect.innerHTML += `<option value="${c}">${c}</option>`;
    });
}


/* ==========================================================================
   LÓGICA DE NEGOCIO (CÁLCULOS)
   ========================================================================== */

function agregarAlCarrito() {
    const cat = document.getElementById('categoria').value;
    const prod = document.getElementById('producto').value;
    const cant = parseInt(document.getElementById('cantidad').value);
    
    if (isNaN(cant) || cant <= 0) {
        alert("Por favor ingresa una cantidad válida.");
        return;
    }

    const divisor = datos[cat][prod];
    const paquetes = Math.ceil(cant / divisor);
    
    listaEnvios.push({ prod, cant, paquetes });
    
    const tbody = document.querySelector("#tablaEnvios tbody");
    tbody.innerHTML += `
        <tr>
            <td>${prod}</td>
            <td>${cant}</td>
            <td>${paquetes}</td>
        </tr>
    `;
}


function calcularTotal() {
    const ciudadSeleccionada = document.getElementById('ciudad').value;
    
    if (listaEnvios.length === 0) {
        alert("Primero agrega artículos a la lista.");
        return;
    }
    
    if (!ciudades[ciudadSeleccionada]) {
        alert("Por favor, carga un archivo CSV con las ciudades primero.");
        return;
    }

    const totalPaquetes = listaEnvios.reduce((acc, item) => acc + item.paquetes, 0);
    const precioUnitario = ciudades[ciudadSeleccionada];
    const total = totalPaquetes * precioUnitario;
    
    document.getElementById('resultado').innerText =
        `Total: $${total.toLocaleString()}`;
}


function reiniciarCotizacion() {
    // Vaciar la lista de envíos
    listaEnvios = [];
    
    // Limpiar la tabla
    const tbody = document.querySelector("#tablaEnvios tbody");
    tbody.innerHTML = "";
    
    // Resetear los controles del formulario
    document.getElementById('categoria').value = "Sillas";
    actualizarProductos();
    document.getElementById('cantidad').value = 1;
    
    // Resetear la ciudad a la primera opción si hay ciudades cargadas
    const ciuSelect = document.getElementById('ciudad');
    if (ciuSelect.options.length > 0) {
        ciuSelect.selectedIndex = 0;
    }
    
    // Resetear el resultado
    document.getElementById('resultado').innerText = "Total: $0";
}


/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */

window.onload = () => {
    actualizarProductos();
};