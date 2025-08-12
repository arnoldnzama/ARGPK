document.addEventListener('DOMContentLoaded', function() {
    try {
        // Vérification de l'élément map
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error("L'élément #map n'a pas été trouvé dans le DOM");
            return;
        }

        // Coordonnées de Kinshasa
        const kinshasaCoordinates = [-4.4419, 15.2663];
        // Initialisation de la carte
        const map = L.map('map').setView(kinshasaCoordinates, 12);
        
        // Ajout de la couche OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 10
        }).addTo(map);
        
        // Contrôles de zoom personnalisés
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const centerMapBtn = document.getElementById('centerMap');
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => map.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => map.zoomOut());
        if (centerMapBtn) centerMapBtn.addEventListener('click', () => map.setView(kinshasaCoordinates, 13));
        
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
        if (tableBody) {
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
            
            // Recherche
            const searchInput = document.getElementById('location-search');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    const rows = tableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(searchTerm) ? '' : 'none';
                    });
                });
            }
        }
        
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
    }
}); // Solo un paréntesis de cierre aquí


