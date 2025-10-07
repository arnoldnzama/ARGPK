document.addEventListener('DOMContentLoaded', function() {
    try {
        // Vérification de l'élément map
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error("L'élément #map n'a pas été trouvé dans le DOM");
            return;
        }

        // Initialisation de la carte
        const map = L.map('map').setView(kinshasaCoordinates, 12);
        
        // Coordonnées de Kinshasa
        const kinshasaCoordinates = [-4.4419, 15.2663]; // C'est correct
        
        // Pour les emplacements publicitaires, inversez l'ordre des coordonnées
        const advertisingLocations = [
            {
                id: "PAN001",
                coordinates: [-4.4319, 15.2563], // Assurez-vous que c'est [latitude, longitude]
                type: "Panneau 4x3",
                dimensions: "4m x 3m",
                status: "Disponible",
                address: "Boulevard du 30 Juin, Gombe",
                category: "available"
            },
            {
                id: "PAN002",
                coordinates: [-4.4219, 15.2763],
                type: "Panneau 8x3",
                dimensions: "8m x 3m",
                status: "Occupé",
                address: "Avenue de la Libération, Gombe",
                category: "occupied"
            },
            {
                id: "PAN003",
                coordinates: [-4.4519, 15.2463],
                type: "Panneau digital",
                dimensions: "6m x 4m",
                status: "Disponible",
                address: "Avenue des Aviateurs, Gombe",
                category: "available"
            },
            {
                id: "PAN004",
                coordinates: [-4.4619, 15.2863],
                type: "Panneau 4x3",
                dimensions: "4m x 3m",
                status: "Occupé",
                address: "Boulevard Lumumba, Limete",
                category: "occupied"
            },
            {
                id: "PAN005",
                coordinates: [-4.4119, 15.2363],
                type: "Panneau digital",
                dimensions: "5m x 3m",
                status: "Disponible",
                address: "Avenue de l'Université, Lemba",
                category: "available"
            }
        ];
        
        // Zones réglementées (polygones)
        const regulatedZones = [
            {
                name: "Zone Gombe",
                coordinates: [
                    [-4.4219, 15.2563],
                    [-4.4319, 15.2663],
                    [-4.4419, 15.2763],
                    [-4.4319, 15.2863],
                    [-4.4219, 15.2763],
                    [-4.4119, 15.2663]
                ],
                restrictions: "Hauteur maximale: 6m, Surface maximale: 18m²"
            },
            {
                name: "Zone Limete",
                coordinates: [
                    [-4.4619, 15.2763],
                    [-4.4719, 15.2863],
                    [-4.4819, 15.2763],
                    [-4.4719, 15.2663]
                ],
                restrictions: "Hauteur maximale: 8m, Surface maximale: 24m²"
            }
        ];
        
        // Infractions signalées
        const reportedInfractions = [
            {
                id: "INF001",
                coordinates: [-4.4419, 15.2463],
                type: "Panneau non autorisé",
                address: "Avenue Kasavubu, Lingwala",
                date: "15/06/2023"
            },
            {
                id: "INF002",
                coordinates: [-4.4519, 15.2963],
                type: "Dimensions non conformes",
                address: "Boulevard Sendwe, Kalamu",
                date: "22/07/2023"
            }
        ];
        
        // Création des marqueurs et des groupes de marqueurs
        const availablePanelsGroup = L.layerGroup();
        const occupiedPanelsGroup = L.layerGroup();
        const regulatedZonesGroup = L.layerGroup();
        const reportedInfractionsGroup = L.layerGroup();
        
        // Icônes personnalisées
        const availableIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        const occupiedIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        const infractionIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        // Ajouter les emplacements à la carte
        const markerIcons = {
            'panneau_standard': L.icon({
                iconUrl: 'assets/icons/standard-marker.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            }),
            'panneau_digital': L.icon({
                iconUrl: 'assets/icons/digital-marker.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            }),
            'panneau_mural': L.icon({
                iconUrl: 'assets/icons/wall-marker.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            })
        };
        
        // Utilisation dans la création des marqueurs
        advertisingLocations.forEach(location => {
            const popupContent = `
                <div class="popup-content">
                    <h3 class="font-bold">${location.id} - ${location.type}</h3>
                    <p><strong>Adresse:</strong> ${location.address}</p>
                    <p><strong>Dimensions:</strong> ${location.dimensions}</p>
                    <p><strong>Statut:</strong> <span class="${location.status === 'Disponible' ? 'text-green-600' : 'text-red-600'}">${location.status}</span></p>
                    <button class="bg-primary text-white px-3 py-1 rounded-md mt-2 text-sm">Voir détails</button>
                </div>
            `;
            
            // Suppression de la première déclaration de marker qui était en double
            const marker = L.marker(location.coordinates, {
                icon: location.status === 'Disponible' ? availableIcon : occupiedIcon
            }).bindPopup(popupContent);
            
            if (location.status === 'Disponible') {
                availablePanelsGroup.addLayer(marker);
            } else {
                occupiedPanelsGroup.addLayer(marker);
            }
        });
        
        // Ajouter les zones réglementées
        regulatedZones.forEach(zone => {
            const polygon = L.polygon(zone.coordinates, {
                color: 'blue',
                fillColor: '#3388ff',
                fillOpacity: 0.2
            }).bindPopup(`<strong>${zone.name}</strong><br>${zone.restrictions}`);
            
            regulatedZonesGroup.addLayer(polygon);
        });
        
        // Ajouter les infractions signalées
        reportedInfractions.forEach(infraction => {
            const popupContent = `
                <div class="popup-content">
                    <h3 class="font-bold">${infraction.id}</h3>
                    <p><strong>Type:</strong> ${infraction.type}</p>
                    <p><strong>Adresse:</strong> ${infraction.address}</p>
                    <p><strong>Date:</strong> ${infraction.date}</p>
                    <button class="bg-primary text-white px-3 py-1 rounded-md mt-2 text-sm">Signaler</button>
                </div>
            `;
            
            const marker = L.marker(infraction.coordinates, {
                icon: infractionIcon
            }).bindPopup(popupContent);
            
            reportedInfractionsGroup.addLayer(marker);
        });
        
        // Ajouter les groupes à la carte par défaut
        availablePanelsGroup.addTo(map);
        occupiedPanelsGroup.addTo(map);
        
        // Gestion des filtres
        document.getElementById('apply-filters').addEventListener('click', function() {
            // Supprimer tous les groupes de la carte
            map.removeLayer(availablePanelsGroup);
            map.removeLayer(occupiedPanelsGroup);
            map.removeLayer(regulatedZonesGroup);
            map.removeLayer(reportedInfractionsGroup);
            
            // Ajouter les groupes en fonction des filtres sélectionnés
            if (document.getElementById('available-panels').checked) {
                availablePanelsGroup.addTo(map);
            }
            
            if (document.getElementById('occupied-panels').checked) {
                occupiedPanelsGroup.addTo(map);
            }
            
            if (document.getElementById('regulated-zones').checked) {
                regulatedZonesGroup.addTo(map);
            }
            
            if (document.getElementById('reported-infractions').checked) {
                reportedInfractionsGroup.addTo(map);
            }
        });
        
        // Remplir le tableau des emplacements
        const tableBody = document.getElementById('locations-table-body');
        
        advertisingLocations.forEach(location => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${location.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${location.address}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${location.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${location.dimensions}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${location.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${location.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-primary hover:text-primary-dark" data-id="${location.id}">
                        <i class="ri-eye-line"></i> Voir
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
            
            // Ajouter un événement pour centrer la carte sur l'emplacement sélectionné
            row.querySelector('button').addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const selectedLocation = advertisingLocations.find(loc => loc.id === id);
                
                if (selectedLocation) {
                    map.setView(selectedLocation.coordinates, 16);
                    
                    // Trouver et ouvrir le popup correspondant
                    if (selectedLocation.status === 'Disponible') {
                        availablePanelsGroup.eachLayer(layer => {
                            if (layer.getLatLng().lat === selectedLocation.coordinates[0] && 
                                layer.getLatLng().lng === selectedLocation.coordinates[1]) {
                                layer.openPopup();
                            }
                        });
                    } else {
                        occupiedPanelsGroup.eachLayer(layer => {
                            if (layer.getLatLng().lat === selectedLocation.coordinates[0] && 
                                layer.getLatLng().lng === selectedLocation.coordinates[1]) {
                                layer.openPopup();
                            }
                        });
                    }
                }
            });
        });
        
        // Función de recherche
        document.getElementById('location-search').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
        
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
    }
}); // Solo un paréntesis de cierre aquí


// Fonction pour charger les données depuis l'API
async function loadLocationsData() {
    try {
        const response = await fetch('https://api.argpk.com/locations');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return [];
    }
}

// Initialisation de la carte avec les données de l'API
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const locations = await loadLocationsData();
        updateLocationsList(locations);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
});

// Configuration initiale de la carte
const map = L.map('map').setView([-4.3252, 15.3225], 13); // Coordonnées de Kinshasa

// Ajout de la couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 10
}).addTo(map);

// Contrôles de zoom personnalisés
document.getElementById('zoomIn').addEventListener('click', () => {
    map.zoomIn();
});

document.getElementById('zoomOut').addEventListener('click', () => {
    map.zoomOut();
});

document.getElementById('centerMap').addEventListener('click', () => {
    map.setView([-4.3252, 15.3225], 13);
});

// Style personnalisé pour les marqueurs
const markerIcon = L.icon({
    iconUrl: 'assets/images/icons/marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Exemple de marqueurs (à remplacer par vos données réelles)
const markers = [
    {
        position: [-4.3252, 15.3225],
        title: "Panneau publicitaire #1",
        status: "disponible"
    },
    // Ajoutez d'autres marqueurs selon vos besoins
];

// Ajout des marqueurs à la carte
markers.forEach(marker => {
    L.marker(marker.position, { icon: markerIcon })
        .bindPopup(`
            <div class="p-2">
                <h3 class="font-semibold">${marker.title}</h3>
                <p class="text-sm text-gray-600">Statut: ${marker.status}</p>
            </div>
        `)
        .addTo(map);
});

// Gestion des filtres
const filters = {
    availablePanels: document.getElementById('available-panels'),
    occupiedPanels: document.getElementById('occupied-panels'),
    regulatedZones: document.getElementById('regulated-zones'),
    reportedInfractions: document.getElementById('reported-infractions')
};

// Fonction pour mettre à jour les marqueurs selon les filtres
function updateMarkers() {
    // Logique de filtrage des marqueurs selon les cases cochées
    Object.keys(filters).forEach(filterKey => {
        if (filters[filterKey].checked) {
            // Afficher les marqueurs correspondants
        } else {
            // Masquer les marqueurs correspondants
        }
    });
}

// Écouteurs d'événements pour les filtres
Object.values(filters).forEach(filter => {
    filter.addEventListener('change', updateMarkers);
});

// Fonction pour ajouter un marqueur
function addMarker(location, type) {
    const marker = L.marker([location.lat, location.lng])
        .bindPopup(`
            <h3>${location.name}</h3>
            <p>Type: ${type}</p>
            <p>Statut: ${location.status}</p>
        `)
        .addTo(map);
    return marker;
}

// Fonction de recherche dans la liste des emplacements
document.querySelector('input[type="text"]').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Logique de filtrage de la liste selon le terme de recherche
});


// Fonction de filtrage
function filterLocations(filters) {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            const properties = layer.properties;
            const visible = 
                (!filters.type || properties.type === filters.type) &&
                (!filters.status || properties.status === filters.status) &&
                (!filters.commune || properties.commune === filters.commune);
            
            if (visible) {
                layer.addTo(map);
            } else {
                map.removeLayer(layer);
            }
        }
    });
}

// Écouteurs d'événements pour les filtres
document.querySelectorAll('.filter-control').forEach(control => {
    control.addEventListener('change', () => {
        const filters = {
            type: document.getElementById('type-filter').value,
            status: document.getElementById('status-filter').value,
            commune: document.getElementById('commune-filter').value
        };
        filterLocations(filters);
    });
});


function updateLocationsList(locations) {
    const tableBody = document.getElementById('locations-table-body');
    tableBody.innerHTML = '';
    
    locations.forEach(location => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${location.id}</td>
            <td>${location.type}</td>
            <td>${location.address}</td>
            <td>${location.status}</td>
            <td>
                <button class="locate-btn" data-id="${location.id}">
                    Localiser
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Ajouter les écouteurs pour la synchronisation
    document.querySelectorAll('.locate-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const locationId = btn.dataset.id;
            const location = locations.find(loc => loc.id === locationId);
            if (location) {
                map.setView(location.coordinates, 16);
                // Ouvrir le popup du marqueur correspondant
                map.eachLayer((layer) => {
                    if (layer instanceof L.Marker && layer.properties.id === locationId) {
                        layer.openPopup();
                    }
                });
            }
        });
    });
}