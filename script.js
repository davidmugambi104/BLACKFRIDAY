// Function to fetch products from JSON Server and render them
function fetchAndDisplayProducts() {
    fetch('http://localhost:3000/products')  // URL to the JSON Server API
        .then(response => response.json())  // Parse the JSON response
        .then(products => {
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = '';  // Clear any existing content

            // Loop through each product and create HTML elements
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                // HTML structure for each product, wrapped inside <figure> for PhotoSwipe
                productDiv.innerHTML = `
                    <div class="my-gallery">
                        <figure class="col-12 col-md-6" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
                            <a href="${product.imageUrl}" data-size="900x1200" itemprop="contentUrl">
                                <img src="${product.imageUrl}" class="works-image" itemprop="thumbnail" alt="${product.name}">
                            </a>
                            <figcaption class="works-description" itemprop="caption description">
                                <h4>${product.name} <small>${product.brand}</small></h4>
                                <p>${product.description}</p>
                                <p class="product-price">$${product.price.toFixed(2)}</p>
                                <p class="product-category">Category: ${product.category}</p>
                                <p class="product-size">Size: ${product.size}</p>
                                <p class="product-color">Color: ${product.color}</p>
                            </figcaption>
                        </figure>
                    </div>
                `;

                // Append the product to the container
                productContainer.appendChild(productDiv);
            });

            // Initialize PhotoSwipe after products are rendered
            initPhotoSwipeFromDOM('.my-gallery');
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
}

// Call the fetchAndDisplayProducts function to render the products
fetchAndDisplayProducts();

// PhotoSwipe structure and initialization
var initPhotoSwipeFromDOM = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element

            if (figureEl.nodeType !== 1) continue; // only element nodes

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');
            
            if (!size || size.length !== 2) {
                console.error("Invalid 'data-size' format: ", linkEl);
                continue; // Skip if size is not correct
            }

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };

            if (figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) return;

        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        // Find index of clicked item
        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) continue;

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    var openPhotoSwipe = function(index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        if (items.length === 0) {
            console.error("No valid items found for PhotoSwipe.");
            return; // Prevent opening PhotoSwipe if no items are found
        }

        options = {
            showHideOpacity: true,
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }
        };

        options.index = index;

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // Loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    if (galleryElements.length === 0) {
        console.error("No gallery elements found.");
    }

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
};

// Example of adding the PhotoSwipe modal HTML structure to the page
const pswpContainer = document.createElement('div');
pswpContainer.classList.add('pswp');
pswpContainer.innerHTML = `
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <button class="pswp__button pswp__button--share" title="Share"></button>
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
`;
document.body.appendChild(pswpContainer);
