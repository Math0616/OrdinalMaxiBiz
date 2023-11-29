document.addEventListener('DOMContentLoaded', function() {
	fetch('images.json')
	.then(response => response.json())
	.then(data => {
		const gallery = document.querySelector('.gallery');
		data.forEach(image => {
		const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;

		// Create gallery item container
		const galleryItem = document.createElement('div');
		galleryItem.classList.add('gallery-item');

		// Set eyeColor and other optional attributes as data attributes
		const attributes = ['eyeColor', 'gender', 'hat', 'speaking', 'smoking', 'noFace', 'demon', 'alien', 'weapon', 'ape', 'openScalp', 'miner', 'shadow', 'lfg', 'clown', 'hoodie', 'famous', 'letterhead', 'robot', 'punk', 'undead', 'mask'];
		attributes.forEach(attr => {
			if (image[attr]) {
			galleryItem.dataset[attr] = 'true';
			}
		});

		// Create link element
		const link = document.createElement('a');
		link.href = `https://magiceden.io/ordinals/item-details/${image.tokenId}`;
		link.target = "_blank";

		// Create image container
		const imageContainer = document.createElement('div');
		imageContainer.classList.add('image-container');

		// Create and set image element
		const img = document.createElement('img');
		img.dataset.src = imageUrl;
		img.alt = `Ordinal Maxi Biz #${image.tokenId}`;
		img.classList.add('lazyload');

		// Append image to its container
		imageContainer.appendChild(img);

		// Append image container to link
		link.appendChild(imageContainer);

		// Append link to gallery item
		galleryItem.appendChild(link);

		// Price tag with Bitcoin symbol
		if (image.price) {
			const priceTag = document.createElement('div');
			priceTag.classList.add('price-tag');
			priceTag.textContent = `₿${image.price}`;
			galleryItem.appendChild(priceTag);
		}

		// Append gallery item to gallery
		gallery.appendChild(galleryItem);
		});

		// After adding all images to the gallery, initialize lazy loading
		initializeLazyLoad();
		updateCount(); // This will update the count when the page loads
	})
	.catch(error => console.error('Error loading image data:', error));
});  

function initializeLazyLoad() {
const lazyImages = document.querySelectorAll('img.lazyload');

const imageObserver = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
	if (entry.isIntersecting) {
		const img = entry.target;
		img.src = img.getAttribute('data-src');
		img.classList.remove('lazyload');
		observer.unobserve(entry.target);
	}
	});
});

lazyImages.forEach(img => {
	imageObserver.observe(img);
});
}

function updateCount() {
	// Select all the gallery items
	const galleryItems = document.querySelectorAll('.gallery-item');
	// Use Array.prototype.filter to count the items that are currently visible
	const count = Array.from(galleryItems).filter(item => item.style.display !== 'none').length;
	// Update the display with the new count. You will need an element in your HTML to show the count.
	const countDisplay = document.getElementById('count-display');
	if (countDisplay) {
	countDisplay.textContent = `${count} OMBs`;
	}
}

function toggleDropdown(show) {
	const filterOptions = document.getElementById('filter-options');
	if (show) {
	filterOptions.classList.add('show');
	} else {
	filterOptions.classList.remove('show');
	}
}  

// Add event listeners to checkboxes
document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
	checkbox.addEventListener('change', filterGallery);
});

function filterGallery() {
    // Get checked attributes from other filters
    const checkedAttributes = Array.from(document.querySelectorAll('.filter-dropdown input[type="checkbox"]:not([name="eyeColor"], [name="single-attribute"])'))
        .map(checkbox => checkbox.name);
    const checkedEyeColors = Array.from(document.querySelectorAll('.filter-dropdown input[type="checkbox"][name="eyeColor"]:checked'))
        .map(checkbox => checkbox.value);
    const isSingleAttributeChecked = document.getElementById('single-attribute').checked;

    // Loop over each gallery item
    document.querySelectorAll('.gallery-item').forEach(item => {
        let shouldDisplay = true; // Start with a default of showing the item

        // Check for eye color attribute if eye color filters are used
        if (checkedEyeColors.length > 0) {
            shouldDisplay = shouldDisplay && checkedEyeColors.includes(item.dataset.eyeColor);
        }

        // Check for other attributes
        shouldDisplay = shouldDisplay && checkedAttributes.every(attr => item.dataset[attr] === 'true');

        // If the "Single Attribute Only" is checked
        if (isSingleAttributeChecked) {
            const attributesOnItem = Object.keys(item.dataset).filter(key => item.dataset[key] === 'true');
            // Adjust the condition to check if the item has exactly one attribute, which must be 'eyeColor'
            shouldDisplay = shouldDisplay && attributesOnItem.length === 1 && attributesOnItem.includes('eyeColor');
        }

        // Apply the final display property based on the shouldDisplay boolean
        item.style.display = shouldDisplay ? 'block' : 'none';
    });

    // Update the count display
    updateCount();
}

// Add event listeners to all checkboxes within the dropdown for filtering
document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterGallery);
});

// Call filterGallery on page load to apply any default filter settings
document.addEventListener('DOMContentLoaded', filterGallery);
