import React from "react";
import "./Contact.css"

function Contact() {
  return (
    <>
      <section className="contact-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="text-center mb-4">
                <h1 className="contact-page-title">Get in Touch</h1>
                <p className="contact-page-subtitle">We'd love to hear from you. Drop us a message!</p>
              </div>

              {/* Info Chips */}
              <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                <div className="contact-info-chip">
                  <i className="bi bi-telephone-fill"></i> +91 98765 43210
                </div>
                <div className="contact-info-chip">
                  <i className="bi bi-envelope-fill"></i> hello@instantmeal.in
                </div>
                <div className="contact-info-chip">
                  <i className="bi bi-geo-alt-fill"></i> Bengaluru, Karnataka
                </div>
              </div>

              <div className="contact-form shadow-sm">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>First Name</label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="John"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Last Name</label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="Doe"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Email Address</label>
                      <input
                        type="email"
                        className="form-control custom-input"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Your Message</label>
                      <textarea
                        className="form-control custom-input"
                        rows="5"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100 py-3"
                        type="submit"
                      >
                        <i className="bi bi-send-fill me-2"></i>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
