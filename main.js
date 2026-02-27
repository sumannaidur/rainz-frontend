document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon between bars and times
            const icon = mobileBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Active Link Highlighting Based on URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Sticky Header Shrink
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.height = '70px';
                header.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
            } else {
                header.style.height = '80px';
                header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }
        });
    }

    // Form submission simulation
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Construct payload payload
            const formData = {
                parentName: document.getElementById('parentName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value || null,
                childName: document.getElementById('childName').value,
                childAge: document.getElementById('childAge').value,
                program: document.getElementById('program').value,
                message: document.getElementById('message').value || null
            };

            try {
                // Send request to the deployed Spring Boot backend on Render
                const response = await fetch('https://rainz-backend.onrender.com/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    inquiryForm.innerHTML = `
                        <div class="success-message" style="text-align: center; padding: 40px 20px;">
                            <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--color-quaternary); margin-bottom: 20px;"></i>
                            <h3 style="font-family: var(--font-heading); color: var(--color-text-dark); margin-bottom: 10px;">Thank You!</h3>
                            <p style="color: var(--color-text-light);">We have received your inquiry. Our admissions team will contact you shortly.</p>
                        </div>
                    `;
                } else {
                    throw new Error("Server returned an error");
                }
            } catch (error) {
                console.error("Error submitting form", error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert("Sorry! Something went wrong. Please check your connection or contact us directly via WhatsApp.");
            }
        });
    }
});
