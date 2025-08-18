import React from 'react';
import PropTypes from 'prop-types';

const ImageCard = ({ image, onClick }) => {
  return (
    <div
      className="mb-4 position-relative"
      style={{
        height: `${image.height}px`,
        cursor: 'pointer'
      }}
    >
      <div
        className="card h-100 border-0 shadow-sm"
        onClick={() => onClick(image)}
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.querySelector('.image-overlay').style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.querySelector('.image-overlay').style.opacity = '0';
        }}
      >
        <img
          src={image.url}
          alt={image.title}
          className="card-img-top h-100 w-100"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        <div
          className="image-overlay position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <div className="position-absolute top-0 end-0 p-3">
            <button
              className="btn btn-sm btn-light rounded-circle"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <i className="bi bi-bookmark"></i>
            </button>
          </div>
          <div className="position-absolute bottom-0 start-0 p-3 text-white">
            <h6 className="mb-0">{image.title}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

ImageCard.propTypes = {
  image: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ImageCard;