// Function to dynamically include HTML components
function includeHTML(elementId, filePath, callback) {
	const element = document.getElementById(elementId);
	if (element) {
		fetch(filePath)
			.then((response) => {
				if (!response.ok) throw new Error(`Component not found: ${filePath}`);
				return response.text();
			})
			.then((html) => {
				element.innerHTML = html;
				if (callback) callback(); // Execute callback after content is loaded
			})
			.catch((error) => {
				console.error(`Error including ${filePath}:`, error);
			});
	}
}

// Function to initialize sidebar and dropdown functionality
function initializeMenuToggle() {
	const menuButton = document.querySelector(".side-menu-open");
	const sideMenu = document.querySelector(".navbar");

	// Toggle sidebar on button click
	menuButton?.addEventListener("click", () => {
		sideMenu?.classList.toggle("sidebar_active");
	});

	// Close the sidebar when a link inside is clicked
	sideMenu?.addEventListener("click", (event) => {
		if (event.target.tagName === "A") {
			sideMenu.classList.remove("sidebar_active");
		}
	});

	// Close the sidebar when clicking outside
	document.addEventListener("click", (event) => {
		if (!sideMenu?.contains(event.target) && !menuButton?.contains(event.target)) {
			sideMenu?.classList.remove("sidebar_active");
		}
	});

	// Handle dropdown toggle for "Services"
	const submenuButtons = document.querySelectorAll(".has-sub > .submenu-button");

	submenuButtons.forEach((submenuButton) => {
		submenuButton.addEventListener("click", (event) => {
			event.stopPropagation(); // Prevent event from propagating to parent elements
			const parentLi = submenuButton.parentElement;
			const dropdownMenu = parentLi.querySelector(".header_dropdown_items");

			// Close other open dropdowns
			document.querySelectorAll(".header_dropdown_items").forEach((menu) => {
				if (menu !== dropdownMenu) {
					menu.classList.add("close");
					menu.classList.remove("open");
				}
			});

			// Toggle current dropdown
			dropdownMenu?.classList.toggle("close");
			dropdownMenu?.classList.toggle("open");

			// Update button classes for visual feedback
			submenuButton.classList.toggle("submenu-button-opened");
		});
	});
}

// Function to highlight visited and active tabs in the navigation menu
function trackVisitedTabs() {
	const navLinks = document.querySelectorAll(".nav a");

	// Highlight the current tab
	navLinks.forEach((link) => {
		if (link.href === window.location.href) {
			link.classList.add("activeMenuTab");
		}
	});
}

// Main script to include header, navbar, and footer dynamically
document.addEventListener("DOMContentLoaded", () => {
	const currentPath = window.location.pathname;

	// Determine the path for header, navbar, and footer based on the current page
	let navbarPath, footerPath;

	if (currentPath.includes("/services/")) {
		// For sub-services pages
		navbarPath = "../../components/navbar.html";
		footerPath = "../../components/footer.html";
	} else if (currentPath.includes("/") || currentPath.includes("/index.html")) {
		// For Index page
		navbarPath = "/components/navbar.html";
		footerPath = "/components/footer.html";
	} else {
		// For Remaining pages
		navbarPath = "../components/navbar.html";
		footerPath = "../components/footer.html";
	}

	// Include header first, then navbar and footer
	includeHTML("navbar", navbarPath, () => {
		initializeMenuToggle();
		trackVisitedTabs();
		// Navbar Scroll Position
		const nav = document.querySelector(".navbar");
		const logo = nav?.querySelector(".logo img");
		const burgerBars = document.querySelectorAll(".sidebarBtn .bar");
		const dropdownArrows = document.querySelectorAll(".arrow");
		if (nav) {
			if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
				nav.classList.add("home-page-navbar");
				if (logo) {
					logo.src = "/assets/images/logo/logo_light.svg"; // Change logo for the homepage
					burgerBars.forEach((bar) => (bar.style.background = "#fff"));
					dropdownArrows.forEach((arrow) => ((arrow.style.border = "solid #fff"), (arrow.style.borderWidth = "0 2px 2px 0")));
					window.addEventListener("scroll", () => {
						if (window.scrollY > 30) {
							logo.src = "/assets/images/logo/logo.svg"; // Set dark logo on scroll
							burgerBars.forEach((bar) => (bar.style.background = "#134c5c"));
							nav.classList.remove("home-page-navbar");
							dropdownArrows.forEach((arrow) => ((arrow.style.border = "solid  #00256a"), (arrow.style.borderWidth = "0 2px 2px 0")));
						} else {
							logo.src = "/assets/images/logo/logo_light.svg"; // Revert to light logo when back to top
							burgerBars.forEach((bar) => (bar.style.background = "#fff"));
							nav.classList.add("home-page-navbar");
							dropdownArrows.forEach((arrow) => ((arrow.style.border = "solid #fff"), (arrow.style.borderWidth = "0 2px 2px 0")));
						}
					});
				}
			}
			window.onscroll = () => {
				if (window.scrollY > 30) {
					nav.classList.add("nav-active");
					if (logo) {
						logo.src = "/assets/images/logo/logo.svg"; // Change logo for the homepage
					}
				} else {
					nav.classList.remove("nav-active");
				}
			};
		} else {
			console.error("Navbar element not found after inclusion.");
		}
	});
	includeHTML("footer", footerPath);
});

