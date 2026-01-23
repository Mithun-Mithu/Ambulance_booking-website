// script.js - Frontend JavaScript for Ambulance Booking System

// Ambulance data (will be fetched from backend)
let ambulances = [];

// WebSocket connection
let ws;

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:5000');

    ws.onopen = function(event) {
        console.log('Connected to WebSocket');
    };

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'ambulance_update') {
            ambulances = data.data;
            renderAmbulances();
        }
    };

    ws.onclose = function(event) {
        console.log('WebSocket connection closed');
        // Reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

// Fetch ambulances from backend
async function fetchAmbulances() {
    try {
        const response = await fetch('http://localhost:3000/api/ambulances');
        if (response.ok) {
            ambulances = await response.json();
            renderAmbulances();
        } else {
            console.error('Failed to fetch ambulances');
            // Fallback to mock data if API fails
            loadMockData();
        }
    } catch (error) {
        console.error('Error fetching ambulances:', error);
        loadMockData();
    }
}

// Mock data fallback
function loadMockData() {
    ambulances = [
    {
        id: 'AMB001',
        driverName: 'Ramanna',
        phone: '7892210283',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM2NjdlZWEiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5TYXJhaDwvdGV4dD48L3N2Zz4=',
        status: 'available',
        location: 'Main Street & 5th cross,JCR,Chitradurga',
        type: 'Advanced Life Support',
        eta: '5 mins'
    },
    {
        id: 'AMB002',
        driverName: 'Nandish',
        phone: '91+---------',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMyZWQ1NzMiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5NaWtlPC90ZXh0Pjwvc3ZnPg==',
        status: 'en-route',
        location: 'Downtown Medical District',
        type: 'Basic Life Support',
        eta: '12 mins'
    },
    {
        id: 'AMB003',
        driverName: 'Rahul',
        phone: '91+----------',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNmZmE1MDIiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5FbWlseTwvdGV4dD48L3N2Zz4=',
        status: 'available',
        location: ' District hospital,Chitradurga',
        type: 'Speed Ambulance',
        eta: '8 mins'
    },
    {
        id: 'AMB004',
        driverName: 'Wilson',
        phone: '91+----------',
        photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM3NjRiYTIiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5KYW1lczwvdGV4dD48L3N2Zz4=',
        status: 'busy',
        location: 'Near stadium,hitradurga',
        type: 'Ambari Ambulance',
        eta: 'N/A'
    }
    ];
    renderAmbulances();
}

// Render ambulance cards
function renderAmbulances() {
    const container = document.getElementById('ambulanceCards');
    container.innerHTML = ambulances.map(ambulance => `
        <div class="ambulance-card" onclick="selectAmbulance('${ambulance.id}')">
            <img src="${ambulance.photo}" alt="${ambulance.driverName}" class="driver-photo">
            <div class="ambulance-info">
                <h3>${ambulance.id} - ${ambulance.driverName}</h3>
                <p><strong>Type:</strong> ${ambulance.type}</p>
                <p><strong>Location:</strong> ${ambulance.location}</p>
                <p><strong>ETA:</strong> ${ambulance.eta}</p>
                <span class="status ${ambulance.status}">${ambulance.status.toUpperCase()}</span>
            </div>
            <button class="phone-btn" onclick="callDriver('${ambulance.phone}', event)">
                📞 Call Driver
            </button>
        </div>
    `).join('');
}

// DOM elements for modal
let addAmbulanceModal, addAmbulanceBtn, closeModalBtn, addAmbulanceForm;

// Emergency call function
function emergencyCall() {
    if (confirm('This will connect you to emergency services. Continue?')) {
        alert('Connecting to emergency services...\n📞 Calling 7892210283');
    }
}

// Call driver function
function callDriver(phone, event) {
    event.stopPropagation();
    if (confirm(`Call driver at ${phone}?`)) {
        window.location.href = `tel:${phone}`;
    }
}

// Select ambulance function
function selectAmbulance(ambulanceId) {
    const ambulance = ambulances.find(a => a.id === ambulanceId);
    if (ambulance && ambulance.status === 'available') {
        alert(`Selected ${ambulance.id} with driver ${ambulance.driverName}\nETA: ${ambulance.eta}`);
        // Update map to show selected ambulance
        document.getElementById('map').innerHTML = `
            📍 Tracking ${ambulanceId} - ${ambulance.driverName}<br>
            Current Location: ${ambulance.location}<br>
            ETA: ${ambulance.eta}<br>
            <small>🔄 Updating every 30 seconds</small>
        `;
    } else if (ambulance.status !== 'available') {
        alert('This ambulance is currently not available.');
    }
}

// Modal functions
function showAddAmbulanceForm() {
    addAmbulanceModal.style.display = 'block';
}

function closeAddAmbulanceForm() {
    addAmbulanceModal.style.display = 'none';
    addAmbulanceForm.reset();
}

// Initialize modal elements
document.addEventListener('DOMContentLoaded', function() {
    addAmbulanceModal = document.getElementById('addAmbulanceModal');
    addAmbulanceBtn = document.getElementById('addAmbulanceBtn');
    closeModalBtn = document.querySelector('.close'); // Use class selector for close button
    addAmbulanceForm = document.getElementById('addAmbulanceForm');

    // Event listeners for modal
    if (addAmbulanceBtn) addAmbulanceBtn.addEventListener('click', showAddAmbulanceForm);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAddAmbulanceForm);

    // Close modal when clicking outside
    if (addAmbulanceModal) {
        window.addEventListener('click', function(event) {
            if (event.target === addAmbulanceModal) {
                closeAddAmbulanceForm();
            }
        });
    }

    // Handle add ambulance form submission
    if (addAmbulanceForm) {
        addAmbulanceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            const newAmbulance = {
                id: 'AMB' + String(ambulances.length + 1).padStart(3, '0'),
                driverName: formData.get('driverName'),
                phone: formData.get('phone'),
                photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiM2NjdlZWEiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5OZXc8L3RleHQ+PC9zdmc+',
                status: 'available',
                location: formData.get('location'),
                type: formData.get('type'),
                eta: formData.get('eta') || '5 mins'
            };

            // Add to ambulances array
            ambulances.push(newAmbulance);

            // Re-render ambulances
            renderAmbulances();

            // Close modal
            closeAddAmbulanceForm();

            // Show success message
            alert('New ambulance added successfully!');
        });
    }
});

