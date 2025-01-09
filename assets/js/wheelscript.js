const section = document.querySelector(".date-timeline-section");
const circle = document.querySelector(".circle");
const dateListItems = document.querySelectorAll(".date-list");
const dotsListItems = document.querySelectorAll(".dots1, .dots2, .dots3, .dots4, .dots5, .dots6");
const activeTitle = document.getElementById("active-title");

dateListItems.forEach((item) => {
	const dateListItemsSpan = item.querySelector(".inner-text");

	const angle = parseInt(item.getAttribute("data-angle"));
	item.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-340px)`;
	dateListItemsSpan.style.transform = `rotate(${-angle}deg)`;
});

dotsListItems.forEach((dotsItem) => {
	const angle = parseInt(dotsItem.getAttribute("data-angle"));
	dotsItem.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-299px)`;
});

const tl = gsap.timeline({
	scrollTrigger: {
		trigger: section,
		scrub: 1,
		pin: true,
		markers: false,
		snap: {
			snapTo: 1 / 6,
		},
		ease: "none",
		onUpdate: updateActiveDate,
	},
});

// Slow down the rotation by increasing the duration (e.g., 10 seconds)
tl.to(circle, {
	rotation: "+=360",
	duration: 10, // Increased duration for slower rotation
	ease: "none",
});

tl.to(
	".date-list .date, .date-list .text",
	{
		rotation: -360,
		duration: 10, // Match the duration of the circle rotation
		ease: "none",
	},
	"<"
);

function updateActiveDate() {
	const circleRect = circle.getBoundingClientRect();
	const circleCenterX = circleRect.left + circleRect.width / 2;
	const circleCenterY = circleRect.top + circleRect.height / 2;

	const tolerance = Math.PI / 6;

	dateListItems.forEach((date, index) => {
		const dateRect = date.getBoundingClientRect();
		const dateCenterX = dateRect.left + date.offsetWidth / 2;
		const dateCenterY = dateRect.top + date.offsetHeight / 2;

		const angle = Math.atan2(dateCenterY - circleCenterY, dateCenterX - circleCenterX);

		const angleDifference = Math.abs(angle);

		if (angleDifference <= tolerance) {
			date.classList.add("active");
			const textList = document.querySelectorAll(".text-list .out-text");
			textList.forEach((text, textIndex) => {
				if (index === textIndex) {
					text.classList.add("active");
					activeTitle.classList.add("example");

					const h2Element = text.querySelector("h2"); // Select the <h2> element
					if (h2Element) {
						activeTitle.innerHTML = h2Element.innerHTML; // Update spinner text with <h2> content
					}
				} else {
					text.classList.remove("active");
				}
			});

			dotsListItems.forEach((dot, dotIndex) => {
				if (index === dotIndex) {
					dot.classList.add("active");
				} else {
					dot.classList.remove("active");
				}
			});
		} else {
			date.classList.remove("active");
		}
	});
}

{
	/* <script>
const icons = document.querySelectorAll(".icon");
const content = document.getElementById("content");
const wheel_circle = document.getElementById("circle");
let activeIndex = 0;
let rotationAngle = 0;
let direction = 1; // 1 for clockwise, -1 for counterclockwise

function rotateCircle() {
	// Highlight the active icon
	icons.forEach((icon, index) => {
		const span = icon.querySelector("span");
		span.style.transform = `rotate(${-rotationAngle}deg)`; // Keep icons upright
		span.style.transition = "transform 1s ease"; // Add smooth transition

		if (index === activeIndex) {
			icon.classList.add("active");
			content.textContent = icon.getAttribute("data-content");
		} else {
			icon.classList.remove("active");
		}
	});

	// Pause for 3 seconds
	setTimeout(() => {
		rotationAngle += 60 * direction;
		if (rotationAngle % 360 === 0) {
			direction *= -1; // Reverse direction after a full rotation
		}
		wheel_circle.style.transform = `rotate(${rotationAngle}deg)`;
		activeIndex = (activeIndex + direction + icons.length) % icons.length;
	}, 3000);
}

setInterval(rotateCircle, 4500); // Total interval: 1.5s rotation + 3s pause
new WOW().init(); // Initialize WOW.js
</script> */
}
