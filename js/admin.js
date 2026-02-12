/**
 * NovaSight Solutions - Admin Panel JavaScript
 * Author: Sadeek Khan
 * Version: 2.0 (FIXED LOGIN ISSUE)
 */

// ============================================
// 1. GLOBAL VARIABLES
// ============================================
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// ============================================
// 2. AUTHENTICATION FUNCTIONS
// ============================================

// Check if user is logged in
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    const currentPage = window.location.pathname;
    const currentFile = currentPage.split('/').pop() || 'index.html';
    
    console.log('Auth check - Logged in:', isLoggedIn, 'Page:', currentFile);
    
    // Skip auth check for login page
    if (currentFile === 'index.html' || currentPage.endsWith('admin/')) {
        return;
    }
    
    if (!isLoggedIn) {
        console.log('Not logged in, redirecting to login page');
        window.location.href = 'index.html';
    }
}

// Initialize login form
function initLogin() {
    console.log('Initializing login form');
    
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const messageEl = document.getElementById('login-message');
    
    if (!loginForm) {
        console.log('Login form not found');
        return;
    }
    
    // Clear any existing login state
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_name');
    
    // Handle login
    function handleLogin(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('Login attempt');
        
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';
        
        // Show loading state
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            loginBtn.disabled = true;
        }
        
        // Validate
        if (!username || !password) {
            showMessage('Please enter username and password', 'error');
            resetButton();
            return;
        }
        
        // Check credentials
        if (username === ADMIN_CREDENTIALS.username && 
            password === ADMIN_CREDENTIALS.password) {
            
            console.log('Login successful');
            
            // Set login data
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_name', username);
            localStorage.setItem('admin_login_time', new Date().toISOString());
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(function() {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            console.log('Login failed - invalid credentials');
            showMessage('Invalid username or password!', 'error');
            resetButton();
        }
    }
    
    function showMessage(text, type) {
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = 'form-message ' + type;
            messageEl.style.display = 'block';
            
            // Auto hide after 5 seconds
            setTimeout(function() {
                if (messageEl) {
                    messageEl.style.display = 'none';
                }
            }, 5000);
        } else {
            alert(text);
        }
    }
    
    function resetButton() {
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
            loginBtn.disabled = false;
        }
    }
    
    // Add event listeners
    loginForm.addEventListener('submit', handleLogin);
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Also handle enter key
    if (usernameInput && passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });
    }
}

// Logout function
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Logging out');
            
            // Clear all admin data
            localStorage.removeItem('admin_logged_in');
            localStorage.removeItem('admin_name');
            localStorage.removeItem('admin_login_time');
            
            // Redirect to login
            window.location.href = 'index.html';
        });
    }
}

