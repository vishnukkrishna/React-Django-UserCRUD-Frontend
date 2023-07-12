import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import "./userprofile.css";
import "./HomeComponent.css";
import image from "./../images/lionel.jpg";
import image1 from "./../images/messi.jpeg";

function HomeComponent() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function getNotes() {
      try {
        const response = await axios.get("http://localhost:8000/api/notes/");
        setNotes(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getNotes();
  }, []);

  return (
    <div className="home-div">
      <div className="container-note">
        <h1>Welcome To HomePage</h1>
        <div
          className="note-contain"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {notes.map((note) => (
            <div className="single-note" key={note.id}>
              <p className="title">{note.title}</p>
              <p>{note.description}</p>
              <p className="rating-no">
                Rating: {note.rating} <AiFillStar />
              </p>
            </div>
          ))}
        </div>
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={image} className="d-block w-100" alt="Image 1" />
            </div>
            <div className="carousel-item">
              <img src={image1} className="d-block w-100" alt="Image 2" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
