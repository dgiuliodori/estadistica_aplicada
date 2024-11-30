// generarMenu.js
function generarMenu(menuData, parentElement) {
    const ul = document.createElement('ul');

    menuData.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.nombre;
        a.href = item.enlace ? item.enlace : '#';
        li.appendChild(a);

        if (item.subMenu && item.subMenu.length > 0) {
            generarMenu(item.subMenu, li); // Llamada recursiva para submenús
        }

        ul.appendChild(li);
    });

    parentElement.appendChild(ul);
}

// Inicializar el menú después de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    // Vaciar el contenido actual del <nav>
    nav.innerHTML = '';
    generarMenu(menuData, nav);
});