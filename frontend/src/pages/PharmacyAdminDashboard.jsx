import { useEffect, useMemo, useState } from "react";
import {
  BadgePercent,
  CheckCircle,
  Edit3,
  ImagePlus,
  Package,
  PackageCheck,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import api from "../services/api.js";

const portalAuthStyles = `
.portal-auth-screen {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  overflow: hidden;
  isolation: isolate;
  color: #0f172a;
}

.portal-auth-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  background:
    radial-gradient(circle at 22% 18%, rgba(255,255,255,.22), transparent 21%),
    linear-gradient(135deg, #14b8a6 0%, #22d3ee 48%, #2563eb 100%);
}

.portal-auth-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: gridDrift 18s linear infinite;
}

.portal-auth-bg::after {
  content: "";
  position: absolute;
  left: -14%;
  right: -14%;
  bottom: -29%;
  height: 48%;
  background: rgba(209, 250, 249, .56);
  border-radius: 50% 50% 0 0;
  animation: waveFloat 8s ease-in-out infinite;
}

.portal-blob {
  position: absolute;
  border-radius: 999px;
  filter: blur(38px);
  opacity: .35;
  animation: blobFloat 11s ease-in-out infinite;
}

.portal-blob.one {
  width: 260px;
  height: 260px;
  left: 11%;
  bottom: 16%;
  background: #99f6e4;
}

.portal-blob.two {
  width: 310px;
  height: 310px;
  right: 13%;
  top: 15%;
  background: #93c5fd;
  animation-delay: -4s;
}

.portal-float-icon {
  position: absolute;
  width: clamp(54px, 7vw, 92px);
  height: clamp(54px, 7vw, 92px);
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255,255,255,.22);
  color: rgba(255,255,255,.92);
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  font-weight: 950;
  border: 1px solid rgba(255,255,255,.18);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 50px rgba(15,23,42,.08);
  animation: floatUp 5.4s ease-in-out infinite;
}

.float-1 { left: 7%; top: 18%; animation-delay: 0s; }
.float-2 { left: 31%; top: 7%; animation-delay: .8s; }
.float-3 { right: 8%; top: 23%; animation-delay: 1.4s; }
.float-4 { right: 39%; top: 14%; animation-delay: 2s; }

.portal-ecg-line {
  position: absolute;
  left: 0;
  top: 13%;
  width: 100%;
  height: 100px;
  opacity: .52;
}

.portal-ecg-line svg {
  width: 100%;
  height: 100%;
}

.portal-ecg-line path {
  fill: none;
  stroke: rgba(255,255,255,.75);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1300;
  stroke-dashoffset: 1300;
  animation: ecgMove 4.4s linear infinite;
}

.portal-login-card {
  position: relative;
  z-index: 3;
  width: min(520px, 100%);
  display: grid;
  gap: 15px;
  padding: clamp(26px, 4vw, 38px);
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,.55);
  background: rgba(236, 254, 255, .72);
  box-shadow: 0 34px 90px rgba(15,23,42,.22);
  backdrop-filter: blur(20px);
  animation: cardEnter .65s ease both;
}

.portal-login-icon {
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  justify-self: center;
  border-radius: 50%;
  color: #0f766e;
  background: rgba(255,255,255,.48);
  box-shadow: 0 18px 45px rgba(15,23,42,.12);
}

.portal-login-card h1 {
  margin: 8px 0 0;
  color: #334155;
  font-size: clamp(2rem, 4vw, 2.55rem);
  line-height: 1.05;
  text-align: center;
  letter-spacing: .03em;
}

.portal-login-card p {
  margin: 0 auto 10px;
  max-width: 410px;
  color: #64748b;
  text-align: center;
  font-weight: 800;
  line-height: 1.55;
}

.portal-login-card form {
  display: grid;
  gap: 14px;
}

.portal-login-card label {
  display: grid;
  gap: 7px;
  color: #0f766e;
  font-size: .83rem;
  font-weight: 950;
  letter-spacing: .02em;
}

.portal-login-card input {
  width: 100%;
  min-height: 50px;
  border: 0;
  border-bottom: 1px solid rgba(15,118,110,.28);
  border-radius: 9px 9px 0 0;
  background: rgba(239, 246, 255, .82);
  padding: 12px 14px;
  color: #0f172a;
  font: inherit;
  font-weight: 800;
  outline: none;
  transition: .2s ease;
}

.portal-login-card input:focus {
  background: rgba(255,255,255,.92);
  border-color: #0f766e;
  box-shadow: 0 8px 22px rgba(15,118,110,.12);
}

.portal-login-card button {
  min-height: 56px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #14b8a6, #0891b2);
  color: white;
  box-shadow: 0 18px 34px rgba(8,145,178,.28);
  cursor: pointer;
  font-weight: 950;
  letter-spacing: .09em;
  text-transform: uppercase;
  transition: .2s ease;
}

.portal-login-card button:hover {
  transform: translateY(-1px);
  box-shadow: 0 22px 42px rgba(8,145,178,.34);
}

.portal-login-card button:disabled {
  opacity: .68;
  cursor: not-allowed;
  transform: none;
}

.portal-login-alert,
.admin-login-alert,
.td-notice {
  border-radius: 15px;
  padding: 12px 14px;
  font-weight: 900;
}

.portal-login-alert.success,
.admin-login-alert.success,
.td-notice.success {
  background: rgba(220, 252, 231, .9);
  color: #166534;
}

.portal-login-alert.error,
.admin-login-alert.error,
.td-notice.error {
  background: rgba(254, 226, 226, .92);
  color: #991b1b;
}

.portal-login-help {
  margin-top: 2px;
  color: #475569;
  text-align: center;
  font-weight: 800;
}

@keyframes cardEnter {
  from { opacity: 0; transform: translateY(18px) scale(.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes floatUp {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-18px) scale(1.04); }
}

@keyframes blobFloat {
  0%, 100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(20px,-18px,0) scale(1.08); }
}

@keyframes ecgMove {
  to { stroke-dashoffset: 0; }
}

@keyframes waveFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
}

@keyframes gridDrift {
  to { background-position: 48px 48px; }
}

@media (max-width: 640px) {
  .portal-login-card { border-radius: 24px; }
  .float-2, .float-4 { display: none; }
}
`;

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  manufacturer: "",
  description: "",
  mrp: "",
  price: "",
  discount: "",
  is_special_offer: false,
  in_stock: true,
  stock_quantity: 100,
  image: null,
};

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

