import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { getApiErrorMessage } from "../services/api";

const defaultOttPlatforms = [
  {
    id: "netflix",
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    plans: [
      { id: "net-mobile", name: "Mobile", price: 149, duration: "1 Month" },
      { id: "net-basic", name: "Basic", price: 199, duration: "1 Month" },
      { id: "net-standard", name: "Standard", price: 499, duration: "1 Month" },
      { id: "net-premium", name: "Premium", price: 649, duration: "1 Month" },
      { id: "net-ultra", name: "Ultra HD", price: 799, duration: "1 Month" }
    ]
  },
  {
    id: "prime",
    name: "Amazon Prime Video",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
    plans: [
      { id: "prime-lite", name: "Lite", price: 149, duration: "1 Month" },
      { id: "prime-month", name: "Monthly", price: 299, duration: "1 Month" },
      { id: "prime-quarter", name: "Quarterly", price: 599, duration: "3 Months" },
      { id: "prime-half", name: "Half Yearly", price: 999, duration: "6 Months" },
      { id: "prime-year", name: "Yearly", price: 1499, duration: "12 Months" }
    ]
  },
  {
    id: "disney",
    name: "Disney+ Hotstar",
    logo: "/logos/disney-hotstar.svg",
    plans: [
      { id: "dis-mobile", name: "Mobile", price: 499, duration: "12 Months" },
      { id: "dis-super", name: "Super", price: 899, duration: "12 Months" },
      { id: "dis-premium", name: "Premium", price: 1499, duration: "12 Months" },
      { id: "dis-sports", name: "Sports Pack", price: 799, duration: "6 Months" },
      { id: "dis-family", name: "Family Max", price: 1999, duration: "12 Months" }
    ]
  },
  {
    id: "aha",
    name: "Aha",
    logo: "/logos/aha.svg",
    plans: [
      { id: "aha-month", name: "Gold Monthly", price: 149, duration: "1 Month" },
      { id: "aha-quarter", name: "Gold Quarterly", price: 399, duration: "3 Months" },
      { id: "aha-half", name: "Gold Half Yearly", price: 649, duration: "6 Months" },
      { id: "aha-year", name: "Gold Yearly", price: 999, duration: "12 Months" },
      { id: "aha-family", name: "Family Yearly", price: 1299, duration: "12 Months" }
    ]
  }
];

const platformNameToId = {
  netflix: "netflix",
  "amazon prime video": "prime",
  prime: "prime",
  "disney+ hotstar": "disney",
  disney: "disney",
  hotstar: "disney",
  aha: "aha"
};

const getTodayString = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const durationFromDays = (days) => {
  const number = Number(days);

  if (number === 30) {
    return "1 Month";
  }
  if (number === 90) {
    return "3 Months";
  }
  if (number === 180) {
    return "6 Months";
  }
  if (number === 365) {
    return "12 Months";
  }

  return `${number} Days`;
};

const durationToDays = (durationLabel) => {
  const value = (durationLabel || "").toLowerCase().trim();
  if (value.includes("12 month")) {
    return 365;
  }
  if (value.includes("6 month")) {
    return 180;
  }
  if (value.includes("3 month")) {
    return 90;
  }
  if (value.includes("1 month")) {
    return 30;
  }
  return 30;
};

const normalizeKey = (value) => (value || "").toString().trim().toLowerCase();

const buildPlanKey = ({ platform, name, price, duration }) =>
  `${normalizeKey(platform)}|${normalizeKey(name)}|${Number(price)}|${Number(duration)}`;

const formatApiDate = (value) => {
  if (!value) {
    return getTodayString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return getTodayString();
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const addDaysToDate = (fromDate, days) => {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + Number(days || 0));
  return date;
};

const getEndOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const getReminderMeta = (endDateValue) => {
  const endDate = getEndOfDay(endDateValue);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return null;
  }

  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  if (diffMs > threeDaysMs) {
    return null;
  }

  const hoursLeft = Math.ceil(diffMs / (1000 * 60 * 60));
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (hoursLeft <= 12) {
    return {
      priority: 1,
      message: "Plan ending in a few hours."
    };
  }

  if (hoursLeft <= 24) {
    return {
      priority: 2,
      message: "Plan ending within 24 hours."
    };
  }

  return {
    priority: 3,
    message: `Plan ending in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`
  };
};

