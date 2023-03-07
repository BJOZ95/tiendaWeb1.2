const form = document.getElementById("formContacto");
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita el envío de formulario predeterminado
  
  // Aquí es donde enviarías los datos del formulario a través de AJAX o una API
  // Después de eso, muestra un mensaje de confirmación
  alert("Sugerencia enviada");

  // Restablece los campos del formulario
  form.reset();
});
