"use strict";
let currentId;
// this function called indirectly to toggle a specific modal
const toggle = (e, id) => {
    e.stopPropagation(); // stop other elements from retoggling the modal
    currentId = id;
    console.log('currentId', id);
    const modal = document.getElementById(id);
    const body = document.body;
    const animatedBackdrop = document.getElementById('animated-backdrop');
    // console.log('toggling ...');
    animatedBackdrop.classList.toggle('hidden');
    modal.classList.toggle('move');
    body.classList.toggle('overflow-hidden');
};
// closes the active modal when outside of it has been clicked
const handleClickOutside = (e) => {
    const modal = document.getElementById(currentId);
    if (e.target == modal) {
        toggle(e, currentId);
    }
};
// closes the active modal when the close button has been clicked
const closeModal = (e) => {
    toggle(e, currentId);
};
const openAddProductModal = (e) => {
    toggle(e, 'add-product-modal');
};
function showFormLoader(id) {
    // append the id of the current modal toggled to the -form-loader to get the specific loader
    const form = document.getElementById(id);
    const loader = document.getElementById(currentId + '-form-loader');
    if (form.checkValidity()) {
        loader.classList.remove('invisible');
        // form.submit();
    }
}
function submitEditForm(e) {
    const form = document.getElementById('edit-product-form');
    if (form.checkValidity()) {
        const formData = htmx.values(form);
        const tr = htmx.find(`#product-${formData.id}`);
        const elementToReplace = htmx.closest(tr, '.record');
        elementToReplace.querySelector('.skeleton').classList.remove('hidden');
        closeModal(e);
        htmx.ajax('POST', '/dashboard/?edit=1', {
            values: formData,
            target: elementToReplace,
            swap: 'outerHTML'
        });
    }
    else {
        form.reportValidity(); // display the validation messages
    }
}
function submitDeleteForm(e) {
    const form = document.getElementById('delete-product-form');
    const formData = htmx.values(form);
    const tr = htmx.find(`#product-${formData.id}`);
    const elementToReplace = htmx.closest(tr, '.record');
    elementToReplace.querySelector('.skeleton').classList.remove('hidden');
    closeModal(e);
    htmx.ajax('POST', '/dashboard/?delete=1', {
        values: formData,
        target: elementToReplace,
        swap: 'outerHTML'
    });
}
