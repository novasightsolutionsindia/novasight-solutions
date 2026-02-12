/**
 * NovaSight Solutions - Google Maps (Leaflet) JavaScript
 * Author: Sadeek Khan
 * Version: 2.0 (GitHub Pages Compatible)
 */

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Default coordinates (Hanumangarh Junction)
    let lat = 29.6345765;
    let lng = 74.2944615;
    let businessName = "NovaSight Solutions";
    let address = "Karani Mandir Lane, Hanumangarh Jct.";
    
    try {
        // Try to load from localStorage
        const savedData = localStorage.getItem('novasight_business');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.business) {
                lat = parseFloat(data.business.latitude) || lat;
                lng = parseFloat(data.business.longitude) || lng;
                businessName = data.business.name || businessName;
                if (data.business.address) {
                    address = data.business.address.split(',')[0] || address;
                }
            }
        }
    } catch (error) {
        console.log('Using default coordinates');
    }
    
    try {
        // Create map
        const map = L.map('map').setView([lat, lng], 17);
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap, NovaSight Solutions',
            maxZoom: 19,
            detectRetina: true
        }).addTo(map);
        
        // Custom camera icon
        const cameraIcon = L.divIcon({
            html: `<div style="
                    background: white;
                    padding: 12px;
                    border-radius: 50%;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                    border: 3px solid #00b4d8;
                ">
                <i class="fas fa-camera" style="
                    font-size: 2rem;
                    color: #0a2647;
                "></i>
            </div>`,
            className: '',
            iconSize: [58, 58],
            popupAnchor: [0, -29],
            tooltipAnchor: [0, -29]
        });
        
        // Add marker with popup
        const marker = L.marker([lat, lng], { icon: cameraIcon }).addTo(map);
        
        marker.bindPopup(`
            <div style="text-align: center; padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #0a2647; font-weight: 700; font-size: 16px;">${escapeHtml(businessName)}</h3>
                <p style="margin: 0 0 5px 0; color: #4a5b6e; font-size: 14px;">${escapeHtml(address)}</p>
                <p style="margin: 0; color: #00b4d8; font-size: 13px;">
                    <span style="color: #ffb703;">★</span> Showroom & Service Hub
                </p>
            </div>
        `).openPopup();
        
        console.log('Map initialized at:', lat, lng);
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}