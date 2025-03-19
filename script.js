const moods = [
  { name:"Excited 🤩", class:"dark-yellow"}, //
  { name:"Happy 😁", class:"red"},
  { name:"Sad 🙁", class:"red"},
  { name:"Disappointed 😞", class:"red"},
  { name:"Calm 😇", class:"turqoise"}, //
  { name:"Anxious 😨", class:"red"},
  { name:"Jealous 😒", class:"red"},
  { name:"Energetic 🔥", class:"red"}, //
  { name:"Loved 🩷", class:"red"},
  { name:"Creative 🎨", class:"yellow"}, //
  { name:"Alone 🧍", class:"red"},
  { name:"Angry 😡", class:"red"}, //
  { name:"Frustated 😖", class:"red"},
  { name:"Lost 😔", class:"red"},
  { name:"Tired 🥱", class:"red"},
];

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const dateInput = document.getElementById('date');
const selectMoods = document.getElementById('mood');
const submitButton = document.getElementById('submit');
const yearFilter = document.getElementById('year-filter');
const monthFilter = document.getElementById('month-filter');
const calendarHolder = document.querySelector('.calendar-holder');

const today = new Date();
const year = String(today.getFullYear());
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
dateInput.setAttribute('max', formattedDate);
dateInput.value = today.toISOString().split('T')[0];

document.addEventListener('DOMContentLoaded', () => {
  if(!localStorage.getItem('moodTrackerCalendar')) {
      const moodTrackerCalendar = {
          "2025" : {
              "0": {},
              "1": {},
              "2": {}
          }
      };
      localStorage.setItem('moodTrackerCalendar', JSON.stringify(moodTrackerCalendar));
  }

  moods.forEach(mood => {
      const option = document.createElement('option');
      option.innerText = mood.name;
      selectMoods.appendChild(option);
  });

  days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.innerText = day;
      dayHeader.classList.add('day-header');
      calendarHolder.appendChild(dayHeader);
  });

  createYearFilterOptions();
  createMonthFilterOptions(yearFilter.value);
  populateCalendar();
});

function createYearFilterOptions() {
  const moodTrackerCalendar = JSON.parse(localStorage.getItem('moodTrackerCalendar'));
  const yearsInFilter = [];
  Array.from(yearFilter.options).forEach(opt => yearsInFilter.push(opt.innerText));
  Object.keys(moodTrackerCalendar).forEach(yearString => {
      if(yearsInFilter.includes(yearString)){
        return;
      }
      const yearOption = document.createElement('option');
      yearOption.textContent = yearString;
      if(yearString === year) {
          yearOption.setAttribute('selected', true);
      }
      yearFilter.appendChild(yearOption);
  });    
}

function createMonthFilterOptions(yearString) {
  const yearObj = JSON.parse(localStorage.getItem('moodTrackerCalendar'))[yearString];
  Object.keys(yearObj).forEach(monthString => {
    const monthsInFilter = [];
    Array.from(monthFilter.options).forEach(opt => monthsInFilter.push(opt.innerText));
    if(monthsInFilter.includes(months[monthString])){
      return;
    }
      const monthOption = document.createElement('option');
      monthOption.textContent = months[monthString];
      monthFilter.appendChild(monthOption);
  });
  monthFilter.lastElementChild.setAttribute('selected', true);
}

function populateCalendar(){
  const month = months.indexOf(monthFilter.value);
  const year = Number(yearFilter.value);
  const firstDayInMonth = new Date(year, month).getDay();
  const lastDateInMonth = new Date(year, month+1, 0);
  document.querySelectorAll('.calendar-cards').forEach( e => e.remove());
  const calendarCards = createCalendarCards(month, year, lastDateInMonth);
  calendarCards[0].classList.add(`first-card-${firstDayInMonth}`);
  calendarCards.forEach(ele => calendarHolder.appendChild(ele));
}

function createCalendarCards(month, year, lastDateInMonth) {
  const cards = [];
  const calendar = JSON.parse(localStorage.getItem('moodTrackerCalendar'));
  for(let i=1; i<=lastDateInMonth.getDate(); i++){
    const card = document.createElement('div');
    card.classList.add('calendar-cards')
    card.textContent = i;
    const title = document.createElement('p');
    title.classList.add('card-title');
    const emoji = document.createElement('p');
    emoji.classList.add('card-emoji');
    const moodData = calendar[year][month][i];
    if(!moodData) {
      card.classList.add('no-data-card');
      title.innerText = "No Data";
      emoji.innerText = "🚫"
    } else {
      const data = moodData.name.split(' ');
      card.classList.add(moodData.class);
      title.innerText = data[0];
      emoji.innerText = data[1];
    }
    card.appendChild(title);
    card.appendChild(emoji);
    cards.push(card);
  }
  return cards;
}

yearFilter.addEventListener('input', (e) => {
  Array.from(monthFilter.options).forEach(opt => opt.remove());
  createMonthFilterOptions(e.target.value);
  populateCalendar();
});

monthFilter.addEventListener('input', () => {
  populateCalendar();
});

submitButton.addEventListener('click', () => {
  const date = new Date(dateInput.value);
  const yearInputString = String(date.getFullYear());
  const monthInputString = String(date.getMonth());
  const dateInputString = String(date.getDate());
  const mood = selectMoods.value;
  if (date == "Invalid Date" || mood == "Select") {
      alert('please enter valid values for Date and Feeling');
      return;
  }
  const moodObj = moods.find(m => m.name == mood);
  let calendar = JSON.parse(localStorage.getItem('moodTrackerCalendar'));
  if(!calendar[yearInputString]) {
    calendar[yearInputString] = {};
  }
  if(!calendar[yearInputString][monthInputString]) {
    calendar[yearInputString][monthInputString] = {};
  }
  calendar[yearInputString][monthInputString][dateInputString] = moodObj;
  localStorage.setItem('moodTrackerCalendar', JSON.stringify(calendar));
  selectMoods.value = "Select";
  dateInput.value = '';

  createYearFilterOptions();
  createMonthFilterOptions(yearFilter.value);
  populateCalendar();
});