function Plans() {
  const navigate = useNavigate();
  const storedUser = useMemo(
    () => JSON.parse(localStorage.getItem("bluedeskUser") || "{}"),
    []
  );

  const [activeMenu, setActiveMenu] = useState("plans");
  const [platforms, setPlatforms] = useState(defaultOttPlatforms);
  const [selectedPlatformId, setSelectedPlatformId] = useState(defaultOttPlatforms[0].id);
  const [searchText, setSearchText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(storedUser?.id || null);
  const [backendPlansRaw, setBackendPlansRaw] = useState([]);
  const [myPlans, setMyPlans] = useState([
    {
      id: 1,
      platform: "Netflix",
      planName: "Premium",
      price: 649,
      duration: "1 Month",
      date: "14 Apr 2026"
    },
    {
      id: 2,
      platform: "Amazon Prime Video",
      planName: "Yearly",
      price: 1499,
      duration: "12 Months",
      date: "10 Apr 2026"
    }
  ]);

  const plansTopRef = useRef(null);
  const myPlansRef = useRef(null);

  useEffect(() => {
    const resolveCurrentUserId = async () => {
      if (storedUser?.id) {
        setCurrentUserId(storedUser.id);
        return;
      }

      if (!storedUser?.email) {
        return;
      }

      try {
        const response = await API.get(
          `/users/by-email?email=${encodeURIComponent(storedUser.email)}`
        );

        if (response?.data?.id) {
          const resolvedId = response.data.id;
          setCurrentUserId(resolvedId);
          localStorage.setItem(
            "bluedeskUser",
            JSON.stringify({
              ...storedUser,
              id: resolvedId
            })
          );
        }
      } catch (error) {
        console.error("Unable to resolve backend user id:", error);
      }
    };

    resolveCurrentUserId();
  }, [storedUser]);

  useEffect(() => {
    const fetchBackendPlans = async () => {
      try {
        const response = await API.get("/plans");
        const backendPlans = Array.isArray(response.data) ? response.data : [];
        setBackendPlansRaw(backendPlans);

        if (backendPlans.length === 0) {
          return;
        }

        const grouped = backendPlans.reduce((acc, item) => {
          const key = platformNameToId[(item.platform || "").trim().toLowerCase()];

          if (!key) {
            return acc;
          }

          if (!acc[key]) {
            acc[key] = [];
          }

          acc[key].push({
            id: `${key}-${item.id}`,
            backendId: Number(item.id),
            name: item.name,
            price: Number(item.price),
            duration: durationFromDays(item.duration)
          });

          return acc;
        }, {});

        setPlatforms((current) =>
          current.map((platform) => ({
            ...platform,
            plans: grouped[platform.id]?.length ? grouped[platform.id] : platform.plans
          }))
        );
      } catch (error) {
        console.error("Backend plans fetch skipped:", error);
      }
    };

    fetchBackendPlans();
  }, []);

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      if (!currentUserId) {
        return;
      }

      try {
        const response = await API.get(`/subscriptions/user/${currentUserId}`);
        const subscriptions = Array.isArray(response.data) ? response.data : [];

        const mappedPlans = subscriptions.map((item) => ({
          id: item.id,
          platform: item?.plan?.platform || item?.plan?.name || "Plan",
          planName: item?.plan?.name || "Subscription",
          price: Number(item?.plan?.price || 0),
          duration: durationFromDays(item?.plan?.duration || 30),
          date: formatApiDate(item?.startDate),
          endDate: item?.endDate || addDaysToDate(new Date(), item?.plan?.duration || 30)
        }));

        if (mappedPlans.length > 0) {
          setMyPlans(mappedPlans);
        }
      } catch (error) {
        console.error("Unable to load user subscriptions:", error);
      }
    };

    fetchUserSubscriptions();
  }, [currentUserId]);

  const selectedPlatform = platforms.find((item) => item.id === selectedPlatformId);

  const filteredMyPlans = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return myPlans;
    }

    return myPlans.filter((item) =>
      `${item.platform} ${item.planName} ${item.duration}`.toLowerCase().includes(query)
    );
  }, [myPlans, searchText]);

  const reminderItems = useMemo(() => {
    const reminders = myPlans
      .map((plan) => {
        const reminderMeta = getReminderMeta(plan.endDate);
        if (!reminderMeta) {
          return null;
        }

        return {
          id: `rem-${plan.id}`,
          platform: plan.platform,
          planName: plan.planName,
          endDate: plan.endDate,
          ...reminderMeta
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.priority - b.priority);

    return reminders;
  }, [myPlans]);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    if (menu === "my-plans") {
      scrollToRef(myPlansRef);
      return;
    }

    scrollToRef(plansTopRef);
  };

  const ensureBackendPlanId = async (platformName, plan) => {
    if (plan?.backendId) {
      return plan.backendId;
    }

    const directMatch = backendPlansRaw.find((item) =>
      buildPlanKey({
        platform: item.platform,
        name: item.name,
        price: item.price,
        duration: item.duration
      }) ===
      buildPlanKey({
        platform: platformName,
        name: plan.name,
        price: plan.price,
        duration: durationToDays(plan.duration)
      })
    );

    if (directMatch?.id) {
      return Number(directMatch.id);
    }

    // Relaxed match in case platform column is empty for older rows.
    const relaxedMatch = backendPlansRaw.find(
      (item) =>
        normalizeKey(item.name) === normalizeKey(plan.name) &&
        Number(item.price) === Number(plan.price) &&
        Number(item.duration) === Number(durationToDays(plan.duration))
    );

    if (relaxedMatch?.id) {
      return Number(relaxedMatch.id);
    }

    try {
      const createPlanPayload = {
        platform: platformName,
        name: plan.name,
        price: Number(plan.price),
        duration: durationToDays(plan.duration)
      };
      const response = await API.post("/plans", createPlanPayload);
      return response?.data?.id;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Plan creation failed."));
    }
  };

  const addPlanToMyPlans = async (platformName, plan) => {
    if (currentUserId) {
      let backendPlanId;
      try {
        backendPlanId = await ensureBackendPlanId(platformName, plan);
      } catch (error) {
        alert(`Could not save this plan in backend: ${error.message}`);
        return;
      }

      if (!backendPlanId) {
        alert("Could not save this plan in backend. Please try again.");
        return;
      }

      try {
        await API.post(
          `/subscriptions/subscribe?userId=${currentUserId}&planId=${backendPlanId}`
        );
        await API.post(
          `/payments/pay?userId=${currentUserId}&amount=${Number(plan.price)}`
        );
      } catch (error) {
        alert(`Backend save failed: ${getApiErrorMessage(error, "Subscription/payment failed.")}`);
        return;
      }
    } else {
      alert("Backend user id not found. Please logout and login again.");
      return null;
    }

    const nextPlan = {
      id: Date.now(),
      platform: platformName,
      planName: plan.name,
      price: plan.price,
      duration: plan.duration,
      date: getTodayString(),
      endDate: addDaysToDate(new Date(), durationToDays(plan.duration))
    };

    setMyPlans((current) => [nextPlan, ...current]);
    setActiveMenu("my-plans");
    setTimeout(() => scrollToRef(myPlansRef), 20);
  };

  const handleLogout = () => {
    localStorage.removeItem("bluedeskUser");
    navigate("/login");
  };

  return (
    <div className="plans-page">
      <div className="ott-dashboard">
        <aside className="ott-sidebar">
          <div className="ott-brand-block">
            <div className="ott-brand-logo">OTT</div>
            <div>
              <p className="ott-brand-subtitle">Dashboard</p>
              <h2>Subscription Hub</h2>
            </div>
          </div>

          <div className="ott-sidebar-actions">
            <button
              className={`ott-nav-btn ${activeMenu === "plans" ? "is-active" : ""}`}
              onClick={() => handleMenuClick("plans")}
            >
              Plans
            </button>
            <button
              className={`ott-nav-btn ${activeMenu === "my-plans" ? "is-active" : ""}`}
              onClick={() => handleMenuClick("my-plans")}
            >
              My Plans
            </button>
            <button className="ott-nav-btn" onClick={handleLogout}>Logout</button>
          </div>
        </aside>

        <main className="ott-main">
          <header className="ott-main-header" ref={plansTopRef}>
            <div>
              <p className="login-eyebrow">PLAN BOX</p>
              <h1>All my plans overview</h1>
              <p>See all selected OTT plans, platform options, and prices in one place.</p>
            </div>

            <div className="ott-user-card">
              <div className="ott-user-avatar">
                {(storedUser?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{storedUser?.name || "User"}</strong>
                <span>{storedUser?.email || "user@email.com"}</span>
              </div>
            </div>
          </header>

          <section className="ott-panel">
            <div className="ott-panel-top">
              <div>
                <p className="login-eyebrow">PLATFORMS</p>
                <h2>Choose an OTT platform</h2>
              </div>
            </div>

            <div className="ott-platform-grid">
              {platforms.map((platform) => (
                <article key={platform.id} className="ott-platform-card">
                  <div className="ott-platform-logo-wrap">
                    <img src={platform.logo} alt={`${platform.name} logo`} className="ott-platform-logo" />
                  </div>
                  <button
                    className="plan-card__button"
                    onClick={() => {
                      setSelectedPlatformId(platform.id);
                      handleMenuClick("plans");
                    }}
                  >
                    Plans
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="ott-panel">
            <div className="ott-panel-top">
              <div>
                <p className="login-eyebrow">AVAILABLE PLANS</p>
                <h2>{selectedPlatform?.name} subscription plans</h2>
              </div>
            </div>

            <div className="ott-plan-list">
              {selectedPlatform?.plans.map((plan) => (
                <div key={plan.id} className="ott-plan-row">
                  <div>
                    <strong>{plan.name}</strong>
                    <p>{plan.duration}</p>
                  </div>
                  <div className="ott-plan-price">
                    <span>Rs {plan.price}</span>
                    <button
                      className="ott-table-action"
                      onClick={() => addPlanToMyPlans(selectedPlatform.name, plan)}
                    >
                      Add to My Plans
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ott-panel">
            <div className="ott-panel-top">
              <div>
                <p className="login-eyebrow">REMINDERS</p>
                <h2>Ending soon notifications</h2>
              </div>
            </div>

            <div className="ott-reminder-list">
              {reminderItems.length === 0 ? (
                <div className="ott-reminder-empty">
                  No plans ending in the next 3 days.
                </div>
              ) : (
                reminderItems.map((item) => (
                  <div key={item.id} className="ott-reminder-item">
                    <div>
                      <strong>{item.platform} - {item.planName}</strong>
                      <p>{item.message}</p>
                    </div>
                    <span>Ends on {formatApiDate(item.endDate)}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="ott-panel" ref={myPlansRef}>
            <div className="ott-panel-top">
              <div>
                <p className="login-eyebrow">MY PLANS</p>
                <h2>All my plans</h2>
              </div>
            </div>

            <div className="ott-search-row">
              <input
                type="text"
                placeholder="Search by platform, plan, or duration"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="ott-table-action">Search</button>
            </div>

            <div className="ott-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Platform</th>
                    <th>Plan</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMyPlans.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="ott-empty-cell">
                        No plans found.
                      </td>
                    </tr>
                  ) : (
                    filteredMyPlans.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.platform}</td>
                        <td>{item.planName}</td>
                        <td>Rs {item.price}</td>
                        <td>{item.duration}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="plans-hero__actions">
            <Link to="/" className="plans-ghost-btn">Edit Profile</Link>
            <Link to="/login" className="plans-primary-link">Switch User</Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Plans;