function money(value) {
  return Number(value || 0).toFixed(2);
}

function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
}

function PortalAuthBackground() {
  return (
    <div className="portal-auth-bg" aria-hidden="true">
      <span className="portal-blob one" />
      <span className="portal-blob two" />
      <span className="portal-float-icon float-1">✚</span>
      <span className="portal-float-icon float-2">♥</span>
      <span className="portal-float-icon float-3">⚕</span>
      <span className="portal-float-icon float-4">◐</span>
      <div className="portal-ecg-line">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0 70 H175 L210 70 L245 38 L285 94 L322 70 H480 L508 70 L530 48 L552 92 L584 70 H760 L790 70 L816 38 L846 98 L884 70 H1075 L1110 70 L1138 46 L1168 90 L1206 70 H1440" />
        </svg>
      </div>
    </div>
  );
}

export default function PharmacyAdminDashboard() {
  const [adminToken, setAdminToken] = useState(() =>
  localStorage.getItem("pharmacy_admin_token") || ""
);

const [loginForm, setLoginForm] = useState({
  username: "",
  password: "",
});
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deliverySettings, setDeliverySettings] = useState({
    delivery_charge: 60,
    free_delivery_threshold: 500,
  });
  const [activePanel, setActivePanel] = useState("products");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const formPreview = useMemo(() => {
    if (productForm.image instanceof File) {
      return URL.createObjectURL(productForm.image);
    }

    return productForm.image ? imageUrl(productForm.image) : "";
  }, [productForm.image]);

  useEffect(() => {
  if (adminToken) {
    loadAdminData();
  }
}, [adminToken]);

  useEffect(() => {
  if (!adminToken) return;

  const timer = setTimeout(loadProducts, 250);
  return () => clearTimeout(timer);
}, [search, adminToken]);

  useEffect(() => {
  if (adminToken) {
    loadOrders();
  }
}, [orderStatus, adminToken]);

  async function loadAdminData() {
    setLoading(true);

    try {
      const [summaryResponse, productsResponse, ordersResponse] = await Promise.all([
        api.get("/pharmacy/admin/summary", adminConfig()),
        api.get("/pharmacy/admin/products", adminConfig()),
        api.get("/pharmacy/admin/orders", adminConfig()),
      ]);

      setSummary(summaryResponse.data.data);
      setProducts(productsResponse.data.data || []);
      setOrders(ordersResponse.data.data || []);

      if (summaryResponse.data.data?.settings) {
        setDeliverySettings(summaryResponse.data.data.settings);
      }
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error.response?.data?.message ||
          "Could not load pharmacy admin dashboard. Make sure your admin email is set in PHARMACY_ADMIN_EMAILS.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const response = await api.get("/pharmacy/admin/products", {
  ...adminConfig(),
  params: { search },
});

      setProducts(response.data.data || []);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not load products.",
      });
    }
  }

  async function loadOrders() {
    try {
      const response = await api.get("/pharmacy/admin/orders", {
  ...adminConfig(),
  params: { status: orderStatus },
});

      setOrders(response.data.data || []);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not load orders.",
      });
    }
  }

  function adminConfig(extraHeaders = {}) {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("pharmacy_admin_token") || adminToken}`,
      ...extraHeaders,
    },
  };
}

function updateLoginForm(event) {
  const { name, value } = event.target;

  setLoginForm((current) => ({
    ...current,
    [name]: value,
  }));
}

async function submitAdminLogin(event) {
  event.preventDefault();

  setLoading(true);
  setNotice(null);

  try {
    const response = await api.post("/pharmacy/admin/login", loginForm);

    localStorage.setItem("pharmacy_admin_token", response.data.token);
    setAdminToken(response.data.token);

    setNotice({
      type: "success",
      message: response.data.message || "Admin login successful.",
    });
  } catch (error) {
    setNotice({
      type: "error",
      message: error.response?.data?.message || "Invalid admin login.",
    });
  } finally {
    setLoading(false);
  }
}

function logoutAdmin() {
  localStorage.removeItem("pharmacy_admin_token");
  setAdminToken("");
  setSummary(null);
  setProducts([]);
  setOrders([]);
}

  function updateProductField(event) {
    const { name, value, type, checked, files } = event.target;

    setProductForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  }

  function startEdit(product) {
    setEditingProduct(product);

    setProductForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      manufacturer: product.manufacturer || "",
      description: product.description || "",
      mrp: product.mrp || "",
      price: product.price || "",
      discount: product.discount || "",
      is_special_offer: Boolean(product.is_special_offer),
      in_stock: Boolean(product.in_stock),
      stock_quantity: product.stock_quantity || 0,
      image: product.image || null,
    });

    setActivePanel("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetProductForm() {
    setEditingProduct(null);
    setProductForm(emptyProduct);
  }

  async function submitProduct(event) {
    event.preventDefault();
    setLoading(true);
    setNotice(null);

    const formData = new FormData();

    Object.entries(productForm).forEach(([key, value]) => {
      if (key === "image") {
        if (value instanceof File) formData.append("image", value);
        return;
      }

      if (key === "is_special_offer" || key === "in_stock") {
        formData.append(key, value ? "1" : "0");
        return;
      }

      formData.append(key, value ?? "");
    });

    try {
      const response = editingProduct
        ? await api.patch(`/pharmacy/admin/products/${editingProduct.id}`, formData, adminConfig({
  "Content-Type": "multipart/form-data",
}))
        : await api.post("/pharmacy/admin/products", formData, adminConfig({
  "Content-Type": "multipart/form-data",
}));

      setNotice({
        type: "success",
        message: response.data.message || "Product saved successfully.",
      });

      resetProductForm();
      await loadProducts();
      await loadAdminData();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not save product.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(productId) {
    if (!window.confirm("Delete this product?")) return;

    setLoading(true);

    try {
      const response = await api.delete(`/pharmacy/admin/products/${productId}`, adminConfig());

      setNotice({
        type: "success",
        message: response.data.message || "Product deleted successfully.",
      });

      await loadProducts();
      await loadAdminData();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not delete product.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(
  `/pharmacy/admin/orders/${orderId}/status`,
  { status },
  adminConfig()
);

      setNotice({
        type: "success",
        message: response.data.message || "Order status updated.",
      });

      setOrders((current) =>
        current.map((order) =>
          order.order_id === orderId ? response.data.data : order
        )
      );

      await loadAdminData();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not update order status.",
      });
    }
  }

  function updateDeliveryField(event) {
    const { name, value } = event.target;

    setDeliverySettings((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveDeliverySettings(event) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await api.patch(
  "/pharmacy/admin/settings/delivery",
  deliverySettings,
  adminConfig()
);

      setNotice({
        type: "success",
        message: response.data.message || "Delivery settings updated.",
      });

      setDeliverySettings(response.data.data);
      await loadAdminData();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Could not update delivery settings.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!adminToken) {
    return (
      <section className="portal-auth-screen pharmacy-admin-login">
        <style>{portalAuthStyles}</style>
        <PortalAuthBackground />

        <div className="portal-login-card">
          <div className="portal-login-icon">
            <Settings size={32} />
          </div>

          <h1>Pharmacy Admin Login</h1>
          <p>
            Enter pharmacy admin username and password to manage products,
            orders, delivery, and prices.
          </p>

          {notice && (
            <div className={`portal-login-alert ${notice.type}`}>
              {notice.message}
            </div>
          )}

          <form onSubmit={submitAdminLogin}>
            <label>
              Admin Username
              <input
                name="username"
                value={loginForm.username}
                onChange={updateLoginForm}
                placeholder="pharmacyadmin"
                required
              />
            </label>

            <label>
              Admin Password
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={updateLoginForm}
                placeholder="Enter admin password"
                required
              />
            </label>

            <button disabled={loading}>
              {loading ? "Signing in..." : "Access Admin Dashboard"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="pharm-admin">
      <style>{styles}</style>

      <div className="admin-hero">
        <div>
          <span>
            <Settings size={18} />
            Pharmacy Admin
          </span>
          <h1>Manage products, prices, delivery, and pharmacy orders.</h1>
          <p>
            Add new medicines, upload product photos, update prices, manage stock,
            and control delivery status from one dashboard.
          </p>
        </div>

        <div className="admin-hero-actions">
  <button className="admin-refresh" onClick={loadAdminData}>
    <RefreshCcw size={17} />
    Refresh
  </button>

  <button className="admin-logout" onClick={logoutAdmin}>
    Logout Admin
  </button>
</div>
      </div>

      {notice && <div className={`admin-notice ${notice.type}`}>{notice.message}</div>}

      <div className="admin-stats">
        <Stat icon={<Package />} label="Products" value={summary?.products?.total_products || 0} />
        <Stat icon={<PackageCheck />} label="In Stock" value={summary?.products?.in_stock || 0} />
        <Stat icon={<BadgePercent />} label="Offers" value={summary?.products?.special_offers || 0} />
        <Stat icon={<ShoppingBag />} label="Orders" value={summary?.orders?.total_orders || 0} />
      </div>

      <div className="admin-tabs">
        <button className={activePanel === "products" ? "active" : ""} onClick={() => setActivePanel("products")}>
          <Package size={16} />
          Products
        </button>
        <button className={activePanel === "orders" ? "active" : ""} onClick={() => setActivePanel("orders")}>
          <Truck size={16} />
          Delivery / Orders
        </button>
        <button className={activePanel === "settings" ? "active" : ""} onClick={() => setActivePanel("settings")}>
          <Settings size={16} />
          Delivery Settings
        </button>
      </div>

      {activePanel === "products" && (
        <div className="admin-grid">
          <form className="admin-card product-form" onSubmit={submitProduct}>
            <div className="admin-card-head">
              <div>
                <h2>{editingProduct ? "Update Product" : "Add New Product"}</h2>
                <p>Set medicine details, stock, offer, price, and image.</p>
              </div>

              {editingProduct && (
                <button className="icon-btn" type="button" onClick={resetProductForm}>
                  <X size={17} />
                </button>
              )}
            </div>

            <label>
              Product Name *
              <input name="name" value={productForm.name} onChange={updateProductField} required />
            </label>

            <label>
              SKU
              <input name="sku" value={productForm.sku} onChange={updateProductField} placeholder="MED-PARA-500" />
            </label>

            <div className="two">
              <label>
                Category *
                <input name="category" value={productForm.category} onChange={updateProductField} required />
              </label>

              <label>
                Manufacturer *
                <input name="manufacturer" value={productForm.manufacturer} onChange={updateProductField} required />
              </label>
            </div>

            <div className="two">
              <label>
                MRP *
                <input type="number" step="0.01" name="mrp" value={productForm.mrp} onChange={updateProductField} required />
              </label>

              <label>
                Selling Price *
                <input type="number" step="0.01" name="price" value={productForm.price} onChange={updateProductField} required />
              </label>
            </div>

            <div className="two">
              <label>
                Discount %
                <input type="number" name="discount" value={productForm.discount} onChange={updateProductField} />
              </label>

              <label>
                Stock Quantity
                <input type="number" name="stock_quantity" value={productForm.stock_quantity} onChange={updateProductField} />
              </label>
            </div>

            <label>
              Description
              <textarea name="description" value={productForm.description} onChange={updateProductField} />
            </label>

            <div className="checks">
              <label>
                <input type="checkbox" name="is_special_offer" checked={productForm.is_special_offer} onChange={updateProductField} />
                Special offer
              </label>

              <label>
                <input type="checkbox" name="in_stock" checked={productForm.in_stock} onChange={updateProductField} />
                In stock
              </label>
            </div>

            <label className="upload-box">
              <ImagePlus size={22} />
              <strong>Upload Product Photo</strong>
              <span>PNG, JPG, WEBP up to 2MB</span>
              <input type="file" name="image" accept="image/*" onChange={updateProductField} />
            </label>

            {formPreview && (
              <img className="preview-img" src={formPreview} alt="Product preview" />
            )}

            <button className="save-btn" disabled={loading}>
              <Save size={17} />
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </form>

          <div className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Product List</h2>
                <p>Search, edit, or remove pharmacy products.</p>
              </div>
            </div>

            <label className="admin-search">
              <Search size={17} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product..." />
            </label>

            <div className="product-table">
              {products.map((product) => (
                <div className="product-row" key={product.id}>
                  <div className="product-photo">
                    {product.image ? (
                      <img src={imageUrl(product.image)} alt={product.name} />
                    ) : (
                      <Package size={22} />
                    )}
                  </div>

                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.category} · {product.manufacturer}</p>
                    <small>Stock: {product.stock_quantity ?? 0}</small>
                  </div>

                  <div className="price-col">
                    <strong>৳{money(product.price)}</strong>
                    <del>৳{money(product.mrp)}</del>
                  </div>

                  <div className="row-actions">
                    <button type="button" onClick={() => startEdit(product)}>
                      <Edit3 size={15} />
                    </button>
                    <button type="button" className="danger" onClick={() => deleteProduct(product.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {!products.length && <div className="empty-admin">No products found.</div>}
            </div>
          </div>
        </div>
      )}

      {activePanel === "orders" && (
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <h2>Delivery / Order Status</h2>
              <p>Update pending, confirmed, processing, shipped, delivered, or cancelled status.</p>
            </div>

            <select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)}>
              <option value="">All Orders</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="orders-admin-list">
            {orders.map((order) => (
              <article className="admin-order" key={order.order_id}>
                <div>
                  <h3>#{order.order_id}</h3>
                  <p>{order.customer_name} · {order.phone_number}</p>
                  <p>{order.address}, {order.district}, {order.division}</p>
                  <small>{order.items?.length || 0} item(s) · ৳{money(order.final_total)}</small>
                </div>

                <div className="order-items-mini">
                  {order.items?.slice(0, 3).map((item) => (
                    <span key={item.id}>{item.product_name} × {item.quantity}</span>
                  ))}
                </div>

                <select
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.order_id, event.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </article>
            ))}

            {!orders.length && <div className="empty-admin">No orders found.</div>}
          </div>
        </div>
      )}

      

      {activePanel === "settings" && (
        <form className="admin-card settings-card" onSubmit={saveDeliverySettings}>
          <div className="admin-card-head">
            <div>
              <h2>Delivery Settings</h2>
              <p>Control delivery charge and free delivery threshold for pharmacy orders.</p>
            </div>
          </div>

          <div className="two">
            <label>
              Delivery Charge
              <input
                type="number"
                name="delivery_charge"
                value={deliverySettings.delivery_charge}
                onChange={updateDeliveryField}
              />
            </label>

            <label>
              Free Delivery Minimum
              <input
                type="number"
                name="free_delivery_threshold"
                value={deliverySettings.free_delivery_threshold}
                onChange={updateDeliveryField}
              />
            </label>
          </div>

          <button className="save-btn" disabled={loading}>
            <Save size={17} />
            Save Delivery Settings
          </button>
        </form>
      )}
    </section>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="admin-stat">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

const styles = `
.pharm-admin {
  color: #0f172a;
}

