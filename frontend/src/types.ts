// 型定義
export interface Course {
  id: string;
  title: string;
  credits: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  period: number; // 1〜5限
  isMandatory: boolean;
  syllabusText: string;
}

export interface User {
  targetCareer: string;
  enrolledCourses: string[]; // 履修中科目のIDリスト
}

// プロトタイプ用のダミー講義データ（シラバス）
export const DUMMY_COURSES: Course[] = [
  { id: '1', title: 'プログラミング基礎', credits: 2, day: 'Mon', period: 1, isMandatory: true, syllabusText: 'Pythonを用いたプログラミングの基礎とアルゴリズム。Webエンジニアの土台。' },
  { id: '2', title: 'データベースシステム', credits: 2, day: 'Tue', period: 3, isMandatory: false, syllabusText: 'SQLや関係データベースの設計。バックエンド開発、データサイエンスに必須。' },
  { id: '3', title: '統計学基礎', credits: 2, day: 'Wed', period: 2, isMandatory: false, syllabusText: 'データの要約、確率分布、推計。データサイエンティストやAI開発の基盤。' },
  { id: '4', title: 'インタラクションデザイン', credits: 2, day: 'Thu', period: 4, isMandatory: false, syllabusText: 'UI/UXデザイン、ユーザー心理、フロントエンドの画面設計論。' },
  { id: '5', title: '電子情報回路', credits: 4, day: 'Fri', period: 1, isMandatory: true, syllabusText: 'ハードウェアの基礎となる回路設計。卒業必須科目。' },
];