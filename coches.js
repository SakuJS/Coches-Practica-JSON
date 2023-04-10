const tablaCoches = document.querySelector('#tabla-coches');

const selectProveedores = document.querySelector('#proveedores');
const modal = document.querySelector('#modal');
const modalTitulo = document.querySelector('#modal-titulo');
const modalImagen = document.querySelector('#modal-imagen');
const modalDetalles = document.querySelector('#modal-detalles');

const qString = window.location.search;
const URLParams = new URLSearchParams(qString);
const supplier = URLParams.get('supplier');

//fetch a coches.json
fetch('./coches.json').then(res => res.json()).then(data => {
  const tbody = document.querySelector('tbody');
  const suppliers = data.CarAvailabilityResponse.CarAvailabilityResult.Suppliers.Suppliers;
  for (x in suppliers) {
    //Show Suppliers by Options
    const option = document.createElement('option');
    option.value = suppliers[x].Supplier;
    option.textContent = suppliers[x].Supplier;
    selectProveedores.appendChild(option);

    //URLParams
    selectProveedores.onchange = () => {
      window.location.href = `./?supplier=${selectProveedores.value}`;
      option.selected = selectProveedores.value;
    }

  }

  const selectedSupplier = selectProveedores.value;
  const coches = data.CarAvailabilityResponse.CarAvailabilityResult.CarSet.Car;
  
  for (y in coches) {
    // console.log(coches[y].Name);

    const fila = document.createElement('tr');
    fila.innerText = coches[y].Name;
    tbody.appendChild(fila);
  }

  tablaCoches.addEventListener('click', e => {
    const fila = e.target.closest('tr');
    if (fila) {
      const coche = JSON.parse(fila.dataset.coche);
      verInfoCoche(coche);
    }
  });



});

// Función para mostrar la lista de coches del proveedor seleccionado
function mostrarCoches() {
  const proveedorSeleccionado = selectProveedores.value;
  const cochesProveedor = coches.filter(coche => coche.Supplier === proveedorSeleccionado && coche.Count === 0);

  // Limpiar la tabla de coches
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  // Agregar los coches a la tabla
  cochesProveedor.forEach(coche => {
    const fila = document.createElement('tr');
    fila.dataset.coche = JSON.stringify(coche);

    const marca = document.createElement('td');
    marca.textContent = coche.Make;
    fila.appendChild(marca);

    const modelo = document.createElement('td');
    modelo.textContent = coche.Model;
    fila.appendChild(modelo);

    const año = document.createElement('td');
    año.textContent = coche.Year;
    fila.appendChild(año);

    tbody.appendChild(fila);
  });

  // Mostrar la tabla de coches
  const cochesDiv = document.querySelector('.coches');
  cochesDiv.style.display = 'block';
}

// Función para mostrar el modal con los detalles del coche
function mostrarDetallesCoche(coche) {
  modalTitulo.textContent = coche.Make + ' ' + coche.Model;
  modalImagen.src = coche.Image;
  modalImagen.alt = coche.Make + ' ' + coche.Model;
  modalDetalles.innerHTML = '';
  for (const detalle in coche) {
    if (detalle !== 'Make' && detalle !== 'Model' && detalle !== 'Year' && detalle !== 'Image' && detalle !== 'Count') {
      const li = document.createElement('li');
      li.textContent = detalle + ': ' + coche[detalle];
      modalDetalles.appendChild(li);
    }
  }
  modal.style.display = 'block';
}

// Event listeners
// document.addEventListener('DOMContentLoaded');

document.body.addEventListener('load', (e) => {
  e.preventDefault();
});

tablaCoches.addEventListener('click', e => {
  const fila = e.target.closest('tr');
  if (fila) {
    const coche = JSON.parse(fila.dataset.coche);
    verInfoCoche();
  }
});

modal.addEventListener('click', e => {
  if (e.target === modal || e.target.classList.contains('cerrar')) {
    modal.style.display = 'none';
  }
});
