import React, { useState, useEffect } from 'react';
import './App.css';

// Основной компонент приложения
function App() {
  // Состояние для текущего выбранного настроения
  const [selectedMood, setSelectedMood] = useState(null);
  // Состояние для истории настроений
  const [moodHistory, setMoodHistory] = useState([]);
  // Состояние для заметки
  const [note, setNote] = useState('');

  // Список доступных настроений
  const MOODS = [
    { id: 1, emoji: '😊', name: 'Счастливый', color: '#FFD700' },
    { id: 2, emoji: '😢', name: 'Грустный', color: '#6495ED' },
    { id: 3, emoji: '😡', name: 'Злой', color: '#DC143C' },
    { id: 4, emoji: '😴', name: 'Уставший', color: '#808080' },
    { id: 5, emoji: '😃', name: 'Восторг', color: '#32CD32' },
    { id: 6, emoji: '😰', name: 'Тревожный', color: '#8A2BE2' },
    { id: 7, emoji: '😎', name: 'Крутой', color: '#00CED1' },
    { id: 8, emoji: '🥰', name: 'Влюблённый', color: '#FF69B4' },
    { id: 9, emoji: '🤔', name: 'Задумчивый', color: '#D2691E' },
    { id: 10, emoji: '😇', name: 'Невинный', color: '#87CEEB' }
  ];

  // Загрузка данных из localStorage при загрузке компонента
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('moodDiaryHistory');
    const savedSelectedMood = localStorage.getItem('todayMood');
    const savedNote = localStorage.getItem('todayNote');
    
    if (savedMoodHistory) {
      setMoodHistory(JSON.parse(savedMoodHistory));
    }
    
    if (savedSelectedMood) {
      setSelectedMood(JSON.parse(savedSelectedMood));
    }
    
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('moodDiaryHistory', JSON.stringify(moodHistory));
    localStorage.setItem('todayMood', JSON.stringify(selectedMood));
    localStorage.setItem('todayNote', note);
  }, [moodHistory, selectedMood, note]);

  // Функция для выбора настроения
  const handleMoodSelect = (mood) => {
    const today = new Date();
    const todayString = today.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Проверяем, не выбрали ли мы уже настроение на сегодня
    const existingEntryIndex = moodHistory.findIndex(
      entry => entry.date === todayString
    );

    const newEntry = {
      id: Date.now(),
      mood: mood,
      date: todayString,
      note: note
    };

    if (existingEntryIndex !== -1) {
      // Обновляем существующую запись
      const updatedHistory = [...moodHistory];
      updatedHistory[existingEntryIndex] = newEntry;
      setMoodHistory(updatedHistory);
    } else {
      // Добавляем новую запись
      setMoodHistory([newEntry, ...moodHistory]);
    }

    setSelectedMood(mood);
  };

  // Функция для удаления записи из истории
  const handleDeleteEntry = (id) => {
    setMoodHistory(moodHistory.filter(entry => entry.id !== id));
  };

  // Функция для получения текущей даты
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Функция для очистки сегодняшней записи
  const clearToday = () => {
    const todayString = getCurrentDate();
    const updatedHistory = moodHistory.filter(entry => entry.date !== todayString);
    setMoodHistory(updatedHistory);
    setSelectedMood(null);
    setNote('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📔 Мини-дневник настроения</h1>
        <div className="current-date">
          <h2>{getCurrentDate()}</h2>
        </div>
      </header>

      <main className="app-main">
        <section className="mood-selector">
          <h3>Как вы себя чувствуете сегодня?</h3>
          <div className="moods-grid">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                className={`mood-btn ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood)}
                style={{ backgroundColor: mood.color }}
                title={mood.name}
              >
                <span className="emoji">{mood.emoji}</span>
                <span className="mood-name">{mood.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="note-section">
          <h3>Добавьте заметку (необязательно):</h3>
          <textarea
            className="note-input"
            placeholder="Опишите, почему вы так себя чувствуете, или запишите мысли на сегодня..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
          />
        </section>

        {selectedMood && (
          <section className="today-summary">
            <h3>Ваше настроение на сегодня:</h3>
            <div className="summary-card">
              <span className="summary-emoji">{selectedMood.emoji}</span>
              <div className="summary-info">
                <h4>{selectedMood.name}</h4>
                {note && <p className="summary-note">"{note}"</p>}
              </div>
            </div>
            <button className="clear-btn" onClick={clearToday}>
              Очистить сегодняшнюю запись
            </button>
          </section>
        )}

        <section className="history-section">
          <h3>📅 История настроений</h3>
          {moodHistory.length === 0 ? (
            <p className="empty-history">Записей пока нет. Выберите своё настроение сегодня!</p>
          ) : (
            <div className="history-list">
              {moodHistory.map(entry => (
                <div key={entry.id} className="history-card">
                  <div className="history-mood" style={{ backgroundColor: entry.mood.color }}>
                    {entry.mood.emoji}
                  </div>
                  <div className="history-details">
                    <div className="history-date">{entry.date}</div>
                    <div className="history-mood-name">{entry.mood.name}</div>
                    {entry.note && <div className="history-note">"{entry.note}"</div>}
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="Удалить запись"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Дневник настроения © 2025</p>
        <p className="stats">Всего записей: {moodHistory.length}</p>
      </footer>
    </div>
  );
}

export default App;