// Handle form submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const availableAmbulance = ambulances.find(a => a.status === 'available');
    if (!availableAmbulance) {
        alert('No ambulances available at the moment. Please try again later.');
        return;
    }

    const bookingData = {
        patientName: formData.get('patientName'),
        phone: formData.get('phone'),
        pickupLocation: formData.get('pickupLocation'),
        destination: formData.get('destination'),
        urgency: formData.get('urgency'),
        ambulanceType: formData.get('ambulanceType'),
        ambulanceId: availableAmbulance.id
    };

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const booking = await response.json();
            document.querySelector('.booking-form').style.display = 'none';
            document.getElementById('bookingStatus').style.display = 'block';

            // Find the assigned ambulance
            const assignedAmbulance = ambulances.find(a => a.id === booking.ambulanceId);
            if (assignedAmbulance) {
                document.getElementById('trackingInfo').innerHTML = `
                    <div style="margin-top: 20px; padding: 20px; background: #f8f9ff; border-radius: 10px;">
                        <h3>Assigned Ambulance: ${assignedAmbulance.id}</h3>
                        <p>Driver: ${assignedAmbulance.driverName}</p>
                        <p>Phone: ${assignedAmbulance.phone}</p>
                        <p>ETA: ${assignedAmbulance.eta}</p>
                        <button class="btn" onclick="callDriver('${assignedAmbulance.phone}', event)">📞 Call Driver</button>
                    </div>
                `;
            } else {
                document.getElementById('trackingInfo').innerHTML = `
                    <div style="margin-top: 20px; padding: 20px; background: #f8f9ff; border-radius: 10px;">
                        <h3>Booking Confirmed!</h3>
                        <p>Your booking ID: ${booking.id}</p>
                        <p>An ambulance will be assigned shortly.</p>
                    </div>
                `;
            }

            // Refresh ambulances to show updated status
            fetchAmbulances();
        } else {
            alert('Failed to create booking. Please try again.');
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('Error creating booking. Please check your connection.');
    }
});

// Reset booking form to allow new bookings
function resetBookingForm() {
    document.querySelector('.booking-form').style.display = 'block';
    document.getElementById('bookingStatus').style.display = 'none';
    document.getElementById('bookingForm').reset();
}

// Initialize page
fetchAmbulances();
connectWebSocket();

// Simulate real-time updates
setInterval(() => {
    // Update ambulance locations (simulation)
    const locations = ['Main Street', 'Downtown', 'Hospital District', 'North Side', 'South End'];
    ambulances.forEach(ambulance => {
        if (Math.random() > 0.8) {
            ambulance.location = locations[Math.floor(Math.random() * locations.length)];
        }
    });
    renderAmbulances();
}, 30000);