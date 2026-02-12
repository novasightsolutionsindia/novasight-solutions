/**
 * NovaSight Solutions - Booking Form JavaScript
 * Author: Sadeek Khan
 * Version: 1.0
 */

// Initialize booking form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
});

function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    const formMessage = document.getElementById('form-message');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value.trim();
            const mobile = document.getElementById('mobile')?.value.trim();
            const service = document.getElementById('service-type')?.value;
            const date = document.getElementById('preferred-date')?.value;
            const address = document.getElementById('address')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            
            // Validation
            if (!name || name.length < 3) {
                showFormMessage('Please enter your full name', 'error', formMessage);
                return;
            }
            
            if (!mobile || mobile.length < 10) {
                showFormMessage('Please enter a valid mobile number', 'error', formMessage);
                return;
            }
            
            if (!service) {
                showFormMessage('Please select a service type', 'error', formMessage);
                return;
            }
            
            if (!address || address.length < 10) {
                showFormMessage('Please enter your complete address', 'error', formMessage);
                return;
            }
            
            // Create booking object
            const booking = {
                id: Date.now(),
                name: name,
                mobile: mobile,
                service: service,
                date: date || 'Not specified',
                address: address,
                message: message || 'No message',
                status: 'pending',
                timestamp: new Date().toISOString(),
                formattedDate: new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            // Save booking
            saveBooking(booking);
            
            // Show success message
            showFormMessage(
                '✅ Thank you! Your booking has been received. We will contact you within 30 minutes.',
                'success',
                formMessage
            );
            
            // Reset form
            bookingForm.reset();
            
            // Scroll to message
            if (formMessage) {
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            console.log('New booking created:', booking.id);
        });
    }
}

// Show form message
function showFormMessage(text, type, element) {
    if (element) {
        element.textContent = text;
        element.className = `form-message ${type}`;
        element.style.display = 'block';
        
        // Auto hide after 8 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 8000);
    } else {
        alert(text);
    }
}

// Save booking to localStorage
function saveBooking(booking) {
    try {
        let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
        bookings.unshift(booking); // Add to beginning
        localStorage.setItem('novasight_bookings', JSON.stringify(bookings));
        
        // Update booking count for admin
        updateBookingCount();
    } catch (error) {
        console.error('Error saving booking:', error);
    }
}

// Update booking count in admin panel
function updateBookingCount() {
    try {
        const bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
        const pendingCount = bookings.filter(b => b.status === 'pending').length;
        
        // Store count for admin panel
        localStorage.setItem('novasight_pending_count', pendingCount.toString());
        
        // Dispatch event for admin panel
        window.dispatchEvent(new CustomEvent('bookingUpdated', {
            detail: { count: pendingCount }
        }));
    } catch (error) {
        console.error('Error updating booking count:', error);
    }
}

// Get all bookings (for admin panel)
function getAllBookings() {
    try {
        return JSON.parse(localStorage.getItem('novasight_bookings')) || [];
    } catch (error) {
        console.error('Error getting bookings:', error);
        return [];
    }
}

// Get bookings by status
function getBookingsByStatus(status) {
    const bookings = getAllBookings();
    if (status === 'all') return bookings;
    return bookings.filter(b => b.status === status);
}

// Update booking status
function updateBookingStatus(bookingId, newStatus) {
    try {
        let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
        const index = bookings.findIndex(b => b.id === bookingId);
        
        if (index !== -1) {
            bookings[index].status = newStatus;
            localStorage.setItem('novasight_bookings', JSON.stringify(bookings));
            updateBookingCount();
            return true;
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
    }
    return false;
}

// Delete booking
function deleteBooking(bookingId) {
    try {
        let bookings = JSON.parse(localStorage.getItem('novasight_bookings')) || [];
        bookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem('novasight_bookings', JSON.stringify(bookings));
        updateBookingCount();
        return true;
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
    return false;
}

// Export functions for admin panel
if (typeof window !== 'undefined') {
    window.getAllBookings = getAllBookings;
    window.getBookingsByStatus = getBookingsByStatus;
    window.updateBookingStatus = updateBookingStatus;
    window.deleteBooking = deleteBooking;
}