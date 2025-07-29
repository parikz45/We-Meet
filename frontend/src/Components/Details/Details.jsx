import React, { useContext, useEffect, useState } from 'react';
import "./Details.css";
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Details() {
  const User = JSON.parse(localStorage.getItem("user"));
  const [currentState, setCurrentState] = useState("");
  const [city, setCity] = useState("");
  const [relation, setRelation] = useState("");
  const navigate = useNavigate();

  // collecting and loading user details
  const handleSubmit = async () => {
    try {
      const userDetails = await axios.put(`http://localhost:8800/api/users/${User._id}`,
        {
          userId: User._id,
          state: currentState || User.state || "",
          city: city || User.city || "",
          relationship: relation || User.relationship || ""
        }
      );

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    console.log("localStorage.getItem('user') =", User);
  }, [])

  return (
    <div className="details-wrapper">
      <div className="details">

        {/* title */}
        <span className="details-head">Tell us more about yourself</span>

        {/* state */}
        <div className="state">
          <span className="details-span">Which state are you from?</span>
          <input defaultValue={User.state || ""} onChange={(e) => setCurrentState(e.target.value)} className="details-input" />
        </div>

        {/* city */}
        <div className="city">
          <span className="details-span">Which city are you from?</span>
          <input defaultValue={User.city || ""} onChange={(e) => setCity(e.target.value)} className="details-input" />
        </div>

        {/* relationship status */}
        <div className="relationship">
          <span className="details-span">Relationship status</span>
          <select defaultValue={User.relationship || ""} onChange={(e) => setRelation(e.target.value)} className="dropbox-input" >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </div>

        <div className="next">
          {/* re-route to main page */}
          <a href='/'>Skip</a>

          {/* submit button */}
          <button onClick={handleSubmit} className="details-submit">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Details
