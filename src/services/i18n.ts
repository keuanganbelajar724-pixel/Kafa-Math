export type Language = 'id' | 'en';

export const translations = {
  id: {
    brandName: 'KAFA MATH',
    tagline: 'Math Made Fun.',
    subTagline: 'Berlatih Matematika Jadi Lebih Seru',
    readyForMath: 'Siap latihan matematika hari ini?',
    greeting: (name: string) => `Halo, ${name}! 👋`,
    motto: 'Buku latihan matematika digital & game edukasi ramah anak.',
    
    // Navigation
    navHome: 'Home',
    navPractice: 'Latihan',
    navGames: 'Game',
    navProgress: 'Progress',
    navProfile: 'Profil',
    
    // Hero & Stats
    dailyMission: 'Misi Hari Ini',
    dailyMissionDesc: '10 soal untuk menjaga streak kamu.',
    continueBtn: 'LANJUTKAN',
    continueArrow: 'LANJUTKAN →',
    startFirstPractice: 'Mulai latihan pertamamu.',
    continueLearningTitle: 'Lanjutkan Belajar',
    
    // Quick Stats
    xp: 'XP',
    streak: 'Hari Streak',
    level: 'Level',
    accuracy: 'Akurasi',
    
    // Recommendations
    recommendedForYou: 'Rekomendasi Untukmu',
    mathSkills: 'Materi Matematika',
    allSkills: 'Semua Materi',
    recommended: 'Rekomendasi',
    
    // Practice Screen
    practiceHeader: 'Pilih materi yang ingin kamu latih.',
    practiceSubtitle: 'Pilih topik matematika dan mulai latihan interaktif atau buku latihan digital.',
    filterAll: 'Semua',
    filterGrade: (g: number) => g === 0 ? 'PAUD/TK' : `Kelas ${g}`,
    
    // Interactive Practice
    question: 'Soal',
    checkAnswer: 'Periksa Jawaban',
    correct: 'Benar!',
    incorrect: 'Belum tepat.',
    hintTryAgain: 'Coba periksa lagi angka satuannya.',
    tryAgainBtn: 'COBA LAGI',
    nextQuestion: 'SOAL BERIKUTNYA →',
    finishPractice: 'SELESAI LATIHAN',
    
    // Results
    practiceCompleted: 'Latihan Selesai!',
    greatWork: 'Hebat sekali!',
    strongSkills: 'MATERI YANG SUDAH KUAT',
    needsPractice: 'PERLU LATIHAN',
    practiceAgain: 'LATIHAN LAGI',
    reviewMistakes: 'REVIEW KESALAHAN',
    backToHome: 'KEMBALI KE HOME',
    
    // Progress
    myProgress: 'Progress Saya',
    progressSubtitle: 'Kamu semakin jago setiap hari!',
    skillMastery: 'Penguasaan Materi',
    weeklyActivity: 'Aktivitas Mingguan',
    xpToNextLevel: (xp: number, nextLvl: number) => `${xp} XP lagi menuju Level ${nextLvl}`,
    keepItGoing: 'Pertahankan prestasimu!',
    achievements: 'Lencana Prestasi',
    
    // Games
    mathGames: 'Game Matematika',
    gamesSubtitle: 'Bermain sambil mengasah logika dan kecepatan berhitung.',
    playGame: 'MAIN',
    
    // Difficulties
    easy: 'Mudah',
    medium: 'Sedang',
    challenge: 'Tantangan',
    
    // Parent
    parentDashboard: 'Area Orang Tua & Guru',
    switchProfile: 'Ganti Profil',
    avatarShop: 'Toko Avatar',
  },
  en: {
    brandName: 'KAFA MATH',
    tagline: 'Math Made Fun.',
    subTagline: 'Practicing Math Made Truly Fun',
    readyForMath: "Ready for today's math?",
    greeting: (name: string) => `Good morning, ${name}! 👋`,
    motto: 'Digital math workbook & child-friendly educational games.',
    
    // Navigation
    navHome: 'Home',
    navPractice: 'Practice',
    navGames: 'Games',
    navProgress: 'Progress',
    navProfile: 'Profile',
    
    // Hero & Stats
    dailyMission: 'Daily Mission',
    dailyMissionDesc: '10 questions to keep your streak going.',
    continueBtn: 'CONTINUE',
    continueArrow: 'CONTINUE →',
    startFirstPractice: 'Start your first practice session.',
    continueLearningTitle: 'Continue Learning',
    
    // Quick Stats
    xp: 'XP',
    streak: 'Days Streak',
    level: 'Level',
    accuracy: 'Accuracy',
    
    // Recommendations
    recommendedForYou: 'Recommended for You',
    mathSkills: 'Math Skills',
    allSkills: 'All Skills',
    recommended: 'Recommended',
    
    // Practice Screen
    practiceHeader: 'Choose a skill to practice.',
    practiceSubtitle: 'Select a math topic and start an interactive session or digital workbook.',
    filterAll: 'All',
    filterGrade: (g: number) => g === 0 ? 'Kindergarten' : `Grade ${g}`,
    
    // Interactive Practice
    question: 'Question',
    checkAnswer: 'Check Answer',
    correct: 'Great job!',
    incorrect: 'Not quite yet.',
    hintTryAgain: 'Check your calculation again carefully.',
    tryAgainBtn: 'TRY AGAIN',
    nextQuestion: 'NEXT QUESTION →',
    finishPractice: 'COMPLETE PRACTICE',
    
    // Results
    practiceCompleted: 'Practice Completed!',
    greatWork: 'Great work!',
    strongSkills: 'STRONG SKILLS',
    needsPractice: 'NEEDS PRACTICE',
    practiceAgain: 'PRACTICE AGAIN',
    reviewMistakes: 'REVIEW MISTAKES',
    backToHome: 'BACK TO HOME',
    
    // Progress
    myProgress: 'My Progress',
    progressSubtitle: "You're getting better every day!",
    skillMastery: 'Skill Mastery',
    weeklyActivity: 'Weekly Activity',
    xpToNextLevel: (xp: number, nextLvl: number) => `${xp} XP to Level ${nextLvl}`,
    keepItGoing: 'Keep it going!',
    achievements: 'Collectible Badges',
    
    // Games
    mathGames: 'Math Games',
    gamesSubtitle: 'Play while sharpening logic and mental calculation speed.',
    playGame: 'PLAY',
    
    // Difficulties
    easy: 'Easy',
    medium: 'Medium',
    challenge: 'Challenge',
    
    // Parent
    parentDashboard: 'Parent & Educator Dashboard',
    switchProfile: 'Switch Profile',
    avatarShop: 'Avatar Shop',
  },
};

const LANG_KEY = 'kafa_math_language_pref';

export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'id') return saved;
  } catch (e) {}
  return 'id';
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {}
}
