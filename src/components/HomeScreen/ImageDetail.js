import React from 'react';
import PropTypes from 'prop-types';

const ImageDetail = ({ 
  image, 
  onBack, 
  onOpenGalleria,
  onCommentSubmit,
  newComment,
  setNewComment
}) => {
  return (
    <div className="col-md-4">
      <div className="bg-light p-4 sticky-top" style={{
        top: '20px',
        borderRadius: '15px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Details</h4>
          <button
            className="btn btn-sm btn-dark rounded-circle"
            onClick={onBack}
          >
            ✕
          </button>
        </div>

        <div className="mb-4 position-relative"
          style={{
            overflow: 'hidden',
            height: '300px',
            cursor: 'pointer'
          }}
          onClick={onOpenGalleria}
        >
          <img
            src={image.url}
            alt={image.title}
            className="rounded w-100 h-100"
            style={{ objectFit: 'contain' }}
          />
        </div>

        <h5>{image.title}</h5>
        <p className="text-muted">{image.description}</p>
        <div className="d-flex gap-3 mb-3">
          <span><i className="bi bi-bookmark me-1"></i> {image.stats.saves} Saves</span>
          <span><i className="bi bi-heart me-1"></i> {image.stats.likes} Likes</span>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <img
              src={image.user?.profileImage}
              alt="User"
              className="rounded-circle me-3"
              style={{ width: '40px', height: '40px' }}
            />
            <div>
              <h6 className="mb-0">{image.user?.name}</h6>
            </div>
          </div>
          <button className="btn btn-sm btn-outline-primary">+ Follow</button>
        </div>

        <hr className="my-4" />

        <div className="mb-4">
          <h6>Comments ({image.comments.length})</h6>
          <div className="mt-3">
            {image.comments.map((comment, index) => (
              <div key={index} className="mb-2 p-2 glass-effect rounded">
                <strong>{comment.user}</strong>: {comment.text}
              </div>
            ))}
          </div>
          <form onSubmit={onCommentSubmit} className="mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Post</button>
            </div>
          </form>
        </div>

        <hr className="my-4" />

        <div className="mb-4">
          <h6>Reach. Engage. Convert.</h6>
          <p className="text-muted small">Social Media Marketing, That Works</p>
        </div>

        <div className="mb-4">
          <h6>Redeuthen</h6>
          <p className="text-muted small">Safe Pixtinfo Solutions</p>
        </div>

        <div>
          <h6>Expansions</h6>
          <ul className="list-unstyled small">
            {image.expansions.map((item, index) => (
              <li key={index} className="mb-2">• {item}</li>
            ))}
          </ul>
        </div>

        <button className="btn btn-primary w-100 mt-3 rounded-pill">
          Download Image
        </button>
      </div>
    </div>
  );
};

ImageDetail.propTypes = {
  image: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onOpenGalleria: PropTypes.func.isRequired,
  onCommentSubmit: PropTypes.func.isRequired,
  newComment: PropTypes.string.isRequired,
  setNewComment: PropTypes.func.isRequired
};

export default ImageDetail;