// Fonction pour charger les données des emplacements
async function loadEmplacements() {
    try {
        const response = await fetch('data/emplacements.json');
        const data = await response.json();
        return data.emplacements;
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return [];
    }
}

// Fonction pour rendre les données dans le tableau
function renderEmplacements(emplacements) {
    const tableBody = document.getElementById('emplacements-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    emplacements.forEach(emplacement => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${emplacement.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${emplacement.commune}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${emplacement.type}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${emplacement.dimensions}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    emplacement.statut === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">
                    ${emplacement.statut}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button class="text-primary hover:text-secondary transition-colors">
                    Voir détails
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Ne rien faire si la table n'est pas présente (autres pages)
    if (!document.getElementById('emplacements-table-body')) return;

    const emplacements = await loadEmplacements();
    renderEmplacements(emplacements);

    // Gestion des filtres
    const filters = document.querySelectorAll('select');
    filters.forEach(filter => {
        filter.addEventListener('change', async () => {
            const emplacements = await loadEmplacements();
            // Appliquer les filtres ici
            renderEmplacements(emplacements);
        });
    });
});