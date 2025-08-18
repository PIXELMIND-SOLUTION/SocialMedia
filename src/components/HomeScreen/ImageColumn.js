import React from 'react';
import PropTypes from 'prop-types';
import ImageCard from './ImageCard';

const ImageColumn = ({ images, onImageClick }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6">
      {images.map((image) => (
        <ImageCard 
          key={image.id} 
          image={image} 
          onClick={onImageClick} 
        />
      ))}
    </div>
  );
};

ImageColumn.propTypes = {
  images: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired
};

export default ImageColumn;