import React from 'react';
import PropTypes from 'prop-types';
import ImageColumn from './ImageColumn';

const createColumns = (images, numColumns = 5) => {
  const columns = Array(numColumns).fill().map(() => []);
  images.forEach((image, index) => {
    const columnIndex = index % numColumns;
    columns[columnIndex].push(image);
  });
  return columns;
};

const ImageGrid = ({ images, onImageClick, selectedImage }) => {
  const columns = createColumns(images);
  
  return (
    <div className={selectedImage ? "col-md-8 col-lg-8" : "col-12"}>
      <div className="row">
        {columns.map((column, colIndex) => (
          <ImageColumn 
            key={colIndex} 
            images={column} 
            onImageClick={onImageClick} 
          />
        ))}
      </div>
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
  selectedImage: PropTypes.object
};

export default ImageGrid;