.admin-hero-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.admin-logout {
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 950;
  cursor: pointer;
  background: #fee2e2;
  color: #b91c1c;
}

.admin-logout:hover {
  background: #ef4444;
  color: white;
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  padding: 28px;
  border-radius: 28px;
  color: #fff;
  background: linear-gradient(135deg, #0f766e, #2563eb 55%, #4f46e5);
  box-shadow: 0 24px 60px rgba(37,99,235,.24);
  margin-bottom: 18px;
}

.admin-hero span,
.admin-refresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.admin-hero span {
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 900;
  margin-bottom: 14px;
}

.admin-hero h1 {
  margin: 0;
  max-width: 780px;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1;
  letter-spacing: -.06em;
}

.admin-hero p {
  max-width: 700px;
  color: #dbeafe;
}

.admin-refresh,
.save-btn {
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 950;
  cursor: pointer;
}

.admin-refresh {
  background: #fff;
  color: #2563eb;
}

.admin-notice {
  padding: 13px 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  font-weight: 900;
}

.admin-notice.success {
  background: #dcfce7;
  color: #166534;
}

.admin-notice.error {
  background: #fee2e2;
  color: #991b1b;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.admin-stat,
.admin-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  box-shadow: 0 14px 34px rgba(15,23,42,.07);
}

.admin-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
}

