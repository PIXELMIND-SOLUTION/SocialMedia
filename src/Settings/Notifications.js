import React from "react";

const Notifications = ({ notificationPrefs, handleNotificationChange }) => {
  const preferencesList = [
    { key: "posts", label: "Notify me about new posts" },
    { key: "follows", label: "Notify me when someone follows me" },
    { key: "likes", label: "Notify me when someone likes my post" },
    { key: "comments", label: "Notify me when someone comments on my post" },
    { key: "mentions", label: "Notify me when someone mentions me" },
    { key: "followRequests", label: "Notify me for new follow requests" },
    { key: "followApprovals", label: "Notify me for follow request approvals" },
  ];

  return (
    <div>
      <h4 className="mb-3">🔔 Notification Preferences</h4>
      <p className="text-muted">
        Choose which notifications you’d like to receive.
      </p>

      <div className="card p-3 shadow-sm">
        {preferencesList.map((pref) => (
          <label
            key={pref.key}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={notificationPrefs[pref.key]}
              onChange={() => handleNotificationChange(pref.key)}
              style={{ marginRight: "10px" }}
            />
            {pref.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