// ============================================
// 3. DASHBOARD FUNCTIONS
// ============================================
function loadDashboardStats() {
    const statsContainer = document.getElementById('stats-cards');
    if (!statsContainer) return;
    
    // Get counts from localStorage
    const services = JSON.parse(localStorage.getItem('novasight_services')) || [];
    const customers = JSON.parse(localStorage.getItem('novasight_customers')) || [];
    const bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="background: #e3f2fd;">
                <i class="fas fa-camera" style="color: #0a2647;"></i>
            </div>
            <div class="stat-details">
                <h3>${services.length || 4}</h3>
                <p>Active Services</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: #e8f5e9;">
                <i class="fas fa-users" style="color: #2e7d32;"></i>
            </div>
            <div class="stat-details">
                <h3>${customers.length || 6}</h3>
                <p>Satisfied Customers</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: #fff3e0;">
                <i class="fas fa-calendar-check" style="color: #ef6c00;"></i>
            </div>
            <div class="stat-details">
                <h3>${bookings.length}</h3>
                <p>Total Bookings</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: #ffebee;">
                <i class="fas fa-clock" style="color: #c62828;"></i>
            </div>
            <div class="stat-details">
                <h3>${pendingBookings}</h3>
                <p>Pending</p>
            </div>
        </div>
    `;
    
    // Update notification badge
    const badge = document.getElementById('notification-badge');
    if (badge) {
        badge.textContent = pendingBookings;
        badge.style.display = pendingBookings > 0 ? 'flex' : 'none';
    }
}

function loadRecentBookings() {
    const tableBody = document.getElementById('recent-bookings-body');
    if (!tableBody) return;
    
    let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
    bookings = bookings.slice(0, 5); // Last 5 bookings
    
    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 15px; display: block;"></i>
                    <p style="color: #64748b; font-size: 1rem;">No bookings yet</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    bookings.forEach(booking => {
        html += `
            <tr>
                <td>#${booking.id}</td>
                <td>${escapeHtml(booking.name || booking.customer_name || '')}</td>
                <td>${escapeHtml(booking.mobile || '')}</td>
                <td>${escapeHtml(booking.service || booking.service_type || '')}</td>
                <td>${booking.date || booking.preferred_date || 'Not set'}</td>
                <td>
                    <span class="status status-${booking.status || 'pending'}">
                        ${booking.status || 'pending'}
                    </span>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// ============================================
// 4. SERVICES MANAGEMENT
// ============================================
function loadServices() {
    const tableBody = document.getElementById('services-table-body');
    const countEl = document.getElementById('services-count');
    if (!tableBody) return;
    
    let services = JSON.parse(localStorage.getItem('novasight_services')) || [];
    
    // Load default services if empty
    if (services.length === 0) {
        services = [
            { id: 1, icon: 'fa-camera-retro', title: 'CCTV Systems', description: 'HD, IP, PTZ, and thermal cameras. Tailored for home & business. Night vision & remote access.' },
            { id: 2, icon: 'fa-bell', title: 'Alarm & Sensors', description: 'Intrusion detection, motion sensors, glass break alarms, monitored response.' },
            { id: 3, icon: 'fa-lock', title: 'Access Control', description: 'Biometric, RFID, smart locks & gate automation. Total entry management.' },
            { id: 4, icon: 'fa-wifi', title: 'Smart Security', description: 'Video doorbells, remote monitoring, mobile alerts & cloud storage.' }
        ];
        localStorage.setItem('novasight_services', JSON.stringify(services));
    }
    
    // Update count
    if (countEl) {
        countEl.textContent = `${services.length} items`;
    }
    
    let html = '';
    services.forEach(service => {
        html += `
            <tr>
                <td>#${service.id}</td>
                <td><i class="fas ${service.icon}" style="color: #00b4d8; font-size: 1.3rem;"></i></td>
                <td>${escapeHtml(service.title)}</td>
                <td>${escapeHtml(service.description.substring(0, 60))}...</td>
                <td>
                    <i class="fas fa-edit action-icon edit" onclick="window.editService(${service.id})"></i>
                    <i class="fas fa-trash action-icon delete" onclick="window.deleteService(${service.id})"></i>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Setup add service button
    const addBtn = document.getElementById('add-service-btn');
    if (addBtn) {
        addBtn.onclick = showAddServiceForm;
    }
    
    // Setup cancel button
    const cancelBtn = document.getElementById('cancel-service-btn');
    if (cancelBtn) {
        cancelBtn.onclick = hideServiceForm;
    }
    
    // Setup form submission
    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.onsubmit = function(e) {
            e.preventDefault();
            saveService();
        };
    }
}

function showAddServiceForm() {
    const formSection = document.getElementById('service-form-section');
    const formTitle = document.getElementById('form-title');
    const serviceId = document.getElementById('service-id');
    const titleInput = document.getElementById('service-title');
    const iconInput = document.getElementById('service-icon');
    const descInput = document.getElementById('service-description');
    
    if (formSection) {
        formSection.style.display = 'block';
        if (formTitle) formTitle.textContent = 'Add New Service';
        if (serviceId) serviceId.value = '';
        if (titleInput) titleInput.value = '';
        if (iconInput) iconInput.value = 'fa-camera-retro';
        if (descInput) descInput.value = '';
        if (titleInput) titleInput.focus();
    }
}

function editService(id) {
    const services = JSON.parse(localStorage.getItem('novasight_services')) || [];
    const service = services.find(s => s.id === id);
    
    if (service) {
        const formSection = document.getElementById('service-form-section');
        const formTitle = document.getElementById('form-title');
        const serviceId = document.getElementById('service-id');
        const titleInput = document.getElementById('service-title');
        const iconInput = document.getElementById('service-icon');
        const descInput = document.getElementById('service-description');
        
        if (formSection) formSection.style.display = 'block';
        if (formTitle) formTitle.textContent = 'Edit Service';
        if (serviceId) serviceId.value = service.id;
        if (titleInput) titleInput.value = service.title;
        if (iconInput) iconInput.value = service.icon;
        if (descInput) descInput.value = service.description;
        if (titleInput) titleInput.focus();
    }
}

function hideServiceForm() {
    const formSection = document.getElementById('service-form-section');
    if (formSection) {
        formSection.style.display = 'none';
    }
}

function saveService() {
    const serviceId = document.getElementById('service-id')?.value;
    const title = document.getElementById('service-title')?.value.trim();
    const icon = document.getElementById('service-icon')?.value.trim();
    const description = document.getElementById('service-description')?.value.trim();
    
    if (!title || !icon || !description) {
        alert('Please fill in all fields');
        return;
    }
    
    let services = JSON.parse(localStorage.getItem('novasight_services')) || [];
    
    if (serviceId) {
        // Edit existing service
        const index = services.findIndex(s => s.id === parseInt(serviceId));
        if (index !== -1) {
            services[index] = { ...services[index], title, icon, description };
        }
    } else {
        // Add new service
        const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 5;
        services.push({ id: newId, title, icon, description });
    }
    
    localStorage.setItem('novasight_services', JSON.stringify(services));
    
    // Update business data
    updateBusinessData();
    
    hideServiceForm();
    loadServices();
    
    alert('Service saved successfully!');
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        let services = JSON.parse(localStorage.getItem('novasight_services')) || [];
        services = services.filter(s => s.id !== id);
        localStorage.setItem('novasight_services', JSON.stringify(services));
        
        updateBusinessData();
        loadServices();
        
        alert('Service deleted successfully!');
    }
}

// ============================================
// 5. CUSTOMERS MANAGEMENT
// ============================================
function loadCustomers() {
    const tableBody = document.getElementById('customers-table-body');
    const countEl = document.getElementById('customers-count');
    if (!tableBody) return;
    
    let customers = JSON.parse(localStorage.getItem('novasight_customers')) || [];
    
    // Load default customers if empty
    if (customers.length === 0) {
        customers = [
            { id: 1, name: 'Hanumangarh Junction Mall', type: 'Business', rating: '5.0' },
            { id: 2, name: 'Sureshiya Hospital', type: 'Healthcare', rating: '4.9' },
            { id: 3, name: 'Karani Mandir Trust', type: 'Trust', rating: '5.0' },
            { id: 4, name: 'Ward No.60 Co-op', type: 'Cooperative', rating: '4.8' },
            { id: 5, name: 'Nova Jewellers', type: 'Retail', rating: '5.0' },
            { id: 6, name: 'R.S. Gas & Agro', type: 'Agriculture', rating: '4.9' }
        ];
        localStorage.setItem('novasight_customers', JSON.stringify(customers));
    }
    
    // Update count
    if (countEl) {
        countEl.textContent = `${customers.length} items`;
    }
    
    let html = '';
    customers.forEach(customer => {
        html += `
            <tr>
                <td>#${customer.id}</td>
                <td>${escapeHtml(customer.name)}</td>
                <td>${escapeHtml(customer.type || 'Business')}</td>
                <td>
                    <span style="color: #ffb703;">
                        ${'★'.repeat(Math.floor(parseFloat(customer.rating) || 5))}
                    </span> ${customer.rating || 5.0}
                </td>
                <td>
                    <span class="status status-completed">Active</span>
                </td>
                <td>
                    <i class="fas fa-edit action-icon edit" onclick="window.editCustomer(${customer.id})"></i>
                    <i class="fas fa-trash action-icon delete" onclick="window.deleteCustomer(${customer.id})"></i>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Setup add customer button
    const addBtn = document.getElementById('add-customer-btn');
    if (addBtn) {
        addBtn.onclick = showAddCustomerForm;
    }
    
    // Setup cancel button
    const cancelBtn = document.getElementById('cancel-customer-btn');
    if (cancelBtn) {
        cancelBtn.onclick = hideCustomerForm;
    }
    
    // Setup form submission
    const customerForm = document.getElementById('customer-form');
    if (customerForm) {
        customerForm.onsubmit = function(e) {
            e.preventDefault();
            saveCustomer();
        };
    }
}

function showAddCustomerForm() {
    const formSection = document.getElementById('customer-form-section');
    const formTitle = document.getElementById('customer-form-title');
    const customerId = document.getElementById('customer-id');
    const nameInput = document.getElementById('customer-name');
    const typeSelect = document.getElementById('customer-type');
    const reviewInput = document.getElementById('customer-review');
    const ratingSelect = document.getElementById('customer-rating');
    
    if (formSection) {
        formSection.style.display = 'block';
        if (formTitle) formTitle.textContent = 'Add New Customer';
        if (customerId) customerId.value = '';
        if (nameInput) nameInput.value = '';
        if (typeSelect) typeSelect.value = 'Business';
        if (reviewInput) reviewInput.value = '';
        if (ratingSelect) ratingSelect.value = '5.0';
        if (nameInput) nameInput.focus();
    }
}

function editCustomer(id) {
    const customers = JSON.parse(localStorage.getItem('novasight_customers')) || [];
    const customer = customers.find(c => c.id === id);
    
    if (customer) {
        const formSection = document.getElementById('customer-form-section');
        const formTitle = document.getElementById('customer-form-title');
        const customerId = document.getElementById('customer-id');
        const nameInput = document.getElementById('customer-name');
        const typeSelect = document.getElementById('customer-type');
        const reviewInput = document.getElementById('customer-review');
        const ratingSelect = document.getElementById('customer-rating');
        
        if (formSection) formSection.style.display = 'block';
        if (formTitle) formTitle.textContent = 'Edit Customer';
        if (customerId) customerId.value = customer.id;
        if (nameInput) nameInput.value = customer.name;
        if (typeSelect) typeSelect.value = customer.type || 'Business';
        if (reviewInput) reviewInput.value = customer.review || '';
        if (ratingSelect) ratingSelect.value = customer.rating || '5.0';
        if (nameInput) nameInput.focus();
    }
}

function hideCustomerForm() {
    const formSection = document.getElementById('customer-form-section');
    if (formSection) {
        formSection.style.display = 'none';
    }
}

function saveCustomer() {
    const customerId = document.getElementById('customer-id')?.value;
    const name = document.getElementById('customer-name')?.value.trim();
    const type = document.getElementById('customer-type')?.value;
    const review = document.getElementById('customer-review')?.value.trim();
    const rating = document.getElementById('customer-rating')?.value;
    
    if (!name) {
        alert('Please enter customer name');
        return;
    }
    
    let customers = JSON.parse(localStorage.getItem('novasight_customers')) || [];
    
    if (customerId) {
        // Edit existing customer
        const index = customers.findIndex(c => c.id === parseInt(customerId));
        if (index !== -1) {
            customers[index] = { ...customers[index], name, type, review, rating };
        }
    } else {
        // Add new customer
        const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 7;
        customers.push({ id: newId, name, type, review, rating });
    }
    
    localStorage.setItem('novasight_customers', JSON.stringify(customers));
    
    // Update testimonial if provided
    if (review) {
        localStorage.setItem('novasight_testimonial', review);
    }
    
    updateBusinessData();
    hideCustomerForm();
    loadCustomers();
    
    alert('Customer saved successfully!');
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        let customers = JSON.parse(localStorage.getItem('novasight_customers')) || [];
        customers = customers.filter(c => c.id !== id);
        localStorage.setItem('novasight_customers', JSON.stringify(customers));
        
        updateBusinessData();
        loadCustomers();
        
        alert('Customer deleted successfully!');
    }
}

// ============================================
// 6. BOOKINGS MANAGEMENT
// ============================================
function loadAllBookings() {
    const tableBody = document.getElementById('bookings-table-body');
    const countEl = document.getElementById('bookings-count');
    if (!tableBody) return;
    
    let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
    
    // Update count
    if (countEl) {
        countEl.textContent = `${bookings.length} items`;
    }
    
    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 60px;">
                    <i class="fas fa-calendar-times" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 15px; display: block;"></i>
                    <h3 style="color: #64748b; margin-bottom: 10px;">No Bookings Yet</h3>
                    <p style="color: #94a3b8;">When customers book services, they'll appear here.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by newest first
    bookings.sort((a, b) => b.id - a.id);
    
    let html = '';
    bookings.forEach(booking => {
        html += `
            <tr>
                <td>#${booking.id}</td>
                <td>${escapeHtml(booking.name || booking.customer_name || '')}</td>
                <td>${escapeHtml(booking.mobile || '')}</td>
                <td>${escapeHtml(booking.service || booking.service_type || '')}</td>
                <td>${booking.date || booking.preferred_date || 'Not set'}</td>
                <td>${escapeHtml((booking.address || '').substring(0, 30))}...</td>
                <td>
                    <select class="status-select" onchange="window.updateBookingStatus(${booking.id}, this.value)">
                        <option value="pending" ${(booking.status || 'pending') === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <i class="fas fa-trash action-icon delete" onclick="window.deleteBooking(${booking.id})"></i>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Setup filter
    const filterSelect = document.getElementById('booking-filter');
    if (filterSelect) {
        filterSelect.onchange = function() {
            filterBookings(this.value);
        };
    }
}

function filterBookings(status) {
    const tableBody = document.getElementById('bookings-table-body');
    let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
    
    if (status !== 'all') {
        bookings = bookings.filter(b => b.status === status);
    }
    
    bookings.sort((a, b) => b.id - a.id);
    
    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <p>No ${status} bookings found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    bookings.forEach(booking => {
        html += `
            <tr>
                <td>#${booking.id}</td>
                <td>${escapeHtml(booking.name || booking.customer_name || '')}</td>
                <td>${escapeHtml(booking.mobile || '')}</td>
                <td>${escapeHtml(booking.service || booking.service_type || '')}</td>
                <td>${booking.date || booking.preferred_date || 'Not set'}</td>
                <td>${escapeHtml((booking.address || '').substring(0, 30))}...</td>
                <td>
                    <select class="status-select" onchange="window.updateBookingStatus(${booking.id}, this.value)">
                        <option value="pending" ${(booking.status || 'pending') === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <i class="fas fa-trash action-icon delete" onclick="window.deleteBooking(${booking.id})"></i>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function updateBookingStatus(id, status) {
    let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
    const index = bookings.findIndex(b => b.id === id);
    
    if (index !== -1) {
        bookings[index].status = status;
        localStorage.setItem('novasight_bookings', JSON.stringify(bookings));
        
        // Show message
        const messageEl = document.getElementById('status-message');
        if (messageEl) {
            messageEl.textContent = 'Booking status updated successfully!';
            messageEl.className = 'form-message success';
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                if (messageEl) {
                    messageEl.style.display = 'none';
                }
            }, 3000);
        }
        
        // Refresh the view
        const filterSelect = document.getElementById('booking-filter');
        if (filterSelect) {
            filterBookings(filterSelect.value);
        } else {
            loadAllBookings();
        }
        
        loadDashboardStats();
        loadRecentBookings();
    }
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('novasight_bookings', JSON.stringify(bookings));
        
        loadAllBookings();
        loadDashboardStats();
        loadRecentBookings();
        
        alert('Booking deleted successfully!');
    }
}

// ============================================
// 7. SETTINGS MANAGEMENT
// ============================================
function loadSettings() {
    const form = document.getElementById('settings-form');
    if (!form) return;
    
    let settings = JSON.parse(localStorage.getItem('novasight_business')) || {
        business: {
            name: 'NovaSight Solutions',
            owner: 'Sadeek Khan',
            address: 'Karani Mandir Lane, Ward No. 60, Sureshiya, Hanumangarh Junction, Rajasthan -335512',
            mobile: '+91 77105 25823',
            email: 'novasightsolutionsindia@gmail.com',
            latitude: '29.6345765',
            longitude: '74.2944615',
            established: '2014'
        },
        stats: {
            rating: '4.9',
            reviews: '350',
            cameras: '1500',
            clients: '220',
            happy_households: '520',
            business_clients: '180'
        }
    };
    
    // Populate business fields
    const businessName = document.getElementById('business_name');
    if (businessName) businessName.value = settings.business.name || '';
    
    const businessOwner = document.getElementById('business_owner');
    if (businessOwner) businessOwner.value = settings.business.owner || '';
    
    const businessAddress = document.getElementById('business_address');
    if (businessAddress) businessAddress.value = settings.business.address || '';
    
    const businessMobile = document.getElementById('business_mobile');
    if (businessMobile) businessMobile.value = settings.business.mobile || '';
    
    const businessEmail = document.getElementById('business_email');
    if (businessEmail) businessEmail.value = settings.business.email || '';
    
    const businessLat = document.getElementById('business_latitude');
    if (businessLat) businessLat.value = settings.business.latitude || '';
    
    const businessLng = document.getElementById('business_longitude');
    if (businessLng) businessLng.value = settings.business.longitude || '';
    
    const businessEst = document.getElementById('business_established');
    if (businessEst) businessEst.value = settings.business.established || '';
    
    // Populate stats fields
    const statsRating = document.getElementById('stats_rating');
    if (statsRating) statsRating.value = settings.stats.rating || '4.9';
    
    const statsReviews = document.getElementById('stats_reviews');
    if (statsReviews) statsReviews.value = settings.stats.reviews || '350';
    
    const statsCameras = document.getElementById('stats_cameras');
    if (statsCameras) statsCameras.value = settings.stats.cameras || '1500';
    
    const statsClients = document.getElementById('stats_clients');
    if (statsClients) statsClients.value = settings.stats.clients || '220';
    
    const statsHappy = document.getElementById('stats_happy_households');
    if (statsHappy) statsHappy.value = settings.stats.happy_households || '520';
    
    const statsBusiness = document.getElementById('stats_business_clients');
    if (statsBusiness) statsBusiness.value = settings.stats.business_clients || '180';
    
    // Setup form submission
    form.onsubmit = function(e) {
        e.preventDefault();
        saveSettings();
    };
    
    // Setup reset button
    const resetBtn = document.getElementById('reset-settings-btn');
    if (resetBtn) {
        resetBtn.onclick = resetSettings;
    }
}

function saveSettings() {
    const settings = {
        business: {
            name: document.getElementById('business_name')?.value || '',
            owner: document.getElementById('business_owner')?.value || '',
            address: document.getElementById('business_address')?.value || '',
            mobile: document.getElementById('business_mobile')?.value || '',
            email: document.getElementById('business_email')?.value || '',
            latitude: document.getElementById('business_latitude')?.value || '',
            longitude: document.getElementById('business_longitude')?.value || '',
            established: document.getElementById('business_established')?.value || ''
        },
        stats: {
            rating: document.getElementById('stats_rating')?.value || '4.9',
            reviews: document.getElementById('stats_reviews')?.value || '350',
            cameras: document.getElementById('stats_cameras')?.value || '1500',
            clients: document.getElementById('stats_clients')?.value || '220',
            happy_households: document.getElementById('stats_happy_households')?.value || '520',
            business_clients: document.getElementById('stats_business_clients')?.value || '180'
        }
    };
    
    localStorage.setItem('novasight_business', JSON.stringify(settings));
    
    // Update business data
    updateBusinessData();
    
    const messageEl = document.getElementById('settings-message');
    if (messageEl) {
        messageEl.textContent = 'Settings saved successfully!';
        messageEl.className = 'form-message success';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.display = 'none';
            }
        }, 4000);
    }
}

