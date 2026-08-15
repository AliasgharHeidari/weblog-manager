import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    blogName: 'BlogHub',
    home: 'Home',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    welcome: 'Welcome to BlogHub',
    discover: 'Discover amazing stories and insights',
    allPosts: 'All Posts',
    noPosts: 'No posts found',
    back: 'Back to posts',
    author: 'Author',
    views: 'views',
    createPost: 'Create Post',
    editPost: 'Edit Post',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Confirm',
    cancelDelete: 'Cancel',
    title: 'Title',
    content: 'Content',
    section: 'Section',
    image: 'Featured Image',
    published: 'Published',
    draft: 'Draft',
    search: 'Search',
    language: 'Language',
    profile: 'Profile',
    uploadAvatar: 'Upload Avatar',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    welcomeBack: 'Welcome Back',
    signIn: 'Sign In',
    noAccount: "Don't have an account?",
    registerHere: 'Register here',
    createAccount: 'Create Account',
    joinCommunity: 'Join our community',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'Sign in here',
    postNotFound: 'Post not found',
    loading: 'Loading...',
    createFirstPost: 'Create your first post',
    noPostsYet: 'No posts yet',
    // پروفایل
    profileTitle: 'Profile',
    selectImage: 'Select an image',
    uploadFailed: 'Upload failed',
    // خطاها
    invalidCredentials: 'Invalid credentials',
    registrationFailed: 'Registration failed',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    creating: 'Creating...',
    saving: 'Saving...',
    signingIn: 'Signing in...',
    registering: 'Creating account...',
  },
  fa: {
    blogName: 'بلاگ‌هاب',
    home: 'خانه',
    login: 'ورود',
    register: 'ثبت‌نام',
    dashboard: 'داشبورد',
    logout: 'خروج',
    welcome: 'به بلاگ‌هاب خوش آمدید',
    discover: 'داستان‌ها و دانش را کشف کنید',
    allPosts: 'همه پست‌ها',
    noPosts: 'پستی یافت نشد',
    back: 'بازگشت به پست‌ها',
    author: 'نویسنده',
    views: 'بازدید',
    createPost: 'ایجاد پست',
    editPost: 'ویرایش پست',
    save: 'ذخیره تغییرات',
    cancel: 'انصراف',
    delete: 'حذف',
    confirmDelete: 'تأیید',
    cancelDelete: 'انصراف',
    title: 'عنوان',
    content: 'محتوا',
    section: 'دسته‌بندی',
    image: 'تصویر شاخص',
    published: 'منتشر شده',
    draft: 'پیش‌نویس',
    search: 'جستجو',
    language: 'زبان',
    profile: 'پروفایل',
    uploadAvatar: 'آپلود تصویر پروفایل',
    username: 'نام کاربری',
    email: 'ایمیل',
    password: 'رمز عبور',
    confirmPassword: 'تکرار رمز عبور',
    welcomeBack: 'خوش آمدید',
    signIn: 'ورود',
    noAccount: 'حساب ندارید؟',
    registerHere: 'ثبت‌نام کنید',
    createAccount: 'ایجاد حساب کاربری',
    joinCommunity: 'به جامعه ما بپیوندید',
    alreadyHaveAccount: 'قبلاً حساب دارید؟',
    signInHere: 'وارد شوید',
    postNotFound: 'پست یافت نشد',
    loading: 'در حال بارگذاری...',
    createFirstPost: 'اولین پست را بسازید',
    noPostsYet: 'هنوز پستی وجود ندارد',
    profileTitle: 'پروفایل',
    selectImage: 'یک تصویر انتخاب کنید',
    uploadFailed: 'آپلود ناموفق بود',
    invalidCredentials: 'اطلاعات ورود نامعتبر است',
    registrationFailed: 'ثبت‌نام ناموفق بود',
    passwordMismatch: 'رمز عبور و تکرار آن یکسان نیستند',
    passwordTooShort: 'رمز عبور باید حداقل ۶ کاراکتر باشد',
    creating: 'در حال ایجاد...',
    saving: 'در حال ذخیره...',
    signingIn: 'در حال ورود...',
    registering: 'در حال ایجاد حساب...',
  }
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fa' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key) => translations[language]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
