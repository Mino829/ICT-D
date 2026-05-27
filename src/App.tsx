import React, { useState } from 'react';
import { DUMMY_COURSES, type Course } from './types';
import { BookOpen, CheckCircle, Search, Trash2 } from 'lucide-react';
import { Analytics } from "@vercel/analytics"

export default function App() {
  // 状態管理（State）
  const [careerInput, setCareerInput] = useState('');
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const periods = [1, 2, 3, 4, 5];

  // 【疑似AI機能】入力された職種キーワードでシラバスを簡易検索
  const handleAIRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerInput.trim()) return;

    // 本来はバックエンド＋LLMで行う部分を、簡易的な文字列マッチで再現
    const keyword = careerInput.toLowerCase();
    const matches = DUMMY_COURSES.filter(course => 
      course.syllabusText.toLowerCase().includes(keyword) || 
      course.title.toLowerCase().includes(keyword)
    );
    setRecommendedCourses(matches);
  };

  // 講義を時間割に追加（重複チェック付き）
  const addCourse = (course: Course) => {
    // すでに追加済みならスキップ
    if (selectedCourseIds.includes(course.id)) return;

    // 曜日・時限の重複チェック（ロジック処理）
    const hasOverlap = DUMMY_COURSES.filter(c => selectedCourseIds.includes(c.id))
      .some(c => c.day === course.day && c.period === course.period);

    if (hasOverlap) {
      alert(`【エラー】${course.day}曜${course.period}限にはすでに他の講義が入っています！`);
      return;
    }

    setSelectedCourseIds([...selectedCourseIds, course.id]);
  };

  // 講義を時間割から削除
  const removeCourse = (id: string) => {
    setSelectedCourseIds(selectedCourseIds.filter(courseId => courseId !== id));
  };

  // 現在の時間割マッピングを取得
  const getCourseAt = (day: string, period: number) => {
    return DUMMY_COURSES.find(c => selectedCourseIds.includes(c.id) && c.day === day && c.period === period);
  };

  // 卒業要件の計算ロジック
  const currentCourses = DUMMY_COURSES.filter(c => selectedCourseIds.includes(c.id));
  const totalCredits = currentCourses.reduce((sum, c) => sum + c.credits, 0);
  const mandatoryCount = currentCourses.filter(c => c.isMandatory).length;
  const totalMandatoryNeeded = DUMMY_COURSES.filter(c => c.isMandatory).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* ヘッダー */}
      <header className="mb-8 border-b pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <BookOpen /> 履修登録サポートAI
        </h1>
        <div className="text-sm text-gray-500">プロトタイプ v1.0 (Local Mock)</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム：キャリア入力 & AI提案 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">① 将来の目標を入力してください</h2>
          <form onSubmit={handleAIRecommend} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="例: データサイエンス, Webエンジニア"
              value={careerInput}
              onChange={(e) => setCareerInput(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-1">
              <Search size={16} /> 相談
            </button>
          </form>

          <h3 className="text-sm font-bold text-gray-500 mb-3">AIおすすめの講義</h3>
          <div className="space-y-3">
            {recommendedCourses.length === 0 ? (
              <p className="text-xs text-gray-400 italic">目標を入力すると、関連シラバスがここに推薦されます。</p>
            ) : (
              recommendedCourses.map(course => (
                <div key={course.id} className="p-3 border rounded-lg bg-indigo-50/50 hover:bg-indigo-50 transition">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{course.title}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                      {course.credits}単位 ({course.day}{course.period})
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{course.syllabusText}</p>
                  <button
                    onClick={() => addCourse(course)}
                    disabled={selectedCourseIds.includes(course.id)}
                    className="w-full bg-white border border-indigo-600 text-indigo-600 py-1 rounded text-xs font-medium hover:bg-indigo-600 hover:text-white transition disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-indigo-600"
                  >
                    {selectedCourseIds.includes(course.id) ? '追加済み' : '時間割に追加'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 中央カラム：時間割（Timetable） */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">② 現在の時間割</h2>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse border border-gray-200 text-sm text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 w-16">限</th>
                  {days.map(day => <th key={day} className="border p-2 min-w-[120px]">{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period} className="h-20">
                    <td className="border font-medium bg-gray-50">{period}限</td>
                    {days.map(day => {
                      const course = getCourseAt(day, period);
                      return (
                        <td key={day} className={`border p-2 relative transition ${course ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                          {course ? (
                            <div className="flex flex-col justify-between h-full text-left">
                              <div>
                                <div className="font-bold text-xs text-emerald-800 leading-tight">{course.title}</div>
                                <span className={`text-[10px] px-1 rounded ${course.isMandatory ? 'bg-red-100 text-red-700' : 'bg-gray-200'}`}>
                                  {course.isMandatory ? '必修' : '選択'}
                                </span>
                              </div>
                              <button 
                                onClick={() => removeCourse(course.id)}
                                className="absolute bottom-1 right-1 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 右下/下部：卒業要件進捗メーター（同期して動く） */}
          <div className="mt-6 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>登録単位数 (目標: 8単位 ※デモ用)</span>
                <span>{totalCredits} / 8 単位</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((totalCredits / 8) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>必須科目の網羅</span>
                <span>{mandatoryCount} / {totalMandatoryNeeded} 科目</span>
              </div>
              <div className="flex gap-1 items-center">
                {DUMMY_COURSES.filter(c => c.isMandatory).map(course => {
                  const iscleared = selectedCourseIds.includes(course.id);
                  return (
                    <span 
                      key={course.id} 
                      className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5 ${iscleared ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {iscleared && <CheckCircle size={10} />}
                      {course.title.slice(0, 5)}...
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}