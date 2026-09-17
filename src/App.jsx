import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [step, setStep] = useState(1);
  const [boatName, setBoatName] = useState("");
  const [buildYear, setBuildYear] = useState("");
  const [length, setLength] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [auctionDate, setAuctionDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value) value = "$" + Number(value).toLocaleString();
    setPrice(value);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const maxPhotos = 10;

    if (photos.length + files.length > maxPhotos) {
      setErrors({ ...errors, photos: `Maximum ${maxPhotos} photos allowed` });
      return;
    }

    files.forEach((file) => {
      if (file.size > maxSize) {
        setErrors({ ...errors, photos: "Each photo must be under 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => setPhotos((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (errors.photos) {
      setErrors({ ...errors, photos: undefined });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!boatName.trim()) {
        newErrors.boatName = "Boat name is required";
      } else if (boatName.trim().length < 2) {
        newErrors.boatName = "Boat name must be at least 2 characters";
      }

      if (!buildYear.trim()) {
        newErrors.buildYear = "Build year is required";
      } else if (isNaN(buildYear) || buildYear < 1900 || buildYear > new Date().getFullYear() + 1) {
        newErrors.buildYear = `Enter a valid year between 1900 and ${new Date().getFullYear() + 1}`;
      }

      if (length && (isNaN(length) || parseFloat(length) <= 0 || parseFloat(length) > 200)) {
        newErrors.length = "Enter a valid length (1-200 meters)";
      }
    }
    
    if (step === 2) {
      if (!ownerName.trim()) {
        newErrors.ownerName = "Owner name is required";
      } else if (ownerName.trim().length < 2) {
        newErrors.ownerName = "Name must be at least 2 characters";
      }

      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Enter a valid email address";
      }

      if (phone && !/^[\d\s\+\-\(\)]+$/.test(phone)) {
        newErrors.phone = "Enter a valid phone number";
      }
    }
    
    if (step === 3) {
      if (!auctionDate) {
        newErrors.auctionDate = "Please select an auction date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("https://formspree.io/f/mblzlgve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boatName,
          buildYear,
          length: length || "Not specified",
          price: price || "Not specified",
          description: description || "No description provided",
          location: location || "Not specified",
          ownerName,
          email,
          phone: phone || "Not provided",
          auctionDate,
          photoCount: photos.length,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setSuccessMsg("✅ Thank you! Your boat submission has been received. We'll contact you within 24-48 hours.");
        // Reset form
        setBoatName("");
        setBuildYear("");
        setLength("");
        setPrice("");
        setDescription("");
        setLocation("");
        setOwnerName("");
        setEmail("");
        setPhone("");
        setAuctionDate("");
        setPhotos([]);
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSuccessMsg("❌ Submission failed. Please try again or contact us directly.");
      }
    } catch (error) {
      setSuccessMsg("⚠️ Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="page-container">
      {/* Banner Image */}
      <div className="banner">
        <img
          src="https://assets.cdn.thewebconsole.com/S3WEB6082/a_images/65cc2fbcc37e1.jpg?v=2&m=ce62d7986b4d4f66c2266164106d4883&cropresize(850x607)"
          alt="Marina with boats"
          className="banner-img"
        />
        <div className="banner-overlay">
          <h1 className="banner-title">Boat Auction Submission</h1>
          <p className="banner-text">Sell your boat with confidence</p>
        </div>
      </div>

      <div className="form-card">
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        <div className="step-indicator">
          <span className={step >= 1 ? "active" : ""}>1. Boat</span>
          <span className={step >= 2 ? "active" : ""}>2. Owner</span>
          <span className={step >= 3 ? "active" : ""}>3. Auction</span>
        </div>

        <h1 className="form-title">Register Your Boat for Auction</h1>
        <p className="form-subtitle">
          Complete this form to register your interest. Our team will contact you within 24-48 hours 
          to discuss valuation and next steps.
        </p>

        {successMsg && (
          <div className={`message ${successMsg.includes("✅") ? "success" : "error"}`}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Boat Details */}
          {step === 1 && (
            <div className="step-content">
              <h2 className="step-title">
                <span className="step-number">1</span>
                Boat Details
              </h2>

              <div className="form-group">
                <label>Boat Name <span className="required">*</span></label>
                <input
                  value={boatName}
                  onChange={(e) => setBoatName(e.target.value)}
                  placeholder="e.g. Sea Breeze, Aqua Dream"
                  className={errors.boatName ? "input-error" : ""}
                />
                {errors.boatName && <div className="error">{errors.boatName}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Build Year <span className="required">*</span></label>
                  <input
                    type="number"
                    value={buildYear}
                    onChange={(e) => setBuildYear(e.target.value)}
                    placeholder="2015"
                    className={errors.buildYear ? "input-error" : ""}
                  />
                  {errors.buildYear && <div className="error">{errors.buildYear}</div>}
                </div>

                <div className="form-group">
                  <label>Length (meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="8.5"
                    className={errors.length ? "input-error" : ""}
                  />
                  {errors.length && <div className="error">{errors.length}</div>}
                </div>
              </div>

              <div className="form-group">
                <label>Asking Price / Reserve</label>
                <input
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="$250,000"
                />
                <small className="hint">Optional - helps us provide accurate valuation</small>
              </div>

              <div className="form-group">
                <label>Location (Marina/Suburb)</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Rose Bay Marina, Sydney"
                />
              </div>

              <div className="form-group">
                <label>Boat Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description: condition, recent upgrades, notable features..."
                  rows="4"
                />
                <small className="hint">Tell us what makes your boat special</small>
              </div>

              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Continue to Owner Details →
              </button>
            </div>
          )}

          {/* Step 2: Owner Details */}
          {step === 2 && (
            <div className="step-content">
              <h2 className="step-title">
                <span className="step-number">2</span>
                Owner Information
              </h2>

              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="John Smith"
                  className={errors.ownerName ? "input-error" : ""}
                />
                {errors.ownerName && <div className="error">{errors.ownerName}</div>}
              </div>

              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.smith@example.com"
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <div className="error">{errors.email}</div>}
                <small className="hint">We'll use this to send you updates</small>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+61 4XX XXX XXX"
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && <div className="error">{errors.phone}</div>}
                <small className="hint">Optional - for faster communication</small>
              </div>

              <div className="btn-row">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  ← Back
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Continue to Auction Details →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Auction & Photos */}
          {step === 3 && (
            <div className="step-content">
              <h2 className="step-title">
                <span className="step-number">3</span>
                Auction & Photos
              </h2>

              <div className="form-group">
                <label>Preferred Auction Week <span className="required">*</span></label>
                <select
                  value={auctionDate}
                  onChange={(e) => setAuctionDate(e.target.value)}
                  className={errors.auctionDate ? "input-error" : ""}
                >
                  <option value="">Select an auction week</option>
                  <option value="24 October 2025 – 30 October 2025">
                    24-30 October 2025
                  </option>
                  <option value="21 November 2025 – 27 November 2025">
                    21-27 November 2025
                  </option>
                </select>
                {errors.auctionDate && <div className="error">{errors.auctionDate}</div>}
                <small className="hint">Choose your preferred week - we'll confirm availability</small>
              </div>

              <div className="form-group">
                <label>Boat Photos</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    id="photo-upload"
                    className="file-input"
                  />
                  <label htmlFor="photo-upload" className="file-upload-label">
                    <span className="upload-icon">📷</span>
                    <span>Choose Photos</span>
                    <small>Up to 10 photos, 5MB each</small>
                  </label>
                </div>
                {errors.photos && <div className="error">{errors.photos}</div>}
                <small className="hint">Optional - you can also send photos later via email</small>
              </div>

              {photos.length > 0 && (
                <div className="photo-grid">
                  {photos.map((src, i) => (
                    <div key={i} className="photo-thumb">
                      <img src={src} alt={`Boat photo ${i + 1}`} />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => removePhoto(i)}
                        aria-label="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="btn-row">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  ← Back
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration ✓"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <footer className="footer">
        <p>Questions? Call us at <a href="tel:+61478829669">0478 829 669</a></p>
      </footer>
    </div>
  );
}
