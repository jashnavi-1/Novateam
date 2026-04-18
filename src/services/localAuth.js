const USERS_KEY = "bluedeskUsers";

const getStoredUsers = () => {
  const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  return Array.isArray(parsed) ? parsed : [];
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerLocalUser = (user) => {
  const users = getStoredUsers();
  const normalizedEmail = (user.email || "").trim().toLowerCase();

  const exists = users.some(
    (item) => (item.email || "").trim().toLowerCase() === normalizedEmail
  );

  if (exists) {
    throw new Error("This email is already registered. Please log in instead.");
  }

  const nextUser = {
    name: user.name,
    email: user.email,
    password: user.password
  };

  users.push(nextUser);
  saveStoredUsers(users);

  return nextUser;
};

export const loginLocalUser = ({ email, password }) => {
  const users = getStoredUsers();
  const normalizedEmail = (email || "").trim().toLowerCase();

  return users.find(
    (item) =>
      (item.email || "").trim().toLowerCase() === normalizedEmail &&
      item.password === password
  );
};
