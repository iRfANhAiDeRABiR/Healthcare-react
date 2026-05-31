import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ambulance as AmbulanceIcon,
  BadgeCheck,
  CheckCircle,
  Clock,
  Edit3,
  Filter,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialFilters = {
  search: "",
  division: "",
  district: "",
  service_type: "",
  availability: "",
  verified_only: false,
  only247: false,
  sort: "service_name",
  order: "asc",
};

const initialUpdateForm = {
  requester_name: "",
  requester_phone: "",
  requester_email: "",
  proposed_service_name: "",
  proposed_phone_primary: "",
  proposed_phone_secondary: "",
  proposed_division: "",
  proposed_district: "",
  proposed_area: "",
  proposed_address: "",
  proposed_latitude: "",
  proposed_longitude: "",
  proposed_availability: "",
  proposed_base_charge: "",
  proposed_price_per_km: "",
  proposed_equipment: "",
  note: "",
};

const initialMessageForm = {
  sender_name: "",
  sender_phone: "",
  sender_email: "",
  message_type: "question",
  message: "",
};

const initialReviewForm = {
  reviewer_name: "",
  reviewer_phone: "",
  rating: 5,
  review_text: "",
  service_date: "",
};

function money(value) {
  return Number(value || 0).toFixed(2);
}

function telNumber(value) {
  return String(value || "").replace(/[^0-9+]/g, "");
}

function serviceLabel(type) {
  const labels = {
    basic: "Basic Ambulance",
    advanced: "Advanced Ambulance",
    icu: "ICU Ambulance",
    neonatal: "Neonatal Ambulance",
    cardiac: "Cardiac Ambulance",
  };

  return labels[type] || String(type || "Ambulance").replaceAll("_", " ");
}

function availabilityLabel(value) {
  if (value === "24/7") return "24/7 Available";
  if (value === "day_only") return "Day Only";
  if (value === "emergency_only") return "Emergency Only";
  return value || "Available";
}

function responseWindow(type) {
  const map = {
    basic: "12-18 min",
    advanced: "10-15 min",
    icu: "8-12 min",
    neonatal: "10-15 min",
    cardiac: "8-12 min",
  };

  return map[type] || "10-15 min";
}

function formatDate(value) {
  if (!value) return "N/A";

  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

function MapBox({ latitude, longitude, title = "Location", note }) {
  const hasLocation = latitude && longitude;
  const mapSrc = hasLocation
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
    : "";

  return (
    <div className="map-box">
      {hasLocation ? (
        <>
          <iframe
            title={title}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="map-overlay">
            <strong>{title}</strong>
            {note && <span>{note}</span>}
          </div>
        </>
      ) : (
        <div className="map-empty">
          <MapPin size={30} />
          <strong>No live location yet</strong>
          <span>The ambulance manager has not shared live GPS yet.</span>
        </div>
      )}
    </div>
  );
}

export default function Ambulance() {
  const { user } = useAuth();

  const [meta, setMeta] = useState({
    stats: {},
    divisions: [],
    service_types: [],
    availability_types: [],
    emergency_services: [],
  });
  
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateForm, setUpdateForm] = useState(initialUpdateForm);
  const [messageForm, setMessageForm] = useState(initialMessageForm);
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [shareForm, setShareForm] = useState({
  sender_name: "",
  sender_phone: "",
  sender_email: "",
  latitude: "",
  longitude: "",
  message: "",
});
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const ambulanceLatitude =
  selected?.current_latitude ||
  selected?.latitude ||
  selectedDetails?.service?.current_latitude ||
  selectedDetails?.service?.latitude ||
  "";

const ambulanceLongitude =
  selected?.current_longitude ||
  selected?.longitude ||
  selectedDetails?.service?.current_longitude ||
  selectedDetails?.service?.longitude ||
  "";

const ambulanceLocationNote =
  selected?.current_location_note ||
  selectedDetails?.service?.current_location_note ||
  selected?.address ||
  "";

const [chatTarget, setChatTarget] = useState(null);
const [chatDetails, setChatDetails] = useState(null);
const [chatForm, setChatForm] = useState({
  sender_name: "",
  sender_phone: "",
  sender_email: "",
  message_type: "question",
  message: "",
});

  const typeOptions = useMemo(() => {
    const values = meta.service_types?.length
      ? meta.service_types
      : ["basic", "advanced", "icu", "neonatal", "cardiac"];

    return values;
  }, [meta.service_types]);

  useEffect(() => {
    loadMeta();
    loadServices();
  }, []);

  useEffect(() => {
  const timer = setTimeout(() => {
    loadServices();
  }, 250);

  return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  filters.search,
  filters.division,
  filters.district,
  filters.service_type,
  filters.availability,
  filters.verified_only,
  filters.only247,
  filters.sort,
  filters.order,
]);

  async function loadMeta() {
    try {
      const response = await api.get("/ambulance/meta");
      setMeta(response.data.data);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not load ambulance summary.",
      });
    }
  }

  async function openChat(service) {
  setChatTarget(service);
  setChatDetails(null);
  setNotice(null);

  setChatForm({
    sender_name: user?.name || "",
    sender_phone: "",
    sender_email: user?.email || "",
    message_type: "question",
    message: "",
  });

  try {
    const response = await api.get(`/ambulance/services/${service.id}`);
    setChatDetails(response.data.data);
  } catch (error) {
    setNotice({
      type: "error",
      message: error.response?.data?.message || "Could not load chat messages.",
    });
  }
}

function updateChatForm(event) {
  const { name, value } = event.target;

  setChatForm((current) => ({
    ...current,
    [name]: value,
  }));
}

async function submitChatMessage(event) {
  event.preventDefault();

  if (!chatTarget) return;

  setSubmitting(true);
  setNotice(null);

  try {
    const response = await api.post(
      `/ambulance/services/${chatTarget.id}/messages`,
      chatForm
    );

    setNotice({
      type: "success",
      message: response.data.message || "Message sent to ambulance manager.",
    });

    setChatForm((current) => ({
      ...current,
      message: "",
      message_type: "question",
    }));

    const detailsResponse = await api.get(`/ambulance/services/${chatTarget.id}`);
    setChatDetails(detailsResponse.data.data);
  } catch (error) {
    setNotice({
      type: "error",
      message: error.response?.data?.message || "Could not send message.",
    });
  } finally {
    setSubmitting(false);
  }
}

  async function loadServices() {
    setLoading(true);

    try {
      const response = await api.get("/ambulance/services", {
        params: {
          ...filters,
          verified_only: filters.verified_only ? 1 : "",
          only247: filters.only247 ? 1 : "",
        },
      });

      setServices(response.data.data || []);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not load ambulance services.",
      });
    } finally {
      setLoading(false);
    }
  }

  function updateShareForm(event) {
  const { name, value } = event.target;

  setShareForm((current) => ({
    ...current,
    [name]: value,
  }));
}