.admin-stat > span {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  color: #2563eb;
  background: #dbeafe;
}

.admin-stat strong {
  display: block;
  font-size: 1.45rem;
}

.admin-stat small {
  color: #64748b;
  font-weight: 800;
}

.admin-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.admin-tabs button {
  border: 1px solid #dbe3ef;
  background: white;
  color: #334155;
  border-radius: 999px;
  padding: 11px 16px;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.admin-tabs button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.admin-grid {
  display: grid;
  grid-template-columns: 420px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.admin-card {
  padding: 20px;
}

.admin-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.admin-card h2,
.admin-card h3 {
  margin: 0;
}

.admin-card p {
  color: #64748b;
  margin: 5px 0 0;
}

.product-form {
  display: grid;
  gap: 12px;
}

.product-form label,
.settings-card label {
  display: grid;
  gap: 7px;
  color: #334155;
  font-weight: 900;
  font-size: .88rem;
}

.product-form input,
.product-form textarea,
.product-form select,
.settings-card input,
.admin-card-head select,
.admin-search input,
.admin-order select {
  width: 100%;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  padding: 12px;
  font: inherit;
  font-weight: 700;
  outline: none;
}

.product-form textarea {
  min-height: 86px;
  resize: vertical;
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.checks {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.checks label {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px 12px;
}

.upload-box {
  border: 1px dashed #93c5fd;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 18px;
  padding: 18px;
  text-align: center;
  cursor: pointer;
}

.upload-box input {
  display: none;
}

.upload-box span {
  color: #64748b;
  font-weight: 700;
}

.preview-img {
  width: 100%;
  max-height: 190px;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
}

.save-btn {
  background: #2563eb;
  color: white;
  box-shadow: 0 10px 20px rgba(37,99,235,.22);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.icon-btn {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.admin-search {
  position: relative;
  display: block;
  margin-bottom: 14px;
}

.admin-search svg {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.admin-search input {
  padding-left: 42px;
}

.product-table,
.orders-admin-list {
  display: grid;
  gap: 12px;
}

.product-row,
.admin-order {
  display: grid;
  gap: 12px;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 14px;
  background: #f8fafc;
}

.product-row {
  grid-template-columns: 64px 1fr auto auto;
}

.product-photo {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #2563eb;
  background: #dbeafe;
  overflow: hidden;
}

.product-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-row h3 {
  font-size: 1rem;
}

.product-row p,
.product-row small {
  color: #64748b;
}

.price-col strong,
.price-col del {
  display: block;
  text-align: right;
}

.price-col strong {
  color: #047857;
}

.price-col del {
  color: #94a3b8;
  font-size: .85rem;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.row-actions button {
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #2563eb;
  background: #dbeafe;
  cursor: pointer;
}

.row-actions button.danger {
  color: #b91c1c;
  background: #fee2e2;
}

.admin-order {
  grid-template-columns: 1.2fr 1fr 180px;
}

.admin-order h3 {
  font-size: 1.05rem;
}

.admin-order p,
.admin-order small {
  color: #64748b;
  margin: 3px 0;
}

.order-items-mini {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-items-mini span {
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 6px 9px;
  font-weight: 800;
  font-size: .82rem;
}

.empty-admin {
  text-align: center;
  color: #64748b;
  padding: 26px;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
}

@media (max-width: 980px) {
  .admin-grid,
  .admin-order {
    grid-template-columns: 1fr;
  }

  .admin-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .admin-hero {
    flex-direction: column;
  }

  .admin-stats,
  .two,
  .product-row {
    grid-template-columns: 1fr;
  }

  .price-col strong,
  .price-col del {
    text-align: left;
  }
}

/* ===== MODERN PHARMACY ADMIN UI OVERRIDE - CSS ONLY ===== */
.pharm-admin {
  min-height: 100vh !important;
  padding: 28px clamp(16px, 3vw, 34px) 56px !important;
  background:
    radial-gradient(circle at 8% 4%, rgba(20, 184, 166, .16), transparent 28%),
    radial-gradient(circle at 88% 8%, rgba(37, 99, 235, .14), transparent 30%),
    linear-gradient(180deg, #f8fafc 0%, #eef6ff 100%) !important;
  color: #0f172a !important;
}

.admin-hero {
  position: relative !important;
  overflow: hidden !important;
  isolation: isolate !important;
  padding: clamp(28px, 4vw, 46px) !important;
  border-radius: 34px !important;
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 255, 255, .25), transparent 24%),
    radial-gradient(circle at 92% 8%, rgba(45, 212, 191, .36), transparent 28%),
    linear-gradient(135deg, #2563eb 0%, #4f46e5 48%, #14b8a6 100%) !important;
  border: 1px solid rgba(191, 219, 254, .72) !important;
  box-shadow: 0 30px 90px rgba(37, 99, 235, .26) !important;
}

.admin-hero::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: -1 !important;
  background-image:
    linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px) !important;
  background-size: 46px 46px !important;
  mask-image: linear-gradient(90deg, rgba(0,0,0,.55), transparent 72%) !important;
}

.admin-hero::after {
  content: "" !important;
  position: absolute !important;
  right: -90px !important;
  bottom: -110px !important;
  width: 290px !important;
  height: 290px !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, .15) !important;
  z-index: -1 !important;
}

.admin-hero span {
  padding: 9px 14px !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, .18) !important;
  border: 1px solid rgba(255, 255, 255, .25) !important;
  backdrop-filter: blur(12px) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18) !important;
}

.admin-hero h1 {
  max-width: 880px !important;
  letter-spacing: -.07em !important;
}

.admin-hero p {
  margin-bottom: 0 !important;
  color: rgba(239, 246, 255, .92) !important;
  font-weight: 850 !important;
  line-height: 1.58 !important;
}

.admin-hero-actions {
  align-self: stretch !important;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: flex-end !important;
}

.admin-refresh,
.admin-logout,
.save-btn {
  min-height: 52px !important;
  border-radius: 18px !important;
  padding: 0 20px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 9px !important;
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease, background .2s ease !important;
}

.admin-refresh {
  background: rgba(255, 255, 255, .92) !important;
  color: #2563eb !important;
  border: 1px solid rgba(255, 255, 255, .5) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, .12) !important;
}

.admin-logout {
  background: rgba(15, 23, 42, .88) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, .18) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, .16) !important;
}

.admin-refresh:hover,
.admin-logout:hover,
.save-btn:hover,
.admin-tabs button:hover,
.row-actions button:hover {
  transform: translateY(-2px) !important;
}

.admin-stats {
  gap: 16px !important;
  margin: 20px 0 !important;
}

.admin-stat,
.admin-card {
  background: rgba(255, 255, 255, .88) !important;
  border: 1px solid rgba(219, 234, 254, .9) !important;
  box-shadow: 0 22px 56px rgba(15, 23, 42, .075) !important;
  backdrop-filter: blur(18px) !important;
}

.admin-stat {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 26px !important;
  padding: 20px !important;
}

.admin-stat::after {
  content: "" !important;
  position: absolute !important;
  right: -24px !important;
  top: -24px !important;
  width: 92px !important;
  height: 92px !important;
  border-radius: 999px !important;
  background: rgba(37, 99, 235, .08) !important;
}

.admin-stat > span {
  width: 56px !important;
  height: 56px !important;
  border-radius: 20px !important;
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
  box-shadow: 0 16px 32px rgba(37, 99, 235, .22) !important;
}

.admin-stat strong {
  font-size: 1.75rem !important;
  letter-spacing: -.035em !important;
}

.admin-stat small {
  color: #64748b !important;
  font-weight: 950 !important;
}

.admin-tabs {
  position: sticky !important;
  top: 10px !important;
  z-index: 15 !important;
  gap: 10px !important;
  padding: 10px !important;
  margin-bottom: 20px !important;
  border-radius: 24px !important;
  background: rgba(255, 255, 255, .78) !important;
  border: 1px solid rgba(219, 234, 254, .9) !important;
  box-shadow: 0 14px 36px rgba(15, 23, 42, .07) !important;
  backdrop-filter: blur(18px) !important;
}

.admin-tabs button {
  min-height: 48px !important;
  border-radius: 16px !important;
  padding: 0 18px !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  color: #475569 !important;
  transition: transform .2s ease, background .2s ease, color .2s ease, box-shadow .2s ease !important;
}

.admin-tabs button.active {
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
  color: #ffffff !important;
  border-color: rgba(37, 99, 235, .24) !important;
  box-shadow: 0 16px 34px rgba(37, 99, 235, .22) !important;
}

.admin-grid {
  gap: 22px !important;
  grid-template-columns: minmax(360px, 430px) minmax(0, 1fr) !important;
}

.admin-card {
  border-radius: 30px !important;
  padding: 24px !important;
}

.admin-card-head {
  align-items: center !important;
  padding-bottom: 14px !important;
  border-bottom: 1px solid #eaf1fb !important;
}

.admin-card h2 {
  font-size: clamp(1.35rem, 2.2vw, 1.85rem) !important;
  letter-spacing: -.04em !important;
  color: #0f172a !important;
}

.admin-card p {
  color: #64748b !important;
  font-weight: 800 !important;
}

.product-form {
  gap: 14px !important;
}

.product-form label,
.settings-card label {
  color: #334155 !important;
  font-weight: 950 !important;
  letter-spacing: .01em !important;
}

.product-form input,
.product-form textarea,
.product-form select,
.settings-card input,
.admin-card-head select,
.admin-search input,
.admin-order select {
  min-height: 52px !important;
  border-radius: 18px !important;
  border: 1px solid #dbeafe !important;
  background: rgba(255, 255, 255, .96) !important;
  color: #0f172a !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .9), 0 9px 20px rgba(15, 23, 42, .035) !important;
  font-weight: 850 !important;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease !important;
}

.product-form input:focus,
.product-form textarea:focus,
.product-form select:focus,
.settings-card input:focus,
.admin-card-head select:focus,
.admin-search input:focus,
.admin-order select:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 5px rgba(37, 99, 235, .12), 0 16px 34px rgba(15, 23, 42, .07) !important;
  outline: none !important;
}

