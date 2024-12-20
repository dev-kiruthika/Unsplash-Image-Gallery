$(document).ready(function () {
  const accessKey = "lSBX0yfD-8KbxIaYiKPhqsomFB6JXd0Z553jAoJZ3Dg"; // Replace with your Unsplash Access Key
  let currentPage = 1; // Current page number
  const perPage = 12; // Number of images per page
  const url = `https://api.unsplash.com/photos`;

  // Initialize Masonry once
  const $gallery = $("#grid").masonry({
    itemSelector: ".grid-item",
    columnWidth: ".grid-item",
    percentPosition: true,
  });

  // Fetch images for a specific page
  function fetchImages(page) {
    $.ajax({
      url: url,
      type: "GET",
      data: {
        client_id: accessKey,
        page: page,
        per_page: perPage,
      },
      dataType: "json",
      success: function (response) {
        displayImages(response);
      },
      error: function (error) {
        console.error("Error fetching images: ", error);
        alert("An error occurred while fetching images.");
      },
    });
  }

  function displayImages(images) {
    images.forEach((image) => {
      // Construct the metadata for Fancybox
      const caption = `
          <div class="fancybox-caption">
            <h4>Author: ${image.user.name}</h4>
            <p>${image.alt_description || "No description available"}</p>
            <p><strong>Likes:</strong> ${image.likes || 0}</p>
          </div>
        `;

      // Create the image card
      const imgElement = `
          <div class="grid-item">
            <a href="${
              image.urls.full
            }" data-fancybox="gallery" data-caption='${caption}'>
              <img src="${image.urls.small}" alt="${
        image.alt_description || "Image"
      }">
            </a>
            <ul class="image-details">
             
                <li class="author-info">
                  <h4>${image.user.name}</h4>
                </li>
              
              <li class="image-stats">
                <p>${image.alt_description || "No description available"}</p>
              </li>
            </div>
          </ul>
        `;

      // Append the new image card to the gallery
      $gallery.append(imgElement);
    });

    // Once images are appended, reload Masonry layout
    $gallery.imagesLoaded(function () {
      $gallery.masonry("reloadItems"); // Reload items
      $gallery.masonry("layout"); // Recalculate the layout
    });

    // Initialize Fancybox with custom caption handling
    $("[data-fancybox='gallery']").fancybox({
      loop: true,
      buttons: ["zoom", "close"],
      caption: function (instance, item) {
        return $(this).data("caption"); // Use the caption from the `data-caption` attribute
      },
    });
  }
  // Load More button click handler
  $("#load-more").on("click", function () {
    currentPage++; // Increment the current page number
    fetchImages(currentPage); // Fetch new images for the next page
  });
  // Initial fetch of images
  fetchImages(currentPage);
});
