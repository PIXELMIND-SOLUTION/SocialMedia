import React from "react";
import PropTypes from "prop-types";

const ImageGrid = ({ images, onImageClick, selectedImage }) => {
  return (
    <div className={selectedImage ? "col-md-8 col-lg-8" : "col-12"}>
      <div className="row">
        <div className="col-12">
          <div className="masonry">
            {images.map((image, index) => (
              <div
                key={index}
                className="masonry-item mb-3"
                onClick={() => onImageClick(image)}
              >
                <img
                  src={image.url}
                  alt={`img-${index}`}
                  className="img-fluid rounded"
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
        .masonry {
  column-count: 5; /* number of columns */
  column-gap: 1rem; /* gap between columns */
}

.masonry-item {
  break-inside: avoid; /* prevents image cutting */
}

@media (max-width: 992px) {
  .masonry {
    column-count: 3; /* tablet */
  }
}

@media (max-width: 576px) {
  .masonry {
    column-count: 1; /* mobile */
  }
}

        `}
      </style>
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
  selectedImage: PropTypes.object,
};

export default ImageGrid;
