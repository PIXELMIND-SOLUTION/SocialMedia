import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Image,
  Tab,
  Tabs,
  Badge,
  ListGroup
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaEye, FaDownload, FaRegClock, FaUser, FaPalette } from "react-icons/fa";
import images from "../components/mockData";

const UserProfile = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [activeTab, setActiveTab] = useState("uploads");
  const [selectedImage, setSelectedImage] = useState(null);

  // Current user data
  const currentUser = {
    id: 1,
    name: "vijay",
    profileImage: "/assets/images/a1.png",
    bio: "Digital artist and graphic designer with 5+ years experience creating bold visual identities",
    followers: 875,
    following: 142,
    joinedDate: "January 2020",
    location: "New York, USA",
    stats: {
      uploads: 24,
      likes: 1560,
      views: 12500,
      downloads: 3200,
      rating: 4.7
    }
  };

  // Filter images for this user
  const userImages = images.filter(img => img.user?.name === currentUser.name);

  // Filter saved/liked images (example)
  const savedImages = images.filter(img => img.stats.saves > 10).slice(0, 6);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  return (
    <>
      {/* Profile Header */}
      <Container className="py-4">
        <Row className="align-items-center text-center text-md-start">
          <Col md="auto" className="mb-3 mb-md-0">
            <Image
              src={currentUser.profileImage}
              roundedCircle
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "3px solid #e6ccff"
              }}
              alt={currentUser.name}
            />
          </Col>
          <Col>
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-2">
              <h2 className="mb-0">{currentUser.name}</h2>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">Edit Profile</Button>
                <Button variant="primary" size="sm">Share</Button>
              </div>
            </div>
            
            <div className="d-flex gap-4 mb-2">
              <div>
                <strong>{userImages.length}</strong> posts
              </div>
              <div>
                <strong>{currentUser.followers}</strong> followers
              </div>
              <div>
                <strong>{currentUser.following}</strong> following
              </div>
            </div>
            
            <p className="mb-2">{currentUser.bio}</p>
            <p className="text-muted small">
              <FaUser className="me-1" /> Joined {currentUser.joinedDate} · 
              <FaPalette className="ms-2 me-1" /> {currentUser.stats.rating}★ rating
            </p>
          </Col>
        </Row>

        {/* Stats and About Button */}
        <Row className="mt-3 mb-4">
          <Col>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowAbout(true)}
              className="d-flex align-items-center gap-1"
            >
              <span>View Full Stats</span>
            </Button>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="uploads" title={`Uploads (${userImages.length})`} />
          <Tab eventKey="saved" title={`Saved (${savedImages.length})`} />
          <Tab eventKey="stats" title="Statistics" />
        </Tabs>

        {/* Tab Content */}
        {activeTab === "uploads" && (
          <Row className="g-3">
            {userImages.map((img) => (
              <Col key={img.id} xs={6} sm={4} md={3} lg={2}>
                <Card className="h-100 shadow-sm border-0" onClick={() => handleImageClick(img)}>
                  <Card.Img
                    variant="top"
                    src={img.url}
                    alt={img.title}
                    style={{ height: "150px", objectFit: "cover", cursor: "pointer" }}
                  />
                  <Card.Body className="p-2">
                    <Card.Title className="mb-1" style={{ fontSize: "0.9rem" }}>
                      {img.title}
                    </Card.Title>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>
                        <FaHeart className="me-1" /> {img.stats.likes}
                      </span>
                      <span>
                        <FaEye className="me-1" /> {img.stats.views}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {activeTab === "saved" && (
          <Row className="g-3">
            {savedImages.map((img) => (
              <Col key={img.id} xs={6} sm={4} md={3} lg={2}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    src={img.url}
                    alt={img.title}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <Card.Body className="p-2">
                    <small className="text-muted">Saved by {img.stats.saves} users</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {activeTab === "stats" && (
          <Card className="p-3">
            <h5>Activity Statistics</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total Uploads</span>
                <Badge bg="primary">{currentUser.stats.uploads}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total Likes Received</span>
                <Badge bg="primary">{currentUser.stats.likes}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total Views</span>
                <Badge bg="primary">{currentUser.stats.views}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total Downloads</span>
                <Badge bg="primary">{currentUser.stats.downloads}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Average Rating</span>
                <Badge bg="success">{currentUser.stats.rating} ★</Badge>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        )}
      </Container>

      {/* About Modal */}
      <Modal show={showAbout} onHide={() => setShowAbout(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>About {currentUser.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4} className="text-center">
              <Image
                src={currentUser.profileImage}
                roundedCircle
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  border: "4px solid #e6ccff"
                }}
                alt={currentUser.name}
                className="mb-3"
              />
              <h4>{currentUser.name}</h4>
              <p className="text-muted">{currentUser.location}</p>
            </Col>
            <Col md={8}>
              <h5>Bio</h5>
              <p>{currentUser.bio}</p>
              
              <h5 className="mt-4">Statistics</h5>
              <div className="d-flex flex-wrap gap-4 mb-3">
                <div className="text-center">
                  <div className="fs-3">{currentUser.stats.uploads}</div>
                  <small className="text-muted">Uploads</small>
                </div>
                <div className="text-center">
                  <div className="fs-3">{currentUser.followers}</div>
                  <small className="text-muted">Followers</small>
                </div>
                <div className="text-center">
                  <div className="fs-3">{currentUser.following}</div>
                  <small className="text-muted">Following</small>
                </div>
                <div className="text-center">
                  <div className="fs-3">{currentUser.stats.rating}★</div>
                  <small className="text-muted">Rating</small>
                </div>
              </div>
              
              <h5 className="mt-4">Member Since</h5>
              <p>{currentUser.joinedDate}</p>
              
              <h5 className="mt-4">Contact</h5>
              <Button variant="outline-primary" size="sm" className="me-2">
                Send Message
              </Button>
              <Button variant="outline-secondary" size="sm">
                View Portfolio
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAbout(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Detail Modal */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} size="lg" centered>
        {selectedImage && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedImage.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    fluid
                    className="mb-3"
                  />
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={selectedImage.user.profileImage}
                      roundedCircle
                      style={{ width: "40px", height: "40px" }}
                      className="me-2"
                    />
                    <div>
                      <div>{selectedImage.user.name}</div>
                      <small className="text-muted">{selectedImage.createdDate}</small>
                    </div>
                  </div>
                  
                  <p>{selectedImage.description}</p>
                  
                  <div className="d-flex gap-3 mb-3">
                    <div>
                      <FaHeart className="me-1 text-danger" />
                      <span>{selectedImage.stats.likes} likes</span>
                    </div>
                    <div>
                      <FaEye className="me-1" />
                      <span>{selectedImage.stats.views} views</span>
                    </div>
                    <div>
                      <FaDownload className="me-1" />
                      <span>{selectedImage.stats.downloads} downloads</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Details</h6>
                    <div className="small">
                      <div>
                        <strong>Size:</strong> {selectedImage.width} × {selectedImage.height} px
                      </div>
                      <div>
                        <strong>File size:</strong> {selectedImage.size}
                      </div>
                      <div>
                        <strong>Format:</strong> {selectedImage.format}
                      </div>
                      <div>
                        <strong>Category:</strong> {selectedImage.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Tags</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedImage.tags.map(tag => (
                        <Badge key={tag} bg="secondary" pill>{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedImage(null)}>
                Close
              </Button>
              <Button variant="primary">View Full Details</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserProfile;