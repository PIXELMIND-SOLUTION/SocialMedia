import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MyProfile = () => {
  const [showAbout, setShowAbout] = useState(false);

  // Images array with metadata
  const images = [
    {
      id: 1,
      url: "/assets/images/a1.png",
      title: "Tiger Graphic Design",
      description: "Bold black and yellow tiger design for branding.",
      stats: {
        saves: 4,
        likes: 1,
        views: 125,
        downloads: 32,
      },
      comments: [
        {
          user: "Naveen",
          text: "Nice!",
          avatar: "/assets/images/avatar1.png",
          date: "2 days ago",
        },
        {
          user: "Alex",
          text: "Great colors!",
          avatar: "/assets/images/avatar2.png",
          date: "1 week ago",
        },
      ],
      height: 300,
      width: 400,
      size: "1.2 MB",
      format: "PNG",
      tags: ["tiger", "graphic design", "branding", "yellow"],
      createdDate: "2023-05-15",
      location: "New York, USA",
      license: "Royalty-free",
      price: "$19.99",
      rating: 4.5,
      category: "Graphic Design",
      colorPalette: ["#FFD700", "#000000", "#FFFFFF", "#808080"],
    },
    {
      id: 2,
      url: "/assets/images/a2.png",
      title: "Girl on Scooter",
      description: "Anime-style girl riding a scooter by the ocean.",
      stats: {
        saves: 8,
        likes: 3,
        views: 210,
        downloads: 45,
      },
      comments: [
        {
          user: "Sarah",
          text: "Beautiful colors!",
          avatar: "/assets/images/avatar3.png",
          date: "3 days ago",
        },
      ],
      height: 400,
      width: 600,
      size: "2.1 MB",
      format: "JPEG",
      tags: ["anime", "scooter", "ocean", "girl"],
      createdDate: "2023-06-20",
      location: "Tokyo, Japan",
      license: "Creative Commons",
      price: "Free",
      rating: 4.2,
      category: "Illustration",
      colorPalette: ["#00BFFF", "#FF69B4", "#FFFFFF", "#000000"],
    },
  ];

  return (
    <>
      {/* Profile Header */}
      <Container className="py-4">
        <Row className="align-items-center text-center text-md-start">
          <Col md="auto" className="mb-3 mb-md-0">
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#e6ccff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              P
            </div>
          </Col>
          <Col>
            <h4 className="mb-1">Pixelmind sloution</h4>
            <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
              Pixelmindsolutions.com "Welcome to our future tech house, your
              one-stop destination for cutting-edge digital solutions!"
            </p>
            <p className="mb-2" style={{ fontSize: "14px" }}>
              <strong>875</strong> followers · <strong>5</strong> following
            </p>
            <div className="d-flex gap-2 justify-content-center justify-content-md-start">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowAbout(true)}
              >
                About
              </Button>
              <Button variant="primary" size="sm">
                + Follow
              </Button>
            </div>
          </Col>
        </Row>

        {/* Posts Grid */}
        <Row className="mt-4 g-3">
          {images.map((img) => (
            <Col key={img.id} xs={6} sm={4} md={3} lg={2}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={img.url}
                  alt={img.title}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Card.Body className="p-2">
                  <Card.Title
                    className="mb-1"
                    style={{ fontSize: "0.9rem", fontWeight: "500" }}
                  >
                    {img.title}
                  </Card.Title>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#666",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>❤️ {img.stats.likes}</span>
                    <span>👁 {img.stats.views}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* About Modal */}
      <Modal show={showAbout} onHide={() => setShowAbout(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>About Pixelmind sloution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <a
              href="https://pixelmindsloution.com"
              target="_blank"
              rel="noreferrer"
            >
              Pixelmindsloution.com
            </a>
          </p>
          <p>
            <strong>885</strong> followers · <strong>5</strong> following
          </p>
          <p>
            Unlock your business potential with our excellent IT services
            designed to drive success. Tailored solutions to seamless support,
            we ensure your technology works for you, every step of the way.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAbout(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyProfile;