function useCurrentUserLocation() {
  if (!navigator.geolocation) {
    setNotice({
      type: "error",
      message: "Geolocation is not supported in this browser.",
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setShareForm((current) => ({
        ...current,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    },
    () => {
      setNotice({
        type: "error",
        message: "Could not get your current location.",
      });
    }
  );
}

async function submitUserLocation(event) {
  event.preventDefault();

  if (!selected) return;

  setSubmitting(true);
  setNotice(null);

  try {
    const response = await api.post(
      `/ambulance/services/${selected.id}/share-location`,
      shareForm
    );

    setNotice({
      type: "success",
      message: response.data.message || "Location shared successfully.",
    });

    setShareForm({
      sender_name: user?.name || "",
      sender_phone: "",
      sender_email: user?.email || "",
      latitude: "",
      longitude: "",
      message: "",
    });
  } catch (error) {
    setNotice({
      type: "error",
      message: error.response?.data?.message || "Could not share location.",
    });
  } finally {
    setSubmitting(false);
  }
}

  function updateFilter(event) {
    const { name, value, type, checked } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  async function openDetails(service) {
  setSelected(service);
  setSelectedDetails(null);
  setNotice(null);

  setShareForm({
    sender_name: user?.name || "",
    sender_phone: "",
    sender_email: user?.email || "",
    latitude: "",
    longitude: "",
    message: "",
  });

  setReviewForm({
    reviewer_name: user?.name || "",
    reviewer_phone: "",
    rating: 5,
    review_text: "",
    service_date: "",
  });

    try {
      const response = await api.get(`/ambulance/services/${service.id}`);
      setSelectedDetails(response.data.data);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not load ambulance details.",
      });
    }
  }

  function updateUpdateForm(event) {
    const { name, value } = event.target;

    setUpdateForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateMessageForm(event) {
    const { name, value } = event.target;

    setMessageForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateReviewForm(event) {
    const { name, value } = event.target;

    setReviewForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitUpdateRequest(event) {
    event.preventDefault();

    if (!updateTarget) return;

    setSubmitting(true);
    setNotice(null);

    try {
      const response = await api.post(
        `/ambulance/services/${updateTarget.id}/update-request`,
        updateForm
      );

      setNotice({
        type: "success",
        message: response.data.message || "Update request submitted successfully.",
      });

      setUpdateTarget(null);
      setUpdateForm(initialUpdateForm);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not submit update request.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function submitMessage(event) {
    event.preventDefault();

    if (!updateTarget) return;

    setSubmitting(true);
    setNotice(null);

    try {
      const response = await api.post(
        `/ambulance/services/${updateTarget.id}/messages`,
        messageForm
      );

      setNotice({
        type: "success",
        message: response.data.message || "Message sent successfully.",
      });

      setMessageForm(initialMessageForm);
      setUpdateTarget(null);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not send message.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReview(event) {
    event.preventDefault();

    if (!selected) return;

    setSubmitting(true);

    try {
      const response = await api.post(
        `/ambulance/services/${selected.id}/reviews`,
        reviewForm
      );

      setNotice({
        type: "success",
        message: response.data.message || "Review submitted successfully.",
      });

      setReviewForm(initialReviewForm);
      await openDetails(selected);
      await loadServices();
      await loadMeta();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not submit review.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  

  return (
    <section className="ambulance-page">
      <style>{styles}</style>

      <div className="ambulance-shell">
        <div className="ambulance-hero">
          <div className="hero-left">
            <span className="hero-kicker">
              <AmbulanceIcon size={18} />
              Emergency Ambulance Network
            </span>
            <h1>Find verified ambulances and contact emergency transport fast.</h1>
            <p>
              Search by division, district, service type, availability, rating,
              and emergency response level. Users can also submit location and
              contact corrections for each ambulance.
            </p>
          </div>

          <a className="hotline-card" href="tel:999">
            <AlertTriangle size={28} />
            <div>
              <strong>999</strong>
              <span>Emergency Hotline</span>
            </div>
          </a>
        </div>

        {notice && (
          <div className={`ambulance-notice ${notice.type}`}>
            {notice.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {notice.message}
          </div>
        )}

        <div className="stats-grid">
          <Stat icon={<AmbulanceIcon />} label="Total Services" value={meta.stats?.total_services || 0} />
          <Stat icon={<Navigation />} label="Divisions" value={meta.stats?.total_divisions || 0} />
          <Stat icon={<Clock />} label="24/7 Available" value={meta.stats?.total_247 || 0} />
          <Stat icon={<ShieldCheck />} label="Verified" value={meta.stats?.total_verified || 0} />
        </div>

        <div className="filter-panel">
          <div className="search-field">
            <Search size={18} />
            <input
              name="search"
              value={filters.search}
              onChange={updateFilter}
              placeholder="Search service, area, phone, equipment..."
            />
          </div>

          <select name="division" value={filters.division} onChange={updateFilter}>
            <option value="">All divisions</option>
            {meta.divisions?.map((division) => (
              <option key={division} value={division}>{division}</option>
            ))}
          </select>

          <input
            name="district"
            value={filters.district}
            onChange={updateFilter}
            placeholder="District"
          />

          <select name="service_type" value={filters.service_type} onChange={updateFilter}>
            <option value="">All service types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>{serviceLabel(type)}</option>
            ))}
          </select>

          <select name="availability" value={filters.availability} onChange={updateFilter}>
            <option value="">Any availability</option>
            <option value="24/7">24/7 Available</option>
            <option value="day_only">Day Only</option>
            <option value="emergency_only">Emergency Only</option>
          </select>

          <select name="sort" value={filters.sort} onChange={updateFilter}>
            <option value="service_name">Sort by name</option>
            <option value="rating">Sort by rating</option>
            <option value="base_charge">Sort by base charge</option>
            <option value="price_per_km">Sort by per km price</option>
            <option value="total_reviews">Sort by reviews</option>
          </select>

          <select name="order" value={filters.order} onChange={updateFilter}>
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>

          <label className="check-pill">
            <input
              type="checkbox"
              name="verified_only"
              checked={filters.verified_only}
              onChange={updateFilter}
            />
            Verified only
          </label>

          <label className="check-pill">
            <input
              type="checkbox"
              name="only247"
              checked={filters.only247}
              onChange={updateFilter}
            />
            24/7 only
          </label>

          <button className="clear-btn" onClick={resetFilters}>
            <Filter size={16} />
            Reset
          </button>
        </div>

        {loading ? (
          <div className="empty-card">Loading ambulance services...</div>
        ) : services.length === 0 ? (
          <div className="empty-card">No ambulance services found.</div>
        ) : (
          <div className="ambulance-grid">
            {services.map((service) => (
              <AmbulanceCard
  key={service.id}
  service={service}
  onDetails={() => openDetails(service)}
  onChat={() => openChat(service)}
/>
            ))}
          </div>
        )}
      </div>

      {selected && (
  <div className="modal-overlay">
    <div className="details-modal details-modal-modern">
      <button className="modal-close" onClick={() => setSelected(null)}>
        <X size={20} />
      </button>

      <div className="details-modern-hero">
        <div>
          <span className={`type-badge ${selected.service_type}`}>
            {serviceLabel(selected.service_type)}
          </span>

          <h2>{selected.service_name}</h2>

          <p>
            <MapPin size={16} />
            {selected.area}, {selected.district}, {selected.division}
          </p>
        </div>

        <a className="call-main modern-call-main" href={`tel:${telNumber(selected.phone_primary)}`}>
          <Phone size={18} />
          Call Now
        </a>
      </div>

      <div className="details-modern-grid">
        <section className="details-card modern-share-card">
          <div className="section-title-row">
            <div>
              <h3>Share Pickup Location</h3>
              <p>Send your live pickup location to the ambulance manager.</p>
            </div>
            <span className="soft-icon">
              <Navigation size={18} />
            </span>
          </div>

          <MapBox
            latitude={shareForm.latitude}
            longitude={shareForm.longitude}
            title="Your Pickup Location"
            note={shareForm.message || "This location will be shared with the ambulance manager."}
          />

          <form className="modern-share-form" onSubmit={submitUserLocation}>
            <div className="form-row">
              <input
                name="sender_name"
                value={shareForm.sender_name}
                onChange={updateShareForm}
                placeholder="Your name *"
                required
              />

              <input
                name="sender_phone"
                value={shareForm.sender_phone}
                onChange={updateShareForm}
                placeholder="Your phone *"
                required
              />
            </div>

            <input
              name="sender_email"
              value={shareForm.sender_email}
              onChange={updateShareForm}
              placeholder="Your email"
            />

            <div className="location-meta">
              <span>
                <strong>Latitude:</strong> {shareForm.latitude || "Not set"}
              </span>
              <span>
                <strong>Longitude:</strong> {shareForm.longitude || "Not set"}
              </span>
            </div>

            <button type="button" className="details-btn modern-location-btn" onClick={useCurrentUserLocation}>
              <MapPin size={16} />
              Use My Current Location
            </button>

            <textarea
              name="message"
              value={shareForm.message}
              onChange={updateShareForm}
              placeholder="Add pickup note, landmark, emergency details..."
            />

            <button className="submit-btn green modern-share-submit" disabled={submitting}>
              <MapPin size={16} />
              {submitting ? "Sharing..." : "Share Location"}
            </button>
          </form>
        </section>

        <section className="details-card modern-service-card">
          <div className="section-title-row">
            <div>
              <h3>Service Details</h3>
              <p>Pricing, availability, and contact information.</p>
            </div>
            <span className="soft-icon">
              <AmbulanceIcon size={18} />
            </span>
          </div>

          <Info label="Availability" value={availabilityLabel(selected.availability)} />
          <Info label="Response Window" value={responseWindow(selected.service_type)} />
          <Info label="Base Charge" value={`৳${money(selected.base_charge)}`} />
          <Info label="Price / KM" value={`৳${money(selected.price_per_km)}`} />
          <Info label="Example 10 KM Fare" value={`৳${money(selected.example_fare_10km)}`} />
          <Info label="Primary Phone" value={selected.phone_primary} />
          <Info label="Secondary Phone" value={selected.phone_secondary || "Not provided"} />
          <Info label="Contact Person" value={selected.contact_person || "Not provided"} />
        </section>
      </div>

      <div className="details-modern-grid">
        <section className="details-card modern-map-card">
          <div className="section-title-row">
            <div>
              <h3>Ambulance Live Location</h3>
              <p>Current ambulance location or saved base address.</p>
            </div>
            <span className="soft-icon">
              <MapPin size={18} />
            </span>
          </div>

          <MapBox
            latitude={ambulanceLatitude}
            longitude={ambulanceLongitude}
            title={selected.service_name}
            note={ambulanceLocationNote}
          />

          <p className="address-text">{selected.address || "Address not provided."}</p>

          {ambulanceLatitude && ambulanceLongitude && (
            <a
              className="map-link"
              href={`https://www.google.com/maps?q=${ambulanceLatitude},${ambulanceLongitude}`}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={16} />
              Open Full Map
            </a>
          )}
        </section>

        <section className="details-card modern-service-card">
          <div className="section-title-row">
            <div>
              <h3>Equipment</h3>
              <p>Available ambulance equipment.</p>
            </div>
            <span className="soft-icon">
              <ShieldCheck size={18} />
            </span>
          </div>

          <div className="equipment-list modern-equipment">
            {selected.equipment_items?.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="description-box">
            <h3>Description</h3>
            <p>{selected.description || "No description added."}</p>
          </div>
        </section>
      </div>

      <div className="details-modern-grid">
        <section className="details-card">
          <h3>Recent Messages</h3>

          {selectedDetails?.messages?.length ? (
            <div className="mini-list modern-mini-list">
              {selectedDetails.messages.map((message) => (
                <div key={message.id}>
                  <strong>{message.sender_name}</strong>
                  <p>{message.message}</p>
                  <small>{formatDate(message.created_at)} · {message.message_type}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No public messages yet.</p>
          )}
        </section>

        <section className="details-card">
          <h3>Reviews</h3>

          {selectedDetails?.reviews?.length ? (
            <div className="mini-list modern-mini-list">
              {selectedDetails.reviews.map((review) => (
                <div key={review.id}>
                  <strong>{review.reviewer_name}</strong>
                  <p>{"★".repeat(Number(review.rating || 0))} {review.review_text}</p>
                  <small>{formatDate(review.service_date || review.created_at)}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No reviews yet.</p>
          )}
        </section>
      </div>

      <form className="review-form modern-review-form" onSubmit={submitReview}>
        <div className="section-title-row">
          <div>
            <h3>Add Review</h3>
            <p>Share your ambulance service experience.</p>
          </div>
          <span className="soft-icon">
            <Star size={18} />
          </span>
        </div>

        <div className="form-row">
          <input
            name="reviewer_name"
            value={reviewForm.reviewer_name}
            onChange={updateReviewForm}
            placeholder="Your name"
            required
          />

          <input
            name="reviewer_phone"
            value={reviewForm.reviewer_phone}
            onChange={updateReviewForm}
            placeholder="Phone"
          />

          <select name="rating" value={reviewForm.rating} onChange={updateReviewForm}>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <textarea
          name="review_text"
          value={reviewForm.review_text}
          onChange={updateReviewForm}
          placeholder="Write your experience..."
        />

        <button className="submit-btn" disabled={submitting}>
          Submit Review
        </button>
      </form>
    </div>
  </div>
)}

      {updateTarget && (
        <div className="modal-overlay">
          <div className="update-modal">
            <button className="modal-close" onClick={() => setUpdateTarget(null)}>
              <X size={20} />
            </button>

            <div className="update-head">
              <span className="hero-kicker">
                <Edit3 size={16} />
                Update / Communicate
              </span>
              <h2>{updateTarget.service_name}</h2>
              <p>
                Send corrected ambulance information, updated location, pricing,
                availability, or a message to the service/admin team.
              </p>
            </div>

            <div className="update-grid">
              <form className="update-form" onSubmit={submitUpdateRequest}>
                <h3>Update ambulance information</h3>

                <div className="form-row">
                  <input
                    name="requester_name"
                    value={updateForm.requester_name}
                    onChange={updateUpdateForm}
                    placeholder="Your name *"
                    required
                  />
                  <input
                    name="requester_phone"
                    value={updateForm.requester_phone}
                    onChange={updateUpdateForm}
                    placeholder="Your phone *"
                    required
                  />
                </div>

                <input
                  name="requester_email"
                  value={updateForm.requester_email}
                  onChange={updateUpdateForm}
                  placeholder="Your email"
                />

                <input
                  name="proposed_service_name"
                  value={updateForm.proposed_service_name}
                  onChange={updateUpdateForm}
                  placeholder="Service name"
                />

                <div className="form-row">
                  <input
                    name="proposed_phone_primary"
                    value={updateForm.proposed_phone_primary}
                    onChange={updateUpdateForm}
                    placeholder="Primary phone"
                  />
                  <input
                    name="proposed_phone_secondary"
                    value={updateForm.proposed_phone_secondary}
                    onChange={updateUpdateForm}
                    placeholder="Secondary phone"
                  />
                </div>

                <div className="form-row">
                  <input
                    name="proposed_division"
                    value={updateForm.proposed_division}
                    onChange={updateUpdateForm}
                    placeholder="Division"
                  />
                  <input
                    name="proposed_district"
                    value={updateForm.proposed_district}
                    onChange={updateUpdateForm}
                    placeholder="District"
                  />
                </div>

                <input
                  name="proposed_area"
                  value={updateForm.proposed_area}
                  onChange={updateUpdateForm}
                  placeholder="Area"
                />

                <textarea
                  name="proposed_address"
                  value={updateForm.proposed_address}
                  onChange={updateUpdateForm}
                  placeholder="Full address / landmark"
                />

                <div className="form-row">
                  <input
                    name="proposed_latitude"
                    value={updateForm.proposed_latitude}
                    onChange={updateUpdateForm}
                    placeholder="Latitude"
                  />
                  <input
                    name="proposed_longitude"
                    value={updateForm.proposed_longitude}
                    onChange={updateUpdateForm}
                    placeholder="Longitude"
                  />
                </div>

                <div className="form-row">
                  <select
                    name="proposed_availability"
                    value={updateForm.proposed_availability}
                    onChange={updateUpdateForm}
                  >
                    <option value="">Availability</option>
                    <option value="24/7">24/7</option>
                    <option value="day_only">Day only</option>
                    <option value="emergency_only">Emergency only</option>
                  </select>

                  <input
                    name="proposed_base_charge"
                    value={updateForm.proposed_base_charge}
                    onChange={updateUpdateForm}
                    placeholder="Base charge"
                  />
                </div>

                <input
                  name="proposed_price_per_km"
                  value={updateForm.proposed_price_per_km}
                  onChange={updateUpdateForm}
                  placeholder="Price per KM"
                />

                <textarea
                  name="proposed_equipment"
                  value={updateForm.proposed_equipment}
                  onChange={updateUpdateForm}
                  placeholder="Equipment list: Oxygen, Stretcher, ICU..."
                />

                <textarea
                  name="note"
                  value={updateForm.note}
                  onChange={updateUpdateForm}
                  placeholder="Explain what should be changed..."
                />

                <button className="submit-btn" disabled={submitting}>
                  <Edit3 size={16} />
                  Submit Update Request
                </button>
              </form>

              <form className="message-form" onSubmit={submitMessage}>
                <h3>Communicate / Ask Question</h3>

                <input
                  name="sender_name"
                  value={messageForm.sender_name}
                  onChange={updateMessageForm}
                  placeholder="Your name *"
                  required
                />

                <input
                  name="sender_phone"
                  value={messageForm.sender_phone}
                  onChange={updateMessageForm}
                  placeholder="Your phone *"
                  required
                />

                <input
                  name="sender_email"
                  value={messageForm.sender_email}
                  onChange={updateMessageForm}
                  placeholder="Your email"
                />

                <select
                  name="message_type"
                  value={messageForm.message_type}
                  onChange={updateMessageForm}
                >
                  <option value="question">Question</option>
                  <option value="location_update">Location update</option>
                  <option value="pricing">Pricing</option>
                  <option value="availability">Availability</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  name="message"
                  value={messageForm.message}
                  onChange={updateMessageForm}
                  placeholder="Write your message..."
                  required
                />
                <button className="submit-btn green" disabled={submitting}>
                  <MessageCircle size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

            {chatTarget && (
        <div className="modal-overlay">
          <div className="user-chat-modal">
            <button className="modal-close" onClick={() => setChatTarget(null)}>
              <X size={20} />
            </button>

            <div className="user-chat-head">
              <div>
                <span className="chat-kicker">
                  <MessageCircle size={16} />
                  Chat Request
                </span>

                <h2>{chatTarget.service_name}</h2>

                <p>
                  Send message, pickup note, pricing question, or availability
                  request to the ambulance manager.
                </p>
              </div>

              <a
                className="call-main"
                href={`tel:${telNumber(chatTarget.phone_primary)}`}
              >
                <Phone size={18} />
                Call
              </a>
            </div>

            <div className="user-chat-layout">
              <div className="user-chat-history">
                <h3>Conversation</h3>

                {chatDetails?.messages?.length ? (
                  <div className="user-chat-list">
                    {chatDetails.messages.map((message) => (
                      <article className="user-chat-item" key={message.id}>
                        <div className="user-message-bubble">
                          <span>User Message</span>
                          <p>{message.message}</p>
                          <small>
                            {formatDate(message.created_at)} · {message.status}
                          </small>
                        </div>

                        {message.manager_reply && (
                          <div className="manager-message-bubble">
                            <span>Ambulance Manager</span>
                            <p>{message.manager_reply}</p>
                            <small>{formatDate(message.replied_at)}</small>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="chat-empty">
                    <MessageCircle size={34} />
                    <strong>No messages yet</strong>
                    <span>Send your first request to the ambulance manager.</span>
                  </div>
                )}
              </div>

              <form className="user-chat-form" onSubmit={submitChatMessage}>
                <h3>Send Message</h3>

                <div className="form-row">
                  <input
                    name="sender_name"
                    value={chatForm.sender_name}
                    onChange={updateChatForm}
                    placeholder="Your name *"
                    required
                  />

                  <input
                    name="sender_phone"
                    value={chatForm.sender_phone}
                    onChange={updateChatForm}
                    placeholder="Your phone *"
                    required
                  />
                </div>

                <input
                  name="sender_email"
                  value={chatForm.sender_email}
                  onChange={updateChatForm}
                  placeholder="Your email"
                />

                <select
                  name="message_type"
                  value={chatForm.message_type}
                  onChange={updateChatForm}
                >
                  <option value="question">General Question</option>
                  <option value="location_update">Pickup Location</option>
                  <option value="pricing">Pricing</option>
                  <option value="availability">Availability</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  name="message"
                  value={chatForm.message}
                  onChange={updateChatForm}
                  placeholder="Write your message/request..."
                  required
                />

                <button className="submit-btn green" disabled={submitting}>
                  <MessageCircle size={16} />
                  Send Message Request
                </button>

                <button
                  type="button"
                  className="details-btn"
                  onClick={() => {
                    const currentTarget = chatTarget;
                    setChatTarget(null);
                    openDetails(currentTarget);
                  }}
                >
                  <MapPin size={16} />
                  Share Pickup Location Instead
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


function Stat({ icon, label, value }) {
  return (
    <article className="stat-card">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AmbulanceCard({ service, onDetails, onChat }) {
  return (
    <article className="service-card">
      <div className="service-top">
        <div className="service-icon">
          <AmbulanceIcon size={30} />
        </div>

        <div className="badges">
          {service.verified && (
            <span className="verified">
              <BadgeCheck size={14} />
              Verified
            </span>
          )}
          <span className={`type-badge ${service.service_type}`}>
            {serviceLabel(service.service_type)}
          </span>
        </div>
      </div>

      <h3>{service.service_name}</h3>

      <div className="rating-line">
        <Star size={16} fill="currentColor" />
        <strong>{service.rating || "0.0"}</strong>
        <span>({service.total_reviews || 0} reviews)</span>
      </div>

      <p className="desc">{service.description || "Emergency ambulance service."}</p>

      <div className="service-info">
        <span>
          <MapPin size={15} />
          {service.area}, {service.district}, {service.division}
        </span>
        <span>
          <Clock size={15} />
          {availabilityLabel(service.availability)} · {responseWindow(service.service_type)}
        </span>
        <span>
          <Phone size={15} />
          {service.phone_primary}
        </span>
      </div>

      <div className="equipment-list compact">
        {service.equipment_items?.slice(0, 4).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="fare-box">
        <div>
          <small>Base</small>
          <strong>৳{money(service.base_charge)}</strong>
        </div>
        <div>
          <small>Per KM</small>
          <strong>৳{money(service.price_per_km)}</strong>
        </div>
        <div>
          <small>10 KM Est.</small>
          <strong>৳{money(service.example_fare_10km)}</strong>
        </div>
      </div>

      <div className="card-actions">
  <a href={`tel:${telNumber(service.phone_primary)}`} className="call-btn">
    <Phone size={16} />
    Call
  </a>

  <button type="button" onClick={onDetails} className="details-btn">
    Details
  </button>
</div>

<button type="button" onClick={onChat} className="chat-manager-btn">
  <MessageCircle size={16} />
  Message Manager
</button>
    </article>
  );
}

const styles = `
.ambulance-page {
  background: #fff7ef;
  min-height: 100%;
  padding: 28px 16px 48px;
  color: #0f172a;
}

.ambulance-shell {
  max-width: 1240px;
  margin: 0 auto;
}

.ambulance-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 18px;
  margin-bottom: 18px;
}

.hero-left {
  border-radius: 28px;
  padding: clamp(26px, 5vw, 44px);
  color: white;
  background: linear-gradient(135deg, #ef1111 0%, #d90429 50%, #f97316 100%);
  box-shadow: 0 26px 60px rgba(239, 17, 17, .2);
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.22);
  font-weight: 900;
  margin-bottom: 16px;
}

.hero-left h1 {
  margin: 0;
  max-width: 850px;
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: 1;
  letter-spacing: -.06em;
}

.hero-left p {
  max-width: 720px;
  color: #ffe4e6;
  margin: 16px 0 0;
}

.hotline-card {
  border-radius: 28px;
  background: #111827;
  color: white;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  box-shadow: 0 22px 44px rgba(15,23,42,.2);
}

.hotline-card strong {
  display: block;
  font-size: 3rem;
  line-height: 1;
}

.hotline-card span {
  color: #fecaca;
  font-weight: 900;
}

.ambulance-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  padding: 13px 16px;
  margin-bottom: 16px;
  font-weight: 900;
}

.ambulance-notice.success {
  background: #dcfce7;
  color: #166534;
}

.ambulance-notice.error {
  background: #fee2e2;
  color: #991b1b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.stat-card,
.filter-panel,
.service-card,
.emergency-card,
.empty-card,
.details-modal,
.update-modal,
.details-card {
  background: white;
  border: 1px solid #fee2e2;
  border-radius: 22px;
  box-shadow: 0 14px 34px rgba(127, 29, 29, .08);
}

.stat-card {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-card > span {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #fee2e2;
  color: #ef1111;
}

.stat-card strong {
  display: block;
  font-size: 1.6rem;
}

.stat-card small {
  color: #64748b;
  font-weight: 900;
}

.emergency-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin: 22px 0 14px;
}

.emergency-strip h2 {
  margin: 0 0 5px;
}

.emergency-strip p {
  margin: 0;
  color: #64748b;
}

.refresh-btn,
.clear-btn,
.submit-btn,
.call-btn,
.details-btn,
.update-link,
.call-main {
  border: none;
  border-radius: 14px;
  padding: 11px 15px;
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.refresh-btn,
.clear-btn,
.details-btn {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.emergency-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.emergency-card {
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.emergency-card h3 {
  margin: 8px 0 4px;
}

.emergency-card p {
  margin: 0;
  color: #64748b;
}

.mini-badge {
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  padding: 5px 9px;
  font-size: .76rem;
  font-weight: 950;
}

.call-now,
.call-btn,
.call-main {
  background: #ef1111;
  color: white;
  box-shadow: 0 12px 22px rgba(239, 17, 17, .22);
}

.filter-panel {
  padding: 16px;
  display: grid;
  grid-template-columns: minmax(240px, 1.3fr) repeat(6, minmax(130px, 1fr)) auto auto auto;
  gap: 10px;
  margin-bottom: 18px;
  align-items: center;
}

.search-field {
  position: relative;
}

.search-field svg {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.filter-panel input,
.filter-panel select,
.update-form input,
.update-form select,
.update-form textarea,
.message-form input,
.message-form select,
.message-form textarea,
.review-form input,
.review-form select,
.review-form textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px;
  font: inherit;
  font-weight: 700;
  outline: none;
}

.search-field input {
  padding-left: 42px;
}

.check-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff7ef;
  color: #9f1239;
  border-radius: 14px;
  padding: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.ambulance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.service-card {
  padding: 18px;
}

.service-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 15px;
}

.service-icon {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #fee2e2, #ffedd5);
  color: #ef1111;
}

.badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
}

.verified,
.type-badge {
  border-radius: 999px;
  padding: 6px 9px;
  font-size: .76rem;
  font-weight: 950;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.verified {
  background: #dcfce7;
  color: #166534;
}

.type-badge {
  color: #1d4ed8;
  background: #dbeafe;
}

.type-badge.icu,
.type-badge.cardiac {
  color: #b91c1c;
  background: #fee2e2;
}

.type-badge.neonatal {
  color: #7c2d12;
  background: #ffedd5;
}

.service-card h3 {
  margin: 0 0 10px;
  font-size: 1.15rem;
}

.rating-line {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f59e0b;
  margin-bottom: 10px;
}

.rating-line span {
  color: #64748b;
  font-size: .85rem;
}

.desc {
  color: #64748b;
  min-height: 42px;
}

.service-info {
  display: grid;
  gap: 8px;
  margin: 14px 0;
}

.service-info span {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-size: .9rem;
}

.equipment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.equipment-list span {
  border-radius: 999px;
  padding: 6px 9px;
  background: #f8fafc;
  color: #475569;
  font-weight: 800;
  font-size: .78rem;
}

.equipment-list.compact {
  margin-bottom: 14px;
}

.fare-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #fff7ef;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 14px;
}

.fare-box div {
  text-align: center;
}

.fare-box small {
  display: block;
  color: #64748b;
  font-size: .72rem;
}

.fare-box strong {
  color: #111827;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.update-link {
  width: 100%;
  margin-top: 10px;
  background: #111827;
  color: white;
}

.empty-card {
  padding: 34px;
  text-align: center;
  color: #64748b;
  font-weight: 900;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 23, 42, .6);
  backdrop-filter: blur(8px);
}

.details-modal,
.update-modal {
  position: relative;
  width: min(1080px, 100%);
  max-height: 92vh;
  overflow-y: auto;
  padding: 24px;
}

.update-modal {
  width: min(1180px, 100%);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.details-head,
.update-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 18px;
  padding-right: 50px;
}

.update-head {
  display: block;
}

.details-head h2,
.update-head h2 {
  margin: 10px 0 6px;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  letter-spacing: -.04em;
}

.details-head p,
.update-head p {
  color: #64748b;
  margin: 0;
}

.details-grid,
.update-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.details-card,
.update-form,
.message-form,
.review-form {
  padding: 18px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e2e8f0;
}

.map-box iframe {
  width: 100%;
  height: 100%;
  border: 0;
  pointer-events: none;
}

html,
body {
  overflow-x: hidden;
}

.ambulance-page {
  overflow-x: hidden;
}

.ambulance-shell {
  width: 100%;
  max-width: 1240px;
  overflow-x: hidden;
}

.filter-panel {
  width: 100%;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.search-field {
  min-width: 0;
}

.filter-panel input,
.filter-panel select,
.check-pill,
.clear-btn {
  min-width: 0;
  width: 100%;
}

@media (max-width: 1180px) {
  .filter-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .filter-panel {
    grid-template-columns: 1fr;
  }
}
.details-card h3,
.update-form h3,
.message-form h3,
.review-form h3 {
  margin: 0 0 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 9px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.info-row span {
  color: #64748b;
}

.address-text,
.muted {
  color: #64748b;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-weight: 900;
  margin: 10px 0 18px;
}

.mini-list {
  display: grid;
  gap: 12px;
}

.mini-list div {
  background: #f8fafc;
  border-radius: 14px;
  padding: 12px;
}

.mini-list p {
  margin: 5px 0;
  color: #475569;
}

.mini-list small {
  color: #64748b;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.update-form,
.message-form,
.review-form {
  display: grid;
  gap: 10px;
}

.update-form textarea,
.message-form textarea,
.review-form textarea {
  min-height: 90px;
  resize: vertical;
}

/* ===== FIX EMERGENCY CALL BUTTON + FILTER OVERLAP ===== */

.emergency-card {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 18px !important;
  min-height: 132px;
}

.emergency-card > div {
  min-width: 0;
}

.emergency-card h3 {
  padding-right: 0 !important;
  margin-right: 0 !important;
  line-height: 1.25;
}

.call-now {
  position: static !important;
  top: auto !important;
  right: auto !important;
  width: auto !important;
  min-width: 104px !important;
  height: 46px !important;
  border-radius: 16px !important;
  justify-self: end;
  white-space: nowrap;
  text-decoration: none;
}

.filter-panel {
  display: grid !important;
  grid-template-columns:
    minmax(260px, 1.5fr)
    minmax(150px, .8fr)
    minmax(140px, .75fr)
    minmax(170px, .9fr)
    minmax(170px, .9fr)
    minmax(160px, .85fr)
    minmax(110px, .55fr) !important;
  gap: 12px !important;
  align-items: center !important;
  overflow: visible !important;
}

.filter-panel .check-pill,
.filter-panel .clear-btn {
  min-height: 52px;
  width: 100%;
}

.filter-panel .check-pill {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-panel .clear-btn {
  white-space: nowrap;
}

.filter-panel input,
.filter-panel select {
  height: 52px;
  min-width: 0 !important;
}

.search-field {
  min-width: 0 !important;
}

.search-field input {
  height: 52px;
}

@media (max-width: 1350px) {
  .filter-panel {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }

  .search-field {
    grid-column: span 2;
  }
}

@media (max-width: 900px) {
  .filter-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .search-field {
    grid-column: span 2;
  }
}

@media (max-width: 620px) {
  .emergency-card {
    grid-template-columns: 1fr !important;
  }

  .call-now {
    justify-self: stretch;
    width: 100% !important;
  }

  .filter-panel {
    grid-template-columns: 1fr !important;
  }

  .search-field {
    grid-column: span 1;
  }
}
.submit-btn {
  background: #ef1111;
  color: white;
  box-shadow: 0 12px 22px rgba(239, 17, 17, .22);
}

.submit-btn.green {
  background: #10b981;
  box-shadow: 0 12px 22px rgba(16, 185, 129, .22);
}

.map-box {
  position: relative;
  width: 100%;
  height: 230px;
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(135deg, #fee2e2, #ffedd5);
  border: 1px solid #fecaca;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
  margin-bottom: 12px;
}

.map-box iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.map-overlay {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border-radius: 16px;
  padding: 10px 12px;
  color: #0f172a;
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 24px rgba(15,23,42,.12);
}

.map-overlay strong,
.map-overlay span {
  display: block;
}

.map-overlay span {
  margin-top: 3px;
  color: #64748b;
  font-size: .82rem;
}

.map-empty {
  height: 100%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 7px;
  text-align: center;
  color: #991b1b;
  padding: 18px;
}

.map-empty span {
  color: #64748b;
  font-size: .88rem;
}

.location-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.location-meta span {
  border-radius: 14px;
  padding: 10px 12px;
  background: #fff7ef;
  color: #475569;
  font-size: .84rem;
}

.location-meta strong {
  color: #0f172a;
}

@media (max-width: 1120px) {
  .filter-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ambulance-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .emergency-grid,
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .ambulance-hero,
  .ambulance-grid,
  .emergency-grid,
  .stats-grid,
  .details-grid,
  .update-grid,
  .form-row,
  .filter-panel {
    grid-template-columns: 1fr;
  }

  .details-head {
    flex-direction: column;
  }

  .hotline-card strong {
    font-size: 2rem;
  }
}
/* ===== BLUE MODERN THEME OVERRIDE ===== */

.ambulance-page {
  background: #f8fafc;
  color: #0f172a;
}

.hero-left {
  background: linear-gradient(135deg, #2563eb, #4f46e5 55%, #10b981);
  box-shadow: 0 26px 60px rgba(37, 99, 235, .22);
}

.hero-left p {
  color: #dbeafe;
}

.hero-kicker {
  background: rgba(255, 255, 255, .16);
  border-color: rgba(255, 255, 255, .22);
}

.hotline-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  box-shadow: 0 22px 44px rgba(15, 23, 42, .18);
}

.hotline-card span {
  color: #bfdbfe;
}

.stat-card,
.filter-panel,
.service-card,
.emergency-card,
.empty-card,
.details-modal,
.update-modal,
.details-card {
  border-color: #e2e8f0;
  box-shadow: 0 14px 34px rgba(15, 23, 42, .07);
}

.stat-card > span,
.service-icon {
  background: #dbeafe;
  color: #2563eb;
}

.ambulance-notice.success {
  background: #dcfce7;
  color: #166534;
}

.ambulance-notice.error {
  background: #fee2e2;
  color: #991b1b;
}

.emergency-strip {
  align-items: center;
}

.emergency-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.emergency-card {
  position: relative;
  min-height: 128px;
  padding: 18px;
  align-items: center;
}

.emergency-card h3 {
  padding-right: 82px;
}



.call-now:hover,
.call-btn:hover,
.call-main:hover {
  background: #1d4ed8;
}

.mini-badge {
  background: #dcfce7;
  color: #166534;
}

.filter-panel {
  grid-template-columns:
    minmax(220px, 1.5fr)
    minmax(150px, .8fr)
    minmax(130px, .7fr)
    minmax(160px, .9fr)
    minmax(160px, .9fr)
    minmax(150px, .8fr)
    minmax(110px, .55fr)
    auto
    auto
    auto;
  gap: 10px;
  overflow: visible;
}

.filter-panel input,
.filter-panel select {
  min-width: 0;
  background: #fff;
  border-color: #dbe3ef;
}

.search-field input {
  height: 52px;
}

.check-pill {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #dbeafe;
  min-height: 52px;
  justify-content: center;
}

.clear-btn,
.refresh-btn,
.details-btn {
  min-height: 52px;
  background: #fff;
  color: #334155;
  border-color: #dbe3ef;
  box-shadow: none;
}

.clear-btn:hover,
.refresh-btn:hover,
.details-btn:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.type-badge {
  background: #dbeafe;
  color: #1d4ed8;
}

.type-badge.icu,
.type-badge.cardiac,
.type-badge.neonatal {
  background: #e0e7ff;
  color: #4338ca;
}

.verified {
  background: #dcfce7;
  color: #166534;
}

.call-btn,
.call-main,
.submit-btn {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 12px 22px rgba(37, 99, 235, .22);
}

.submit-btn.green {
  background: #10b981;
  box-shadow: 0 12px 22px rgba(16, 185, 129, .22);
}

.update-link {
  background: #0f172a;
  color: #fff;
}

.fare-box,
.check-pill,
.location-meta span {
  background: #eff6ff;
}

.map-box {
  border-color: #bfdbfe;
  background: linear-gradient(135deg, #dbeafe, #dcfce7);
}

.map-empty {
  color: #2563eb;
}

.card-actions {
  align-items: center;
}

.card-actions .call-btn,
.card-actions .details-btn {
  min-height: 48px;
  border-radius: 16px;
}

.service-card {
  transition: transform .18s ease, box-shadow .18s ease;
}

.service-card:hover,
.emergency-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 48px rgba(15, 23, 42, .12);
}

@media (max-width: 1180px) {
  .filter-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .check-pill,
  .clear-btn {
    width: 100%;
  }
}

@media (max-width: 760px) {
  .filter-panel,
  .emergency-grid,
  .ambulance-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .emergency-card h3 {
    padding-right: 0;
  }

  .call-now {
    position: static;
    margin-top: 12px;
    width: 100%;
  }

  .hotline-card {
    justify-content: center;
  }
}
/* ===== MODERN EMERGENCY + FILTER SECTION FIX ===== */

.emergency-strip {
  margin: 34px 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.emergency-strip h2 {
  font-size: 1.8rem;
  letter-spacing: -.035em;
  color: #0f172a;
}

.emergency-strip p {
  color: #64748b;
  font-weight: 700;
}

.refresh-btn {
  min-height: 48px !important;
  padding: 0 22px !important;
  border-radius: 18px !important;
  background: #fff !important;
  color: #2563eb !important;
  border: 1px solid #dbe3ef !important;
  box-shadow: 0 10px 22px rgba(15, 23, 42, .05) !important;
}

.emergency-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 16px !important;
  margin-bottom: 24px !important;
}

.emergency-card {
  position: relative !important;
  min-height: 148px !important;
  padding: 22px !important;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  gap: 18px !important;
  border-radius: 24px !important;
  background: #fff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 14px 34px rgba(15, 23, 42, .07) !important;
}

.emergency-card > div {
  min-width: 0;
  flex: 1;
}

.emergency-card h3 {
  margin: 12px 0 8px !important;
  padding-right: 0 !important;
  font-size: 1.15rem !important;
  line-height: 1.25 !important;
  color: #0f172a !important;
}

.emergency-card p {
  color: #64748b !important;
  font-weight: 700;
}

.call-now {
  position: static !important;
  top: auto !important;
  right: auto !important;
  width: auto !important;
  min-width: 92px !important;
  height: 44px !important;
  padding: 0 18px !important;
  border-radius: 999px !important;
  background: #2563eb !important;
  color: #fff !important;
  box-shadow: 0 12px 22px rgba(37, 99, 235, .22) !important;
  white-space: nowrap !important;
  align-self: center !important;
}

.call-now:hover {
  background: #1d4ed8 !important;
}

.mini-badge {
  display: inline-flex !important;
  align-items: center !important;
  border-radius: 999px !important;
  padding: 7px 12px !important;
  background: #dcfce7 !important;
  color: #166534 !important;
  font-size: .78rem !important;
  font-weight: 950 !important;
}

/* Filter card modern layout */
.filter-panel {
  display: grid !important;
  grid-template-columns: 1.45fr .8fr .8fr .95fr .95fr .85fr .55fr !important;
  gap: 12px !important;
  align-items: center !important;
  padding: 18px !important;
  border-radius: 26px !important;
  background: #fff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 14px 34px rgba(15, 23, 42, .07) !important;
  overflow: hidden !important;
}

.search-field,
.filter-panel input,
.filter-panel select,
.filter-panel button,
.filter-panel label {
  min-width: 0 !important;
}

.search-field input,
.filter-panel > input,
.filter-panel select {
  height: 52px !important;
  border-radius: 16px !important;
  border: 1px solid #dbe3ef !important;
  background: #fff !important;
  font-size: .92rem !important;
  font-weight: 900 !important;
}

.search-field input {
  padding-left: 44px !important;
}

.filter-panel select {
  appearance: auto;
}

.check-pill {
  height: 52px !important;
  min-height: 52px !important;
  width: auto !important;
  padding: 0 16px !important;
  border-radius: 16px !important;
  background: #eff6ff !important;
  color: #1d4ed8 !important;
  border: 1px solid #dbeafe !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 9px !important;
  white-space: nowrap !important;
  font-size: .88rem !important;
  font-weight: 950 !important;
}

.check-pill input {
  width: 16px !important;
  height: 16px !important;
  flex: 0 0 16px !important;
  accent-color: #2563eb;
}

.clear-btn {
  height: 52px !important;
  min-height: 52px !important;
  padding: 0 18px !important;
  border-radius: 16px !important;
  background: #fff !important;
  color: #334155 !important;
  border: 1px solid #dbe3ef !important;
  white-space: nowrap !important;
}

/* Put checkbox buttons on a clean second row */
.filter-panel .check-pill:nth-of-type(1),
.filter-panel .check-pill:nth-of-type(2),
.filter-panel .clear-btn {
  margin-top: 4px;
}

.filter-panel .check-pill {
  grid-column: span 1;
}

.filter-panel .clear-btn {
  grid-column: span 1;
}

@media (min-width: 1181px) {
  .filter-panel {
    grid-template-columns: 1.5fr .85fr .8fr .95fr .95fr .85fr .55fr !important;
  }

  .filter-panel .check-pill:nth-of-type(1) {
    grid-column: 1 / span 2;
  }

  .filter-panel .check-pill:nth-of-type(2) {
    grid-column: 3 / span 2;
  }

  .filter-panel .clear-btn {
    grid-column: 5 / span 1;
  }
}

@media (max-width: 1180px) {
  .emergency-grid {
    grid-template-columns: 1fr !important;
  }

  .filter-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }

  .search-field {
    grid-column: span 3;
  }
}

@media (max-width: 760px) {
  .emergency-strip {
    align-items: flex-start;
    flex-direction: column;
  }

  .refresh-btn {
    width: 100%;
  }

  .emergency-card {
    flex-direction: column !important;
  }

  .call-now {
    width: 100% !important;
  }

  .filter-panel {
    grid-template-columns: 1fr !important;
  }

  .search-field,
  .filter-panel .check-pill:nth-of-type(1),
  .filter-panel .check-pill:nth-of-type(2),
  .filter-panel .clear-btn {
    grid-column: span 1;
  }
}

/* ===== USER SIDE CHAT REQUEST UI ===== */

.chat-manager-btn {
  width: 100%;
  margin-top: 10px;
  min-height: 48px;
  border: none;
  border-radius: 16px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #bfdbfe;
}

.chat-manager-btn:hover {
  background: #2563eb;
  color: white;
}

.user-chat-modal {
  position: relative;
  width: min(1050px, 100%);
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 26px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 28px 80px rgba(15, 23, 42, .22);
  padding: 24px;
}

.user-chat-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  padding-right: 52px;
  margin-bottom: 18px;
}

.chat-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  padding: 7px 12px;
  background: #eff6ff;
  color: #2563eb;
  font-size: .78rem;
  font-weight: 950;
  margin-bottom: 10px;
}

.user-chat-head h2 {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.35rem);
  letter-spacing: -.045em;
}

.user-chat-head p {
  margin: 8px 0 0;
  max-width: 680px;
  color: #64748b;
  font-weight: 700;
}

.user-chat-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 380px;
  gap: 16px;
  align-items: start;
}

.user-chat-history,
.user-chat-form {
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  background: #f8fafc;
  padding: 16px;
}

.user-chat-history h3,
.user-chat-form h3 {
  margin: 0 0 14px;
}

.user-chat-list {
  display: grid;
  gap: 14px;
  max-height: 520px;
  overflow-y: auto;
  padding-right: 6px;
}

.user-chat-list::-webkit-scrollbar {
  width: 7px;
}

.user-chat-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.user-chat-item {
  display: grid;
  gap: 10px;
}

.user-message-bubble,
.manager-message-bubble {
  border-radius: 18px;
  padding: 12px 14px;
}

.user-message-bubble {
  background: #eff6ff;
  color: #1e3a8a;
  margin-right: 42px;
}

.manager-message-bubble {
  background: #ecfdf5;
  color: #065f46;
  margin-left: 42px;
}

.user-message-bubble span,
.manager-message-bubble span {
  display: block;
  font-size: .72rem;
  text-transform: uppercase;
  letter-spacing: .08em;
  font-weight: 950;
  margin-bottom: 5px;
}

.user-message-bubble p,
.manager-message-bubble p {
  margin: 0;
  line-height: 1.55;
}

.user-message-bubble small,
.manager-message-bubble small {
  display: block;
  margin-top: 7px;
  color: #64748b;
  font-weight: 800;
}

.chat-empty {
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  text-align: center;
  color: #64748b;
}

.chat-empty svg {
  color: #2563eb;
}

.chat-empty strong {
  color: #0f172a;
}

.user-chat-form {
  display: grid;
  gap: 11px;
  background: #fff;
}

.user-chat-form input,
.user-chat-form select,
.user-chat-form textarea {
  width: 100%;
  border: 1px solid #dbe3ef;
  border-radius: 15px;
  padding: 12px;
  font: inherit;
  font-weight: 800;
  outline: none;
}

.user-chat-form textarea {
  min-height: 140px;
  resize: vertical;
}

.user-chat-form input:focus,
.user-chat-form select:focus,
.user-chat-form textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, .12);
}

@media (max-width: 900px) {
  .user-chat-layout {
    grid-template-columns: 1fr;
  }

  .user-chat-head {
    flex-direction: column;
  }

  .user-chat-head .call-main {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .user-message-bubble,
  .manager-message-bubble {
    margin-left: 0;
    margin-right: 0;
  }
}


/* ===== FORCE MODERN AMBULANCE FILTER + HOTLINE UI ===== */
:root {
  --amb-primary: #2563eb;
  --amb-primary-dark: #1d4ed8;
  --amb-cyan: #06b6d4;
  --amb-teal: #14b8a6;
  --amb-ink: #0f172a;
  --amb-muted: #64748b;
  --amb-border: #dbeafe;
  --amb-soft: #eff6ff;
}

.ambulance-page {
  background:
    radial-gradient(circle at 12% 6%, rgba(37, 99, 235, .10), transparent 28%),
    radial-gradient(circle at 92% 4%, rgba(20, 184, 166, .12), transparent 28%),
    #f8fafc !important;
}

.ambulance-hero {
  grid-template-columns: minmax(0, 1fr) minmax(250px, 300px) !important;
  align-items: stretch !important;
}

.hotline-card {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
  min-height: 100% !important;
  border-radius: 30px !important;
  padding: 26px !important;
  background:
    radial-gradient(circle at 20% 12%, rgba(255, 255, 255, .30), transparent 26%),
    linear-gradient(135deg, #1d4ed8 0%, #2563eb 42%, #06b6d4 100%) !important;
  color: #ffffff !important;
  border: 1px solid rgba(191, 219, 254, .82) !important;
  box-shadow:
    0 28px 70px rgba(37, 99, 235, .28),
    inset 0 1px 0 rgba(255, 255, 255, .36) !important;
  transform: translateZ(0) !important;
  transition: transform .22s ease, box-shadow .22s ease, filter .22s ease !important;
}

.hotline-card::before {
  content: "" !important;
  position: absolute !important;
  inset: -45% auto auto -35% !important;
  width: 190px !important;
  height: 190px !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, .18) !important;
  z-index: -1 !important;
  animation: ambulanceGlowFloat 5s ease-in-out infinite !important;
}

.hotline-card::after {
  content: "Call Now" !important;
  position: absolute !important;
  right: 18px !important;
  bottom: 18px !important;
  border-radius: 999px !important;
  padding: 7px 11px !important;
  background: rgba(255, 255, 255, .18) !important;
  border: 1px solid rgba(255, 255, 255, .24) !important;
  color: rgba(255, 255, 255, .94) !important;
  font-size: .76rem !important;
  font-weight: 950 !important;
  letter-spacing: .02em !important;
}

.hotline-card:hover {
  transform: translateY(-4px) scale(1.01) !important;
  filter: saturate(1.05) !important;
  box-shadow:
    0 34px 86px rgba(37, 99, 235, .34),
    inset 0 1px 0 rgba(255, 255, 255, .38) !important;
}

.hotline-card > svg {
  flex: 0 0 58px !important;
  width: 58px !important;
  height: 58px !important;
  padding: 13px !important;
  border-radius: 22px !important;
  color: #ffffff !important;
  background: rgba(255, 255, 255, .18) !important;
  border: 1px solid rgba(255, 255, 255, .28) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .26) !important;
}

.hotline-card strong {
  color: #ffffff !important;
  font-size: clamp(2.45rem, 4vw, 3.35rem) !important;
  letter-spacing: -.08em !important;
  text-shadow: 0 10px 30px rgba(15, 23, 42, .22) !important;
}

.hotline-card span {
  color: #e0f2fe !important;
  font-size: .9rem !important;
  letter-spacing: .02em !important;
}

.filter-panel {
  position: relative !important;
  display: grid !important;
  grid-template-columns: minmax(270px, 1.55fr) repeat(6, minmax(118px, .85fr)) !important;
  gap: 13px !important;
  align-items: center !important;
  padding: 18px !important;
  border-radius: 30px !important;
  background: rgba(255, 255, 255, .88) !important;
  border: 1px solid rgba(219, 234, 254, .92) !important;
  box-shadow: 0 22px 55px rgba(15, 23, 42, .08) !important;
  backdrop-filter: blur(18px) !important;
  overflow: visible !important;
}

.search-field {
  position: relative !important;
  min-width: 0 !important;
}

.search-field svg {
  left: 16px !important;
  color: var(--amb-primary) !important;
  z-index: 2 !important;
  filter: drop-shadow(0 6px 12px rgba(37, 99, 235, .18)) !important;
  animation: ambulanceSearchPulse 1.8s ease-in-out infinite !important;
}

.search-field::after {
  content: "" !important;
  position: absolute !important;
  right: 15px !important;
  top: 50% !important;
  width: 15px !important;
  height: 15px !important;
  margin-top: -7.5px !important;
  border-radius: 999px !important;
  border: 2px solid rgba(37, 99, 235, .18) !important;
  border-top-color: var(--amb-primary) !important;
  opacity: .42 !important;
  animation: ambulanceSpin .95s linear infinite !important;
  pointer-events: none !important;
}

.search-field input,
.filter-panel > input,
.filter-panel select {
  height: 56px !important;
  min-height: 56px !important;
  width: 100% !important;
  border-radius: 19px !important;
  border: 1px solid #dbeafe !important;
  background: rgba(255, 255, 255, .92) !important;
  color: var(--amb-ink) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .88),
    0 10px 24px rgba(15, 23, 42, .045) !important;
  font-size: .92rem !important;
  font-weight: 900 !important;
  letter-spacing: .005em !important;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease, background .2s ease !important;
}

.search-field input {
  padding-left: 48px !important;
  padding-right: 42px !important;
}

.search-field input:focus,
.filter-panel > input:focus,
.filter-panel select:focus,
.update-form input:focus,
.update-form select:focus,
.update-form textarea:focus,
.message-form input:focus,
.message-form select:focus,
.message-form textarea:focus,
.review-form input:focus,
.review-form select:focus,
.review-form textarea:focus,
.user-chat-form input:focus,
.user-chat-form select:focus,
.user-chat-form textarea:focus {
  border-color: var(--amb-primary) !important;
  box-shadow:
    0 0 0 5px rgba(37, 99, 235, .12),
    0 14px 32px rgba(15, 23, 42, .08) !important;
  background: #ffffff !important;
}

.filter-panel select,
.update-form select,
.message-form select,
.review-form select,
.user-chat-form select {
  appearance: none !important;
  -webkit-appearance: none !important;
  padding-right: 42px !important;
  background-image:
    linear-gradient(45deg, transparent 50%, #2563eb 50%),
    linear-gradient(135deg, #2563eb 50%, transparent 50%),
    linear-gradient(135deg, rgba(239, 246, 255, .95), rgba(224, 242, 254, .95)) !important;
  background-position:
    calc(100% - 21px) 50%,
    calc(100% - 15px) 50%,
    calc(100% - 37px) 50% !important;
  background-size:
    6px 6px,
    6px 6px,
    28px 28px !important;
  background-repeat: no-repeat !important;
}

.check-pill {
  position: relative !important;
  height: 56px !important;
  min-height: 56px !important;
  width: 100% !important;
  padding: 0 16px 0 12px !important;
  border-radius: 20px !important;
  background: linear-gradient(135deg, rgba(239, 246, 255, .96), rgba(248, 250, 252, .96)) !important;
  color: #334155 !important;
  border: 1px solid #dbeafe !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 11px !important;
  font-size: .88rem !important;
  font-weight: 950 !important;
  white-space: nowrap !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .88),
    0 10px 24px rgba(15, 23, 42, .045) !important;
  cursor: pointer !important;
  transition: transform .2s ease, background .2s ease, color .2s ease, border-color .2s ease, box-shadow .2s ease !important;
}

.check-pill:hover {
  transform: translateY(-2px) !important;
  border-color: #bfdbfe !important;
  box-shadow: 0 16px 34px rgba(37, 99, 235, .10) !important;
}

.check-pill input[type="checkbox"] {
  position: relative !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  flex: 0 0 46px !important;
  width: 46px !important;
  height: 26px !important;
  margin: 0 !important;
  border-radius: 999px !important;
  border: 1px solid #cbd5e1 !important;
  background: linear-gradient(135deg, #e2e8f0, #f8fafc) !important;
  box-shadow: inset 0 2px 5px rgba(15, 23, 42, .10) !important;
  cursor: pointer !important;
  transition: background .22s ease, border-color .22s ease, box-shadow .22s ease !important;
}

.check-pill input[type="checkbox"]::after {
  content: "" !important;
  position: absolute !important;
  top: 3px !important;
  left: 3px !important;
  width: 18px !important;
  height: 18px !important;
  border-radius: 999px !important;
  background: #ffffff !important;
  box-shadow: 0 3px 8px rgba(15, 23, 42, .18) !important;
  transition: transform .22s ease, box-shadow .22s ease !important;
}

.check-pill input[type="checkbox"]:checked {
  border-color: rgba(37, 99, 235, .88) !important;
  background: linear-gradient(135deg, #2563eb, #06b6d4) !important;
  box-shadow: inset 0 1px 4px rgba(15, 23, 42, .10), 0 8px 16px rgba(37, 99, 235, .18) !important;
}

.check-pill input[type="checkbox"]:checked::after {
  transform: translateX(20px) !important;
  box-shadow: 0 4px 10px rgba(15, 23, 42, .22) !important;
}

.check-pill:has(input[type="checkbox"]:checked) {
  color: #1d4ed8 !important;
  border-color: #93c5fd !important;
  background: linear-gradient(135deg, #dbeafe, #ecfeff) !important;
  box-shadow: 0 16px 34px rgba(37, 99, 235, .13) !important;
}

.clear-btn {
  height: 56px !important;
  min-height: 56px !important;
  border-radius: 20px !important;
  color: #ffffff !important;
  background: linear-gradient(135deg, #0f172a, #2563eb) !important;
  border: 1px solid rgba(37, 99, 235, .25) !important;
  box-shadow: 0 14px 30px rgba(15, 23, 42, .16) !important;
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
}

.clear-btn:hover {
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb, #06b6d4) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 18px 38px rgba(37, 99, 235, .24) !important;
}

.empty-card {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 26px !important;
  border-color: #dbeafe !important;
  background: linear-gradient(135deg, rgba(239, 246, 255, .82), rgba(255, 255, 255, .92)) !important;
}

.empty-card::before {
  content: "" !important;
  display: inline-block !important;
  width: 18px !important;
  height: 18px !important;
  margin-right: 10px !important;
  vertical-align: -3px !important;
  border-radius: 999px !important;
  border: 3px solid rgba(37, 99, 235, .18) !important;
  border-top-color: #2563eb !important;
  animation: ambulanceSpin .85s linear infinite !important;
}

.update-form input,
.update-form select,
.update-form textarea,
.message-form input,
.message-form select,
.message-form textarea,
.review-form input,
.review-form select,
.review-form textarea,
.user-chat-form input,
.user-chat-form select,
.user-chat-form textarea {
  border-radius: 17px !important;
  border-color: #dbeafe !important;
  background: rgba(255, 255, 255, .96) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .88) !important;
  font-weight: 850 !important;
}

@keyframes ambulanceSpin {
  to { transform: rotate(360deg); }
}

@keyframes ambulanceSearchPulse {
  0%, 100% { transform: translateY(-50%) scale(1); opacity: .72; }
  50% { transform: translateY(-50%) scale(1.12); opacity: 1; }
}

@keyframes ambulanceGlowFloat {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: .88; }
  50% { transform: translate3d(28px, 20px, 0) scale(1.08); opacity: 1; }
}

@media (min-width: 1181px) {
  .filter-panel .check-pill:nth-of-type(1) {
    grid-column: 1 / span 2 !important;
  }

  .filter-panel .check-pill:nth-of-type(2) {
    grid-column: 3 / span 2 !important;
  }

  .filter-panel .clear-btn {
    grid-column: 5 / span 1 !important;
  }
}

@media (max-width: 1180px) {
  .ambulance-hero {
    grid-template-columns: 1fr !important;
  }

  .filter-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }

  .search-field {
    grid-column: span 3 !important;
  }
}

@media (max-width: 760px) {
  .filter-panel {
    grid-template-columns: 1fr !important;
    padding: 14px !important;
  }

  .search-field,
  .filter-panel .check-pill:nth-of-type(1),
  .filter-panel .check-pill:nth-of-type(2),
  .filter-panel .clear-btn {
    grid-column: span 1 !important;
  }

  .hotline-card {
    min-height: 150px !important;
  }
}

/* ===== MODERN DETAILS MODAL ONLY ===== */

.details-modal-modern {
  width: min(1120px, 96vw) !important;
  padding: 0 !important;
  border-radius: 32px !important;
  overflow: hidden !important;
  background: #f8fafc !important;
  border: 1px solid rgba(226, 232, 240, 0.95) !important;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.28) !important;
}

.details-modal-modern .modal-close {
  top: 18px !important;
  right: 18px !important;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92) !important;
  color: #0f172a !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.14);
}

.details-modern-hero {
  padding: 30px;
  padding-right: 76px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
  color: white;
  background:
    radial-gradient(circle at top right, rgba(20, 184, 166, 0.34), transparent 34%),
    linear-gradient(135deg, #2563eb, #4f46e5 58%, #14b8a6);
}

.details-modern-hero h2 {
  margin: 12px 0 10px;
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.055em;
}

.details-modern-hero p {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #dbeafe;
  font-weight: 850;
}

.modern-call-main {
  background: rgba(255, 255, 255, 0.96) !important;
  color: #2563eb !important;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.18) !important;
  white-space: nowrap;
}

.details-modern-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 18px;
  padding: 18px 22px 0;
}

.details-modal-modern .details-card,
.modern-review-form {
  border-radius: 24px !important;
  border: 1px solid #e2e8f0 !important;
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.07) !important;
}

.section-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.section-title-row h3 {
  margin: 0 0 5px;
  letter-spacing: -0.025em;
}

.section-title-row p {
  margin: 0;
  color: #64748b;
  font-weight: 800;
  font-size: 0.9rem;
}

.soft-icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #2563eb;
  flex: 0 0 auto;
}

.details-modal-modern .map-box {
  height: 260px !important;
  margin: 12px 0 !important;
  border-radius: 22px !important;
}

.modern-map-card .map-box {
  height: 300px !important;
}

.modern-share-form {
  display: grid;
  gap: 12px;
}

.modern-share-form input,
.modern-share-form textarea,
.modern-review-form input,
.modern-review-form select,
.modern-review-form textarea {
  width: 100%;
  border: 1px solid #dbe3ef !important;
  border-radius: 16px !important;
  padding: 13px 14px !important;
  font: inherit;
  font-weight: 850;
  outline: none;
  background: #ffffff;
}

.modern-share-form input:focus,
.modern-share-form textarea:focus,
.modern-review-form input:focus,
.modern-review-form select:focus,
.modern-review-form textarea:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.modern-location-btn {
  min-height: 48px !important;
  color: #2563eb !important;
  background: #eff6ff !important;
  border-color: #bfdbfe !important;
}

.modern-share-submit {
  min-height: 50px !important;
  border-radius: 16px !important;
}

.modern-equipment span {
  background: #eff6ff !important;
  color: #1d4ed8 !important;
  border: 1px solid #dbeafe;
}

.description-box {
  margin-top: 18px;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.description-box h3 {
  margin: 0 0 8px;
}

.description-box p {
  margin: 0;
  color: #475569;
  font-weight: 800;
  line-height: 1.55;
}

.modern-mini-list div {
  border: 1px solid #e2e8f0;
  background: #f8fafc !important;
}

.modern-review-form {
  margin: 18px 22px 22px;
}

.modern-review-form .submit-btn {
  min-height: 50px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
}

@media (max-width: 860px) {
  .details-modern-hero {
    flex-direction: column;
    padding-right: 72px;
  }

  .details-modern-grid {
    grid-template-columns: 1fr !important;
  }

  .details-modal-modern .map-box,
  .modern-map-card .map-box {
    height: 230px !important;
  }
}


/* ===== DETAILS MODAL SCROLL FIX - CSS ONLY, FUNCTIONS UNCHANGED ===== */

.modal-overlay {
  place-items: start center !important;
  align-items: start !important;
  justify-items: center !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 24px 14px !important;
  overscroll-behavior: contain !important;
  -webkit-overflow-scrolling: touch !important;
}

.details-modal-modern {
  max-height: calc(100vh - 48px) !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior: contain !important;
  scrollbar-gutter: stable !important;
}

.details-modal-modern::-webkit-scrollbar,
.user-chat-modal::-webkit-scrollbar,
.update-modal::-webkit-scrollbar {
  width: 9px;
}

.details-modal-modern::-webkit-scrollbar-track,
.user-chat-modal::-webkit-scrollbar-track,
.update-modal::-webkit-scrollbar-track {
  background: rgba(226, 232, 240, 0.65);
  border-radius: 999px;
}

.details-modal-modern::-webkit-scrollbar-thumb,
.user-chat-modal::-webkit-scrollbar-thumb,
.update-modal::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #2563eb, #14b8a6);
  border-radius: 999px;
}

.details-modal-modern .map-box iframe,
.details-modal-modern iframe {
  pointer-events: none !important;
}

.details-modal-modern .details-modern-hero {
  position: relative !important;
  z-index: 1 !important;
}

.details-modal-modern .details-modern-grid,
.details-modal-modern .modern-review-form {
  position: relative !important;
  z-index: 2 !important;
}

@media (max-width: 860px) {
  .modal-overlay {
    padding: 12px !important;
  }

  .details-modal-modern {
    width: 100% !important;
    max-height: calc(100vh - 24px) !important;
    border-radius: 24px !important;
  }
}

`;