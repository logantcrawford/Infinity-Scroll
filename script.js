const { api_key } = require("./variables");

const image_container = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let is_init_load = true
let images_loaded = 0;
let total_images = 0;
let photos_array = [];

// Unsplash API
const init_count = 5;
const post_count = 30;
const api_key = 'ENTER_API_KEY'
const api_url = `https://api.unsplash.com/photos/random?client_id=${api_key}&count=${init_count}`;

// Changes API URL after init load
function update_api(count) {
    api_url = `https://api.unsplash.com/photos/random?client_id=${api_key}&count=${count}`;
};

// Check if all images were loaded
function image_loaded() {
    images_loaded++;
    if (images_loaded === total_images) {
        ready = true;
        loader.hidden = true;
    };
};

// Helper Function to set Attributes on DOM Elements.
function set_attributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    };
};

// Create elements for links and photos, and to DOM
function display_photos() {
    images_loaded = 0;
    total_images = photos_array.length;
    // Run function for each object in photos_array
    photos_array.forEach((photo) => {
        // Create <a> to link to Unsplash
        const item = document.createElement('a');
        set_attributes(item, {
            href: photo.links.html,
            target: '_blank',
        });
        // Create <img> for photo
        const img = document.createElement('img');
        set_attributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        })
        // Event Listener, check when each is finished loading
        img.addEventListener('load', image_loaded);
        // Put <img> insided <a>, then put both inside image_container Element.
        item.appendChild(img);
        image_container.appendChild(item);
    });
};

// Get photos from Unsplash API
async function get_photos() {
    try {
        const response = await fetch(api_url);
        photos_array = await response.json();
        display_photos();
        if (is_init_load) {
            update_api(post_count);
            is_init_load = false;
        }
    } catch (error) {
        // catch error
    };
};

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    get_photos();
}
});

// On load
get_photos();