.product-form textarea {
  min-height: 110px !important;
}

.product-form select,
.settings-card select,
.admin-card-head select,
.admin-order select {
  appearance: none !important;
  -webkit-appearance: none !important;
  padding-right: 44px !important;
  background-image:
    linear-gradient(45deg, transparent 50%, #2563eb 50%),
    linear-gradient(135deg, #2563eb 50%, transparent 50%),
    linear-gradient(135deg, rgba(239, 246, 255, .96), rgba(224, 242, 254, .96)) !important;
  background-position:
    calc(100% - 22px) 50%,
    calc(100% - 16px) 50%,
    calc(100% - 38px) 50% !important;
  background-size: 6px 6px, 6px 6px, 30px 30px !important;
  background-repeat: no-repeat !important;
}

.checks {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 12px !important;
}

.checks label {
  position: relative !important;
  min-height: 58px !important;
  padding: 12px 14px !important;
  border-radius: 20px !important;
  background: linear-gradient(135deg, rgba(239, 246, 255, .96), rgba(248, 250, 252, .96)) !important;
  border: 1px solid #dbeafe !important;
  color: #334155 !important;
  font-weight: 950 !important;
  cursor: pointer !important;
  box-shadow: 0 10px 24px rgba(15, 23, 42, .045) !important;
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease, background .2s ease !important;
}

.checks label:hover {
  transform: translateY(-2px) !important;
  border-color: #93c5fd !important;
  box-shadow: 0 16px 34px rgba(37, 99, 235, .12) !important;
}

.checks input[type="checkbox"] {
  appearance: none !important;
  -webkit-appearance: none !important;
  flex: 0 0 48px !important;
  width: 48px !important;
  height: 28px !important;
  margin: 0 !important;
  border-radius: 999px !important;
  border: 1px solid #cbd5e1 !important;
  background: linear-gradient(135deg, #e2e8f0, #f8fafc) !important;
  box-shadow: inset 0 2px 5px rgba(15, 23, 42, .10) !important;
  cursor: pointer !important;
  position: relative !important;
  transition: background .22s ease, border-color .22s ease, box-shadow .22s ease !important;
}

.checks input[type="checkbox"]::after {
  content: "" !important;
  position: absolute !important;
  top: 3px !important;
  left: 3px !important;
  width: 20px !important;
  height: 20px !important;
  border-radius: 999px !important;
  background: #ffffff !important;
  box-shadow: 0 3px 8px rgba(15, 23, 42, .18) !important;
  transition: transform .22s ease, box-shadow .22s ease !important;
}

.checks input[type="checkbox"]:checked {
  border-color: rgba(37, 99, 235, .88) !important;
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
  box-shadow: 0 8px 16px rgba(37, 99, 235, .18) !important;
}

.checks input[type="checkbox"]:checked::after {
  transform: translateX(20px) !important;
}

.checks label:has(input[type="checkbox"]:checked) {
  color: #1d4ed8 !important;
  border-color: #93c5fd !important;
  background: linear-gradient(135deg, #dbeafe, #ecfeff) !important;
}

.upload-box {
  position: relative !important;
  overflow: hidden !important;
  min-height: 150px !important;
  border-radius: 24px !important;
  border: 1px dashed #60a5fa !important;
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, .15), transparent 35%),
    linear-gradient(135deg, #eff6ff, #ecfeff) !important;
  color: #1d4ed8 !important;
  display: grid !important;
  place-items: center !important;
  align-content: center !important;
  gap: 8px !important;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease !important;
}

.upload-box:hover {
  transform: translateY(-2px) !important;
  border-color: #2563eb !important;
  box-shadow: 0 18px 40px rgba(37, 99, 235, .14) !important;
}

.upload-box svg {
  width: 42px !important;
  height: 42px !important;
  padding: 9px !important;
  border-radius: 16px !important;
  background: rgba(255, 255, 255, .82) !important;
  box-shadow: 0 12px 24px rgba(37, 99, 235, .12) !important;
}

.preview-img {
  max-height: 230px !important;
  border-radius: 24px !important;
  border: 1px solid #dbeafe !important;
  box-shadow: 0 16px 34px rgba(15, 23, 42, .09) !important;
}

.save-btn {
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
  color: #ffffff !important;
  border: 1px solid rgba(37, 99, 235, .2) !important;
  box-shadow: 0 18px 38px rgba(37, 99, 235, .24) !important;
}

.save-btn:disabled,
.admin-refresh:disabled {
  opacity: .68 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

.icon-btn {
  width: 42px !important;
  height: 42px !important;
  border-radius: 15px !important;
  background: #eff6ff !important;
  color: #2563eb !important;
  border: 1px solid #dbeafe !important;
}

.admin-search {
  margin-bottom: 16px !important;
}

.admin-search svg {
  left: 16px !important;
  color: #2563eb !important;
}

.admin-search input {
  padding-left: 48px !important;
  min-height: 58px !important;
}

.product-table,
.orders-admin-list {
  gap: 14px !important;
}

.product-row,
.admin-order {
  position: relative !important;
  border-radius: 24px !important;
  border: 1px solid #e2e8f0 !important;
  background: rgba(248, 250, 252, .82) !important;
  box-shadow: 0 12px 28px rgba(15, 23, 42, .045) !important;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease !important;
}

.product-row:hover,
.admin-order:hover {
  transform: translateY(-2px) !important;
  border-color: #bfdbfe !important;
  background: #ffffff !important;
  box-shadow: 0 20px 44px rgba(15, 23, 42, .09) !important;
}

.product-row {
  grid-template-columns: 74px minmax(0, 1fr) minmax(90px, auto) auto !important;
  padding: 16px !important;
}

.product-photo {
  width: 74px !important;
  height: 74px !important;
  border-radius: 22px !important;
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
  box-shadow: 0 16px 30px rgba(37, 99, 235, .18) !important;
}

.product-row h3,
.admin-order h3 {
  color: #0f172a !important;
  font-weight: 950 !important;
  letter-spacing: -.02em !important;
}

.product-row p,
.product-row small,
.admin-order p,
.admin-order small {
  color: #64748b !important;
  font-weight: 800 !important;
}

.price-col strong {
  color: #059669 !important;
  font-size: 1.1rem !important;
}

.price-col del {
  color: #94a3b8 !important;
}

.row-actions button {
  width: 42px !important;
  height: 42px !important;
  border-radius: 15px !important;
  color: #2563eb !important;
  background: #eff6ff !important;
  border: 1px solid #dbeafe !important;
}

.row-actions button.danger {
  color: #dc2626 !important;
  background: #fef2f2 !important;
  border-color: #fecaca !important;
}

.admin-order {
  grid-template-columns: minmax(0, 1.25fr) minmax(220px, .95fr) 190px !important;
  padding: 18px !important;
}

.order-items-mini span {
  display: inline-flex !important;
  width: fit-content !important;
  border-radius: 999px !important;
  padding: 7px 11px !important;
  background: linear-gradient(135deg, #eff6ff, #ecfeff) !important;
  color: #1d4ed8 !important;
  border: 1px solid #dbeafe !important;
  font-weight: 900 !important;
}

.admin-notice {
  border-radius: 20px !important;
  border: 1px solid transparent !important;
  box-shadow: 0 14px 30px rgba(15, 23, 42, .06) !important;
}

.admin-notice.success {
  background: #dcfce7 !important;
  color: #166534 !important;
  border-color: #bbf7d0 !important;
}

.admin-notice.error {
  background: #fee2e2 !important;
  color: #991b1b !important;
  border-color: #fecaca !important;
}

.empty-admin {
  border-radius: 24px !important;
  border: 1px dashed #93c5fd !important;
  background: linear-gradient(135deg, #eff6ff, #ffffff) !important;
  color: #475569 !important;
  font-weight: 900 !important;
  padding: 34px !important;
}

.settings-card {
  max-width: 860px !important;
}

@media (max-width: 1100px) {
  .admin-grid {
    grid-template-columns: 1fr !important;
  }

  .admin-hero {
    flex-direction: column !important;
  }

  .admin-hero-actions {
    justify-content: flex-start !important;
  }
}

@media (max-width: 980px) {
  .admin-order {
    grid-template-columns: 1fr !important;
  }

  .admin-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 640px) {
  .pharm-admin {
    padding: 18px 12px 42px !important;
  }

  .admin-hero,
  .admin-card {
    border-radius: 24px !important;
    padding: 20px !important;
  }

  .admin-hero-actions,
  .admin-refresh,
  .admin-logout,
  .save-btn {
    width: 100% !important;
  }

  .admin-stats,
  .two,
  .product-row,
  .checks {
    grid-template-columns: 1fr !important;
  }

  .admin-tabs {
    position: static !important;
  }

  .admin-tabs button {
    width: 100% !important;
  }

  .product-row {
    align-items: start !important;
  }

  .price-col strong,
  .price-col del {
    text-align: left !important;
  }
}


/* ===== FINAL FIX: CLEAN SWITCHES + PRODUCT CARD VIEW ===== */
.product-form .checks {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 14px !important;
  align-items: stretch !important;
}

.product-form .checks label {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 14px !important;
  min-height: 66px !important;
  padding: 14px 18px !important;
  border-radius: 24px !important;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, .08), transparent 34%),
    rgba(255, 255, 255, .92) !important;
  border: 1px solid #bfdbfe !important;
  color: #334155 !important;
  box-shadow: 0 12px 28px rgba(15, 23, 42, .055) !important;
  font-weight: 950 !important;
  line-height: 1.1 !important;
}

.product-form .checks input[type="checkbox"] {
  appearance: none !important;
  -webkit-appearance: none !important;
  box-sizing: border-box !important;
  display: inline-block !important;
  position: relative !important;
  flex: 0 0 52px !important;
  width: 52px !important;
  min-width: 52px !important;
  max-width: 52px !important;
  height: 30px !important;
  min-height: 30px !important;
  max-height: 30px !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 999px !important;
  border: 1px solid #cbd5e1 !important;
  background: linear-gradient(135deg, #e2e8f0, #f8fafc) !important;
  box-shadow: inset 0 2px 6px rgba(15, 23, 42, .12) !important;
  cursor: pointer !important;
  overflow: hidden !important;
}

.product-form .checks input[type="checkbox"]::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  border-radius: inherit !important;
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
  opacity: 0 !important;
  transition: opacity .22s ease !important;
}

.product-form .checks input[type="checkbox"]::after {
  content: "" !important;
  position: absolute !important;
  top: 4px !important;
  left: 4px !important;
  width: 22px !important;
  height: 22px !important;
  border-radius: 999px !important;
  background: #ffffff !important;
  box-shadow: 0 4px 10px rgba(15, 23, 42, .22) !important;
  transform: translateX(0) !important;
  transition: transform .22s ease, box-shadow .22s ease !important;
}

.product-form .checks input[type="checkbox"]:checked {
  border-color: rgba(37, 99, 235, .9) !important;
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
}

.product-form .checks input[type="checkbox"]:checked::before {
  opacity: 1 !important;
}

.product-form .checks input[type="checkbox"]:checked::after {
  transform: translateX(22px) !important;
}

.product-form .checks label:has(input[type="checkbox"]:checked) {
  color: #1d4ed8 !important;
  border-color: #60a5fa !important;
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, .16), transparent 35%),
    linear-gradient(135deg, #dbeafe, #ecfeff) !important;
  box-shadow: 0 18px 42px rgba(37, 99, 235, .14) !important;
}

.product-table {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important;
  gap: 16px !important;
  align-items: stretch !important;
}

.product-row {
  display: grid !important;
  grid-template-columns: 1fr !important;
  align-content: start !important;
  gap: 12px !important;
  min-height: 100% !important;
  padding: 18px !important;
  border-radius: 28px !important;
  background:
    radial-gradient(circle at top right, rgba(20, 184, 166, .10), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, .96), rgba(248, 250, 252, .92)) !important;
  border: 1px solid #dbeafe !important;
  box-shadow: 0 18px 42px rgba(15, 23, 42, .075) !important;
}

.product-row:hover {
  transform: translateY(-4px) !important;
  border-color: #93c5fd !important;
  box-shadow: 0 26px 58px rgba(37, 99, 235, .13) !important;
}

.product-photo {
  width: 100% !important;
  height: 150px !important;
  border-radius: 24px !important;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, .42), transparent 26%),
    linear-gradient(135deg, #2563eb, #06b6d4 55%, #14b8a6) !important;
}

.product-photo img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.product-row > div:nth-child(2) {
  min-width: 0 !important;
}

.product-row h3 {
  margin: 2px 0 6px !important;
  font-size: 1.08rem !important;
  line-height: 1.18 !important;
  color: #0f172a !important;
}

.product-row p {
  margin: 0 0 8px !important;
  color: #64748b !important;
  font-weight: 850 !important;
}

.product-row small {
  display: inline-flex !important;
  width: fit-content !important;
  border-radius: 999px !important;
  padding: 7px 10px !important;
  background: #eff6ff !important;
  color: #1d4ed8 !important;
  border: 1px solid #dbeafe !important;
  font-weight: 950 !important;
}

.price-col {
  display: flex !important;
  align-items: baseline !important;
  justify-content: space-between !important;
  gap: 12px !important;
  padding: 12px 14px !important;
  border-radius: 18px !important;
  background: #ecfdf5 !important;
  border: 1px solid #bbf7d0 !important;
}

.price-col strong,
.price-col del {
  text-align: left !important;
}

.price-col strong {
  font-size: 1.25rem !important;
  color: #047857 !important;
}

.row-actions {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 10px !important;
}

.row-actions button {
  width: 100% !important;
  height: 46px !important;
  border-radius: 16px !important;
}

@media (max-width: 640px) {
  .product-form .checks {
    grid-template-columns: 1fr !important;
  }

  .product-table {
    grid-template-columns: 1fr !important;
  }
}

`;