// Sub-Services Accordian Functionality
document.addEventListener("DOMContentLoaded", () => {
	// JavaScript for Accordion Navigation
	const navItems = document.querySelectorAll(".nav-item");
	const contentSections = document.querySelectorAll(".content");

	navItems.forEach((item) => {
		item.addEventListener("click", () => {
			// Check if the clicked section is already active
			const sectionId = item.getAttribute("data-section");
			const content = document.getElementById(sectionId);
			const arrowImg = item.querySelector(".nav-item img");
			// If not active, activate it
			if (!item.classList.contains("active")) {
				// Close all sections
				navItems.forEach((nav) => {
					nav.classList.remove("active");
					const navImg = nav.querySelector("img");
					if (navImg) navImg.src = "/assets/images/icons/arrow.png"; // Replace with your default arrow image
				});
				contentSections.forEach((section) => section.classList.remove("active"));
				// Open the clicked section
				item.classList.add("active");
				content.classList.add("active");
				if (arrowImg) arrowImg.src = "/assets/images/icons/arrow-white.png";
			}
			// If it’s already active, no action is taken
		});
	});

	// Open the first section by default
	navItems[0]?.classList.add("active");
	contentSections[0]?.classList.add("active");
	const firstArrowImg = navItems[0]?.querySelector("img");
	if (firstArrowImg) firstArrowImg.src = "/assets/images/icons/arrow-white.png";
});

// document.addEventListener("DOMContentLoaded", () => {
// 	// JavaScript for smooth fade-in/fade-out activation during scroll
// 	const cards = document.querySelectorAll(".card");
// 	const observerOptions = {
// 		root: null, // Use the viewport as the root
// 		threshold: 0.5, // Trigger when 50% of the card is in the viewport
// 	};

// 	const observer = new IntersectionObserver((entries) => {
// 		entries.forEach((entry) => {
// 			if (entry.isIntersecting) {
// 				entry.target.classList.add("slideractive");
// 				entry.target.classList.remove("end-visible");
// 			} else {
// 				entry.target.classList.remove("slideractive");
// 			}
// 		});
// 	}, observerOptions);

// 	// Observe each card
// 	cards.forEach((card) => observer.observe(card));

// 	// Add "pack of cards" effect at the end
// 	const lastTwoCards = Array.from(cards).slice(-2);
// 	window.addEventListener("scroll", () => {
// 		const scrollY = window.scrollY + window.innerHeight;
// 		const docHeight = document.documentElement.scrollHeight;

// 		if (scrollY >= docHeight - 100) {
// 			lastTwoCards.forEach((card) => {
// 				card.classList.add("end-visible");
// 			});
// 		} else {
// 			lastTwoCards.forEach((card) => {
// 				card.classList.remove("end-visible");
// 			});
// 		}
// 	});
// });

// Careers Accordian Function
const accordionButtons = document.querySelectorAll(".accordion-button");

accordionButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const content = button.nextElementSibling;
		button.classList.toggle("active");
		// Toggle visibility
		content.style.display = content.style.display === "block" ? "none" : "block";

		// Close other accordions
		document.querySelectorAll(".accordion-content").forEach((item) => {
			if (item !== content) {
				item.style.display = "none";
			}
		});
	});
});

// Career application form functionality
document.addEventListener("DOMContentLoaded", function () {
	const accordion = document.querySelector(".accordion-container");
	const formContainer = document.querySelector(".form-container");
	const popupMessage = document.querySelector(".popup-message");
	const popupOkButton = document.getElementById("popup-ok");
	const applicationForm = document.getElementById("application-form");

	// Show form and hide accordion when "Apply Now" is clicked
	document.querySelectorAll(".apply-btn").forEach((button) => {
		button.addEventListener("click", function () {
			const role = this.dataset.role;
			// formTitle.textContent = `Apply for ${role}`;
			accordion.style.display = "none";
			formContainer.style.display = "block";
		});
	});

	// Handle form submission
	applicationForm.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent default form submission
		formContainer.style.display = "none";
		popupMessage.style.display = "flex";
	});

	// Handle popup "OK" button click
	popupOkButton.addEventListener("click", function () {
		popupMessage.style.display = "none";
		accordion.style.display = "block";
	});
});

