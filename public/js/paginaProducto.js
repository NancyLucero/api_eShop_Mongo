function redirectToProduct(productId) {
    window.location.href = "/producto/" + productId;
  }


// galeria modal
  let galeriaProductos = document.querySelectorAll('.galeriaProductos img');
  let modalImagenes = document.getElementById('modalImagenes');
  
  modalImagenes.classList.add('modalOculto')
  galeriaProductos.forEach((image) => {
    image.addEventListener('click', () => {
      let modalId = image.getAttribute('data-modal-id');
      let modal = document.getElementById(modalId);
      modalImagenes.classList.add('modalImagenes')
    });
  });
  
  let closeModal = document.querySelector('.cerrarModal');
  closeModal.addEventListener('click', () => {
    modalImagenes.classList.toggle('modalImagenes')
  });
  
  // deslizar imagenes
  let btnDer = document.getElementById('btnDer');
  let btnIzq = document.getElementById('btnIzq');
  let boxImgModal = document.querySelector('.boxImgModal');
  
  btnDer.addEventListener('click', deslizarDer);
  btnIzq.addEventListener('click', deslizarIzq);
  
  function deslizarDer() {
    const imgWidth = boxImgModal.children[1].offsetWidth;
    boxImgModal.scrollLeft += imgWidth;
  }
  
  function deslizarIzq() {
    const imgWidth = boxImgModal.children[1].offsetWidth;
    boxImgModal.scrollLeft -= imgWidth;
  }