function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        localStorage.removeItem('novasight_business');
        loadSettings();
        
        const messageEl = document.getElementById('settings-message');
        if (messageEl) {
            messageEl.textContent = 'Settings reset to default!';
            messageEl.className = 'form-message success';
            messageEl.style.display = 'block';
            
            setTimeout(() => {
                if (messageEl) {
                    messageEl.style.display = 'none';
                }
            }, 3000);
        }
    }
}

// ============================================
// 8. BUSINESS DATA UPDATE
// ============================================
function updateBusinessData() {
    const services = JSON.parse(localStorage.getItem('novasight_services')) || [];
    const customers = JSON.parse(localStorage.getItem('novasight_customers')) || [];
    const settings = JSON.parse(localStorage.getItem('novasight_business')) || {};
    const testimonial = localStorage.getItem('novasight_testimonial') || '';
    
    const businessData = {
        ...settings,
        services: services,
        customers: customers,
        testimonial: testimonial
    };
    
    localStorage.setItem('novasight_business_complete', JSON.stringify(businessData));
}

// ============================================
// 9. UTILITY FUNCTIONS
// ============================================
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateAdminName() {
    const adminName = localStorage.getItem('admin_name') || 'Admin';
    const nameElements = document.querySelectorAll('#admin-name, #welcome-name');
    
    nameElements.forEach(el => {
        if (el) el.textContent = adminName;
    });
}

