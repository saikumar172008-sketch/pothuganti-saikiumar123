import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Heart, TrendingUp, Calendar, BookOpen, Smile, Frown, Meh, Sun, Moon, Activity, Target, Award, Bell } from 'lucide-react';

const WellnessApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [moodData, setMoodData] = useState([
    { date: '2024-09-07', mood: 7, energy: 6, stress: 4, sleep: 8, notes: 'Great day at work!' },
    { date: '2024-09-08', mood: 5, energy: 4, stress: 7, sleep: 6, notes: 'Feeling a bit overwhelmed' },
    { date: '2024-09-09', mood: 8, energy: 7, stress: 3, sleep: 7, notes: 'Relaxing weekend' },
    { date: '2024-09-10', mood: 6, energy: 6, stress: 5, sleep: 7, notes: 'Regular Monday' },
    { date: '2024-09-11', mood: 9, energy: 8, stress: 2, sleep: 8, notes: 'Amazing day with friends!' },
    { date: '2024-09-12', mood: 7, energy: 7, stress: 4, sleep: 7, notes: 'Productive and balanced' },
  ]);
  
  const [todayMood, setTodayMood] = useState({
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    notes: ''
  });

  const [goals, setGoals] = useState([
    { id: 1, title: 'Meditate daily', target: 7, completed: 5, streak: 3 },
    { id: 2, title: 'Exercise 3x/week', target: 3, completed: 2, streak: 1 },
    { id: 3, title: 'Sleep 8 hours', target: 7, completed: 4, streak: 2 },
  ]);

  // Sentiment Analysis Function
  const analyzeSentiment = (text) => {
    const positiveWords = ['great', 'amazing', 'wonderful', 'happy', 'excited', 'good', 'fantastic', 'awesome', 'perfect', 'love', 'joy', 'peaceful', 'relaxing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'depressed', 'angry', 'frustrated', 'overwhelmed', 'stressed', 'anxious', 'worried', 'difficult'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Generate Personalized Recommendations
  const getRecommendations = () => {
    const recentData = moodData.slice(-7);
    const avgMood = recentData.reduce((sum, day) => sum + day.mood, 0) / recentData.length;
    const avgStress = recentData.reduce((sum, day) => sum + day.stress, 0) / recentData.length;
    const avgSleep = recentData.reduce((sum, day) => sum + day.sleep, 0) / recentData.length;
    const avgEnergy = recentData.reduce((sum, day) => sum + day.energy, 0) / recentData.length;

    const recommendations = [];

    if (avgMood < 6) {
      recommendations.push({
        category: 'Mood',
        title: 'Practice Gratitude',
        description: 'Try writing down 3 things you\'re grateful for each morning',
        icon: Heart,
        color: 'text-pink-600'
      });
    }

    if (avgStress > 6) {
      recommendations.push({
        category: 'Stress',
        title: 'Deep Breathing Exercise',
        description: '4-7-8 breathing technique: Inhale 4, hold 7, exhale 8',
        icon: Sun,
        color: 'text-orange-600'
      });
    }

    if (avgSleep < 6) {
      recommendations.push({
        category: 'Sleep',
        title: 'Improve Sleep Hygiene',
        description: 'Create a bedtime routine and avoid screens 1 hour before bed',
        icon: Moon,
        color: 'text-indigo-600'
      });
    }

    if (avgEnergy < 5) {
      recommendations.push({
        category: 'Energy',
        title: 'Morning Movement',
        description: 'Start your day with 10 minutes of light exercise or stretching',
        icon: Activity,
        color: 'text-green-600'
      });
    }

    // Always include some general wellness tips
    recommendations.push({
      category: 'Mindfulness',
      title: '5-Minute Meditation',
      description: 'Take a short mindfulness break to center yourself',
      icon: Target,
      color: 'text-purple-600'
    });

    return recommendations.slice(0, 4);
  };

  const handleMoodSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const sentiment = analyzeSentiment(todayMood.notes);
    
    const newEntry = {
      ...todayMood,
      date: today,
      sentiment
    };

    setMoodData(prev => {
      const filtered = prev.filter(entry => entry.date !== today);
      return [...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    });

    setCurrentView('dashboard');
    
    // Reset form
    setTodayMood({
      mood: 5,
      energy: 5,
      stress: 5,
      sleep: 5,
      notes: ''
    });
  };

  const getMoodIcon = (mood) => {
    if (mood >= 8) return <Smile className="w-8 h-8 text-green-500" />;
    if (mood >= 6) return <Meh className="w-8 h-8 text-yellow-500" />;
    return <Frown className="w-8 h-8 text-red-500" />;
  };

  const NavButton = ({ view, icon: Icon, label, active }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all ${
        active 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Good morning! 👋</h1>
        <p className="text-blue-100">How are you feeling today?</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getMoodIcon(moodData[moodData.length - 1]?.mood || 5)}
            <span className="text-sm">Last mood: {moodData[moodData.length - 1]?.mood || 5}/10</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Mood</p>
              <p className="text-xl font-bold">{(moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length).toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Energy</p>
              <p className="text-xl font-bold">{(moodData.reduce((sum, d) => sum + d.energy, 0) / moodData.length).toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stress</p>
              <p className="text-xl font-bold">{(moodData.reduce((sum, d) => sum + d.stress, 0) / moodData.length).toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Moon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sleep</p>
              <p className="text-xl font-bold">{(moodData.reduce((sum, d) => sum + d.sleep, 0) / moodData.length).toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Area type="monotone" dataKey="mood" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
        <div className="space-y-4">
          {getRecommendations().map((rec, index) => {
            const IconComponent = rec.icon;
            return (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className={`p-2 bg-white rounded-lg ${rec.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <span className="text-xs text-gray-500 mt-2 inline-block">{rec.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMoodCheckIn = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Check-in</h2>
        <p className="text-gray-600">How are you feeling today?</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border space-y-6">
        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mood (1-10) - Current: {todayMood.mood}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={todayMood.mood}
            onChange={(e) => setTodayMood({...todayMood, mood: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Very Low</span>
            <span>Neutral</span>
            <span>Very High</span>
          </div>
        </div>

        {/* Energy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Energy Level (1-10) - Current: {todayMood.energy}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={todayMood.energy}
            onChange={(e) => setTodayMood({...todayMood, energy: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Stress */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Stress Level (1-10) - Current: {todayMood.stress}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={todayMood.stress}
            onChange={(e) => setTodayMood({...todayMood, stress: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sleep Quality (1-10) - Current: {todayMood.sleep}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={todayMood.sleep}
            onChange={(e) => setTodayMood({...todayMood, sleep: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Notes (optional)
          </label>
          <textarea
            value={todayMood.notes}
            onChange={(e) => setTodayMood({...todayMood, notes: e.target.value})}
            placeholder="How was your day? Any thoughts or reflections..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
          />
          {todayMood.notes && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Sentiment: </span>
              <span className={`font-medium ${
                analyzeSentiment(todayMood.notes) === 'positive' ? 'text-green-600' :
                analyzeSentiment(todayMood.notes) === 'negative' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {analyzeSentiment(todayMood.notes)}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleMoodSubmit}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Submit Check-in
        </button>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Analytics & Trends</h2>
      
      {/* Multi-metric Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#3b82f6" name="Mood" strokeWidth={2} />
            <Line type="monotone" dataKey="energy" stroke="#10b981" name="Energy" strokeWidth={2} />
            <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" strokeWidth={2} />
            <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" name="Sleep" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
        <div className="space-y-3">
          {moodData.slice(-5).map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{entry.date}</p>
                <p className="text-sm text-gray-600 truncate">{entry.notes || 'No notes'}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getMoodIcon(entry.mood)}
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  analyzeSentiment(entry.notes || '') === 'positive' ? 'bg-green-100 text-green-800' :
                  analyzeSentiment(entry.notes || '') === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {analyzeSentiment(entry.notes || '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Correlation Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800">Sleep & Mood Connection</h4>
            <p className="text-sm text-blue-600 mt-1">
              Better sleep quality correlates with improved mood scores
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800">Energy Patterns</h4>
            <p className="text-sm text-green-600 mt-1">
              Your energy levels are highest on weekends
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-800">Stress Management</h4>
            <p className="text-sm text-orange-600 mt-1">
              Stress levels decrease when mood is above 7
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800">Weekly Trend</h4>
            <p className="text-sm text-purple-600 mt-1">
              Overall wellness trending upward this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Wellness Goals</h2>
      
      <div className="space-y-4">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{goal.title}</h3>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">{goal.streak} day streak</span>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{goal.completed}/{goal.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(goal.completed / goal.target) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (goal.completed < goal.target) {
                    setGoals(goals.map(g => 
                      g.id === goal.id 
                        ? { ...g, completed: g.completed + 1, streak: g.streak + 1 }
                        : g
                    ));
                  }
                }}
                disabled={goal.completed >= goal.target}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark Complete
              </button>
              <button
                onClick={() => {
                  if (goal.completed > 0) {
                    setGoals(goals.map(g => 
                      g.id === goal.id 
                        ? { ...g, completed: g.completed - 1 }
                        : g
                    ));
                  }
                }}
                disabled={goal.completed <= 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Undo
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          const newGoal = {
            id: goals.length + 1,
            title: 'New wellness goal',
            target: 7,
            completed: 0,
            streak: 0
          };
          setGoals([...goals, newGoal]);
        }}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
      >
        + Add New Goal
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">MindWell</h1>
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex justify-around">
          <NavButton
            view="dashboard"
            icon={TrendingUp}
            label="Dashboard"
            active={currentView === 'dashboard'}
          />
          <NavButton
            view="checkin"
            icon={Calendar}
            label="Check-in"
            active={currentView === 'checkin'}
          />
          <NavButton
            view="analytics"
            icon={Activity}
            label="Analytics"
            active={currentView === 'analytics'}
          />
          <NavButton
            view="goals"
            icon={Target}
            label="Goals"
            active={currentView === 'goals'}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'checkin' && renderMoodCheckIn()}
        {currentView === 'analytics' && renderAnalytics()}
        {currentView === 'goals' && renderGoals()}
      </div>
    </div>
  );
};

export default WellnessApp;