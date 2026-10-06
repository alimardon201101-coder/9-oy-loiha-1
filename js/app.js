// NextStep Markaziy Boshqaruv Skripti (js/app.js)

const STORAGE_KEY = 'nextstep_user_data';

// Barcha 5 ta til bo'yicha darslarning umumiy soni
const COURSE_TOTALS = {
  english: 180,
  korean: 126,
  russian: 100,
  turkish: 100,
  german: 100
};

// Boshlang'ich standart foydalanuvchi ma'lumotlari
const defaultUserData = {
  isLoggedIn: true,
  name: "Alimardon Mirzaboyev",
  email: "alimardon201101@gmail.com",
  targetLang: "kr",
  goal: "KAIST universitetiga kirish",
  streak: 7,
  watchedLessons: {
    english: [],
    korean: [],
    russian: [],
    turkish: [],
    german: []
  }
};

// LocalStorage'dan foydalanuvchi ma'lumotlarini olish
function getUserData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUserData));
    return JSON.parse(JSON.stringify(defaultUserData));
  }
  const parsed = JSON.parse(data);
  
  // Agarda eski saqlangan ma'lumotda biror til bo'lmasa, uni tiklash
  if (!parsed.watchedLessons) parsed.watchedLessons = {};
  ['english', 'korean', 'russian', 'turkish', 'german'].forEach(lang => {
    if (!parsed.watchedLessons[lang]) parsed.watchedLessons[lang] = [];
  });

  return parsed;
}

// LocalStorage'ga saqlash
function saveUserData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Tizimdan chiqish (Logout)
function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = './login.html';
}

// Tizimga kirish / Ro'yxatdan o'tish (Login)
function loginUser(name, email, targetLang) {
  const user = getUserData();
  user.isLoggedIn = true;
  if (name) user.name = name;
  if (email) user.email = email;
  if (targetLang) user.targetLang = targetLang;
  saveUserData(user);
  window.location.href = './profil.html';
}

// Dars ko'rilganlik holatini o'zgartirish (Toggle)
function toggleLessonWatched(courseType, lessonIndex) {
  const user = getUserData();
  if (!user.watchedLessons[courseType]) {
    user.watchedLessons[courseType] = [];
  }
  
  const list = user.watchedLessons[courseType];
  const idx = list.indexOf(lessonIndex);
  
  if (idx === -1) {
    list.push(lessonIndex);
  } else {
    list.splice(idx, 1);
  }
  
  saveUserData(user);
  return idx === -1; // true = ko'rildi, false = ko'rilmadi
}

// Dars ko'rilganmi-yo'qmi tekshirish
function isLessonWatched(courseType, lessonIndex) {
  const user = getUserData();
  return user.watchedLessons && 
         user.watchedLessons[courseType] && 
         user.watchedLessons[courseType].includes(lessonIndex);
}

// Navbar holatini avtomat yangilash
function renderNavbar() {
  const user = getUserData();
  const authButtons = document.getElementById('auth-buttons');
  const profileLink = document.getElementById('nav-profile-link');
  const userNameNav = document.getElementById('nav-user-name');

  if (userNameNav && user.name) {
    userNameNav.textContent = user.name.split(' ')[0];
  }

  if (user.isLoggedIn) {
    if (authButtons) authButtons.classList.add('hidden');
    if (profileLink) {
      profileLink.classList.remove('hidden');
      profileLink.classList.add('flex');
    }
  } else {
    if (authButtons) authButtons.classList.remove('hidden');
    if (profileLink) {
      profileLink.classList.add('hidden');
      profileLink.classList.remove('flex');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});