let carrito = [];

window.onload = function () {
  const guardado = localStorage.getItem('carrito');
  if (guardado) {
    carrito = JSON.parse(guardado);
    mostrarCarrito();
  }
};

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function toggleCarrito() {
  const popup = document.getElementById('popup-carrito');
  if (popup.classList.contains('mostrar')) {
    popup.classList.remove('mostrar');
  } else {
    popup.classList.add('mostrar');
  }
}


function agregarAlCarrito(nombre, precio, imagen) {
  const index = carrito.findIndex(p => p.nombre === nombre);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad: 1 });
  }
  guardarCarrito();
  mostrarCarrito();

 // Animar el botón que se hizo clic
  const botones = document.querySelectorAll(`button`);
  botones.forEach(btn => {
    if (btn.textContent.includes(nombre)) {
      btn.classList.add('agregado');
      setTimeout(() => btn.classList.remove('agregado'), 300);
    }
  });
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
}

function eliminarProducto(index) {
  if (confirm(`¿Eliminar "${carrito[index].nombre}" del carrito?`)) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
  }
}

function mostrarCarrito() {
  const contenedor = document.getElementById('carrito-items');
  const totalDOM = document.getElementById('carrito-total');
  contenedor.innerHTML = '';
  let total = 0;
  const popup = document.getElementById('popup-carrito');
popup.classList.add('destello');
setTimeout(() => popup.classList.remove('destello'), 600);


  carrito.forEach((item, index) => {
    let subtotal = item.precio * item.cantidad;
    total += subtotal;

    contenedor.innerHTML += `
      <div class="carrito-item">
        <div><strong>${item.nombre}</strong></div>
        <div><small>${item.precio} Bs x ${item.cantidad} = ${subtotal} Bs</small></div>
        <div>
          <button onclick="cambiarCantidad(${index}, -1)">➖</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, 1)">➕</button>
          <button onclick="eliminarProducto(${index})">❌</button>
        </div>
      </div>
    `;
  });

  totalDOM.textContent = `${total} Bs`;
}

function vaciarCarrito() {
  if (confirm("¿Estás seguro de vaciar el carrito?")) {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
  }
}

function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "Hola, quiero comprar lo siguiente:%0A";
  let total = 0;

  carrito.forEach(item => {
    let subtotal = item.precio * item.cantidad;
    mensaje += `- ${item.nombre} x${item.cantidad}: ${subtotal} Bs%0A`;
    total += subtotal;
  });

  mensaje += `%0ATotal: ${total} Bs`;

  let telefono = "59178572424";
  let url = `https://wa.me/${telefono}?text=${mensaje}`;
  window.open(url, "_blank");
}

function filtrarCategoria(categoria) {
  const productos = document.querySelectorAll('.producto');
  productos.forEach(p => {
    if (categoria === 'todas') {
      p.style.display = 'block';
    } else {
      p.style.display = p.classList.contains(categoria) ? 'block' : 'none';
    }
  });
}

function filtrarProductos() {
  const input = document.getElementById('buscador').value.toLowerCase();
  const productos = document.querySelectorAll('.producto');

  productos.forEach(producto => {
    const nombre = producto.querySelector('h3').textContent.toLowerCase();
    const categoria = producto.classList.contains('herramientas') ? 'herramientas' :
                      producto.classList.contains('materiales') ? 'materiales' : '';
    
    if (nombre.includes(input) || categoria.includes(input)) {
      producto.style.display = 'block';
    } else {
      producto.style.display = 'none';
    }
  });
}

document.querySelectorAll('.producto').forEach(producto => {
  producto.addEventListener('click', () => {
    // Agrega la clase que activa el tooltip
    producto.classList.add('mostrar-tooltip');

    // Lo quitamos después de 2.5 segundos
    setTimeout(() => {
      producto.classList.remove('mostrar-tooltip');
    }, 2500);
  });
});