// Api Integration for Contact Us Page
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        // Attach event listener only if the form exists
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
	const firstName = document.getElementById("firstName").value.trim();
	const lastName = document.getElementById("lastName").value.trim();
	const email = document.getElementById("email").value.trim();

	const namePattern = /^[A-Za-z]+$/;
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!namePattern.test(firstName)) {
		alert("First Name must contain only alphabets.");
		return;
	}

	if (!namePattern.test(lastName)) {
		alert("Last Name must contain only alphabets.");
		return;
	}

	if (!emailPattern.test(email)) {
		alert("Please enter a valid email address.");
		return;
	}

	const formData = {
		firstName,
		lastName,
		email,
		organization: document.getElementById("organization").value.trim(),
		country: document.getElementById("country").value,
		state: document.getElementById("state").value,
		yourMessage:document.getElementById("message").value
	};

	try {
		const response = await fetch("https://g5jkmieirh.execute-api.us-east-1.amazonaws.com/v1/contact-us", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			openModal("successModal");
			document.querySelector(".contact-form").reset();
			console.log("Success");
		} else {
			openModal("failureModal");
			console.log("Failed");
		}
	} catch (error) {
		console.error("Error:", error);
		openModal("failureModal");
	}
});
} else {
	console.warn("Contact form (.contact-form) not found on this page.");
}
});
function openModal(modalId) {
	document.getElementById(modalId).style.display = "flex";
	window.scrollTo(0, 0);
}

function closeModal(modalId) {
	document.getElementById(modalId).style.display = "none";
}

// Countries and States API Integration
const config = {
	cUrl: "https://api.countrystatecity.in/v1/countries",
	ckey: "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
};

const countrySelect = document.querySelector(".country");
const stateSelect = document.querySelector(".state");

function loadCountries() {
	fetch(config.cUrl, {
		headers: { "X-CSCAPI-KEY": config.ckey },
		mode: "cors",
	})
		.then((response) => response.json())
		.then((data) => {
			data.forEach((country) => {
				const option = document.createElement("option");
				option.value = country.iso2;
				option.textContent = country.name;
				countrySelect.appendChild(option);
			});
		})
		.catch((error) => console.error("Error loading countries:", error));

	stateSelect.disabled = true;
	stateSelect.style.pointerEvents = "none";
}

function loadStates() {
	const selectedCountryCode = countrySelect.value;
	stateSelect.innerHTML = '<option value="">Select State</option>';

	fetch(`${config.cUrl}/${selectedCountryCode}/states`, {
		headers: { "X-CSCAPI-KEY": config.ckey },
		mode: "cors",
	})
		.then((response) => response.json())
		.then((data) => {
			data.forEach((state) => {
				const option = document.createElement("option");
				option.value = state.iso2;
				option.textContent = state.name;
				stateSelect.appendChild(option);
			});
		})
		.catch((error) => console.error("Error loading states:", error));

	stateSelect.disabled = false;
	stateSelect.style.pointerEvents = "auto";
}
window.onload = loadCountries;


// Api Integration for Career Form
// Ensure DOM is loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const applicationForm = document.querySelector("#application-form");

    if (applicationForm) {
        // Attach event listener only if the form exists
        applicationForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const firstName = document.getElementById("first-name").value.trim();
            const lastName = document.getElementById("last-name").value.trim();
            const email = document.getElementById("email").value.trim();

            const namePattern = /^[A-Za-z]+$/;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!namePattern.test(firstName)) {
                alert("First Name must contain only alphabets.");
                return;
            }

            if (!namePattern.test(lastName)) {
                alert("Last Name must contain only alphabets.");
                return;
            }

            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            const formData = {
                firstName,
                lastName,
                email,
                appliedFor: document.getElementById("apply-for").value,
                phoneNumber: document.getElementById("phone").value.trim(),
                experience: document.getElementById("experience").value.trim(),
                location: document.getElementById("location").value.trim(),
                message: document.getElementById("message").value,
            };

            try {
                const response = await fetch(
                    "https://6lshxy5k3f.execute-api.us-east-1.amazonaws.com/v1/user-resumes",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                );

                if (response.ok) {
                    openModal("successModal");
                    applicationForm.reset();
                    console.log("Success");
                } else {
                    openModal("failureModal");
                    console.log("Failed");
                }
            } catch (error) {
                console.error("Error:", error);
                openModal("failureModal");
            }
        });
    } else {
        console.warn("Career form (#application-form) not found on this page.");
    }
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
    window.scrollTo(0, 0);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
