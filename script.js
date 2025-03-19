// Defined a list of moods(feelings)
const moods = [
  { name:"Excited 🤩", class:"orange"},
  { name:"Happy 😁", class:"gold"},
  { name:"Sad 🙁", class:"grey"},
  { name:"Disappoint 😞", class:"dark-grey"},
  { name:"Calm 😇", class:"turqoise"},
  { name:"Anxious 😨", class:"purple"},
  { name:"Jealous 😒", class:"green"},
  { name:"Energetic 🔥", class:"red"},
  { name:"Love 🩷", class:"rose-pink"},
  { name:"Creative 🎨", class:"yellow"},
  { name:"Alone 🧍", class:"blue"},
  { name:"Angry 😡", class:"dark-red"},
  { name:"Frustate 😖", class:"beige"},
  { name:"Lost 😔", class:"dark-brown"},
  { name:"Tired 🥱", class:"light-brown"},
];

// Defined days and month Strings
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Fetching all required Elements
const dateInput = document.getElementById('date');                   // date - input
const selectMoods = document.getElementById('mood');                 // feeling - input
const submitButton = document.getElementById('submit');              // submit -button
const yearFilter = document.getElementById('year-filter');           // year - filter
const monthFilter = document.getElementById('month-filter');         // month - filter
const calendarHolder = document.querySelector('.calendar-holder');

// Restricting date-input's max date value to today.
const today = new Date();
const year = String(today.getFullYear());
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
dateInput.setAttribute('max', formattedDate);
// Initialize date input to today's date
dateInput.value = today.toISOString().split('T')[0];

// Code to run on DOM Content Load
document.addEventListener('DOMContentLoaded', () => {
  if(!localStorage.getItem('moodTrackerCalendar')) {
      const moodTrackerCalendar = {
          "2025" : {
              "0": {},
              "1": {},
              "2": {}
          }
      };
      localStorage.setItem('moodTrackerCalendar', JSON.stringify(moodTrackerCalendar));    // Storing the calendar object in Browsers's `localStorage`
  }

  // Populating options for Feelings(Mood) select input
  moods.forEach(mood => {
      const option = document.createElement('option');
      option.innerText = mood.name;
      selectMoods.appendChild(option);
  });

  // Creating Header(Days) of calendar
  days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.innerText = day;
      dayHeader.classList.add('day-header');
      calendarHolder.appendChild(dayHeader);
  });

  // Create and populate options for year and month filters
  createYearFilterOptions();
  createMonthFilterOptions(yearFilter.value);

  // Populate calendar with day-cards
  populateCalendar();
});

// Creates options for Year Filter select input
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

// Creates options for Month Filter select input
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

// Removes previous day-cards and populates the Calendar with new cards
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

// Creates new day-cards
function createCalendarCards(month, year, lastDateInMonth) {
  const cards = [];
  const calendar = JSON.parse(localStorage.getItem('moodTrackerCalendar'));      // fetching data from `localStorage`

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

// Registering eventListener on year filter
yearFilter.addEventListener('input', (e) => {
  Array.from(monthFilter.options).forEach(opt => opt.remove());     // removes all previous month options related to previous year selection
  createMonthFilterOptions(e.target.value);                         // creates new month options related to the latest year selection
  populateCalendar();
});

// Registering eventListener on month filter
monthFilter.addEventListener('input', () => {
  populateCalendar();
});

// Registering eventListener on submit button - to fetch data from input feilds and store them in localStorage
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

  // Creates a new year object if not already present
  if(!calendar[yearInputString]) {
    calendar[yearInputString] = {};
  }
  
  // Creates a new month object if not already present
  if(!calendar[yearInputString][monthInputString]) {
    calendar[yearInputString][monthInputString] = {};
  }

  calendar[yearInputString][monthInputString][dateInputString] = moodObj;
  localStorage.setItem('moodTrackerCalendar', JSON.stringify(calendar));

  // Resetting Date and Feelings inputs
  selectMoods.value = "Select";
  dateInput.value = 'dd-mm-yyyy';

  // Triggering Update Events
  createYearFilterOptions();
  createMonthFilterOptions(yearFilter.value);
  populateCalendar();
});