function updateCurrentDate() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const now = new Date();
        dateEl.innerHTML = `<i class="fas fa-calendar-alt"></i> ${now.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`;
    }
}

// ============================================
// 10. SIDEBAR TOGGLE
// ============================================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('mobile-sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-toggle');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
    }
    
    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            if (sidebar && 
                !sidebar.contains(event.target) && 
                !toggleBtn?.contains(event.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// ============================================
// 11. MAKE FUNCTIONS GLOBAL
// ============================================
window.editService = editService;
window.deleteService = deleteService;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.filterBookings = filterBookings;

// ============================================
// 12. INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin JS loaded');
    
    // Check authentication
    checkAdminAuth();
    
    // Initialize components
    initLogout();
    initSidebar();
    
    // Update UI
    updateAdminName();
    updateCurrentDate();
    
    // Page-specific initialization
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    console.log('Current page:', page);
    
    if (page === 'dashboard.html' || page === '') {
        loadDashboardStats();
        loadRecentBookings();
    }
    
    if (page === 'services.html') {
        loadServices();
    }
    
    if (page === 'customers.html') {
        loadCustomers();
    }
    
    if (page === 'bookings.html') {
        loadAllBookings();
    }
    
    if (page === 'settings.html') {
        loadSettings();
    }
});
