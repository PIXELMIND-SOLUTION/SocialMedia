import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Image,
  Tab,
  Tabs,
  Badge,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaEye, FaDownload, FaUser, FaPalette } from "react-icons/fa";
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
      rating: 4.7,
    },
  };

  // User images
  const userImages = images.filter((img) => img.user?.name === currentUser.name);
  const savedImages = images.filter((img) => img.stats.saves > 10).slice(0, 6);

  const handleImageClick = (img) => setSelectedImage(img);

  return (
    <>
      <Container className="py-4">
        {/* Profile Header */}
        <Row className="align-items-center text-center text-md-start mb-4">
          <Col md="auto" className="mb-3 mb-md-0">
            <Image
              src={currentUser.profileImage}
              roundedCircle
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
              }}
              alt={currentUser.name}
            />
          </Col>
          <Col>
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-2">
              <h2 className="mb-0">{currentUser.name}</h2>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">
                  Edit Profile
                </Button>
                <Button variant="outline-primary" size="sm">
                  Share
                </Button>
              </div>
            </div>

            <div className="d-flex gap-4 mb-2 justify-content-center justify-content-md-start">
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

            <p className="mb-1">{currentUser.bio}</p>
            <p className="text-muted small">
              <FaUser className="me-1" /> Joined {currentUser.joinedDate} ·
              <FaPalette className="ms-2 me-1" /> {currentUser.stats.rating}★
              rating
            </p>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 justify-content-center"
        >
          <Tab eventKey="uploads" title="Posts" />
          <Tab eventKey="saved" title="Saved" />
          <Tab eventKey="stats" title="Statistics" />
        </Tabs>

        {/* Posts Grid (Instagram Style) */}
        {activeTab === "uploads" && (
          <Row className="g-2">
            {userImages.map((img) => (
              <Col key={img.id} xs={4} sm={4} md={3}>
                <div
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => handleImageClick(img)}
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <div className="text-white small d-flex gap-3">
                      <span>
                        <FaHeart /> {img.stats.likes}
                      </span>
                      <span>
                        <FaEye /> {img.stats.views}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Saved Posts */}
        {activeTab === "saved" && (
          <Row className="g-2">
            {savedImages.map((img) => (
              <Col key={img.id} xs={4} sm={4} md={3}>
                <Image
                  src={img.url}
                  alt={img.title}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                  }}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Statistics */}
        {activeTab === "stats" && (
          <div className="p-3 border rounded">
            <h5>Activity Statistics</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total Uploads</span>
                <Badge bg="primary">{currentUser.stats.uploads}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Total Likes</span>
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
                <span>Rating</span>
                <Badge bg="success">{currentUser.stats.rating} ★</Badge>
              </ListGroup.Item>
            </ListGroup>
          </div>
        )}
      </Container>

      {/* Image Modal (Instagram Post Style) */}
      <Modal
        show={!!selectedImage}
        onHide={() => setSelectedImage(null)}
        size="lg"
        centered
      >
        {selectedImage && (
          <>
            <Modal.Body className="p-0">
              <Row className="g-0">
                <Col md={7} className="bg-dark d-flex align-items-center">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    fluid
                    style={{ maxHeight: "90vh", objectFit: "contain" }}
                    className="mx-auto"
                  />
                </Col>
                <Col md={5} className="p-3">
                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={selectedImage.user.profileImage}
                      roundedCircle
                      style={{ width: "40px", height: "40px" }}
                      className="me-2"
                    />
                    <div>
                      <strong>{selectedImage.user.name}</strong>
                      <div className="text-muted small">
                        {selectedImage.createdDate}
                      </div>
                    </div>
                  </div>

                  <p>{selectedImage.description}</p>

                  <div className="d-flex gap-3 mb-3">
                    <span>
                      <FaHeart className="me-1 text-danger" />{" "}
                      {selectedImage.stats.likes}
                    </span>
                    <span>
                      <FaEye className="me-1" /> {selectedImage.stats.views}
                    </span>
                    <span>
                      <FaDownload className="me-1" />{" "}
                      {selectedImage.stats.downloads}
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-1">
                    {selectedImage.tags.map((tag) => (
                      <Badge key={tag} bg="secondary" pill>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserProfile;
