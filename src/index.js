const dogBar = document.getElementById('dog-bar');
const dogInfo = document.getElementById('dog-info');
const filterButton = document.getElementById('filter-btn');
let isFilterOn = false;

// Step 2: Add pups to dog bar
fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(data => {
    data.forEach(pup => {
      const span = document.createElement('span');
      span.textContent = pup.name;
      dogBar.appendChild(span);
    });
  });

// Step 3: Show more info about each pup
dogBar.addEventListener('click', event => {
  if (event.target.tagName === 'SPAN') {
    const pupName = event.target.textContent;
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(data => {
        const pup = data.find(p => p.name === pupName);
        if (pup) {
          dogInfo.innerHTML = `
            <img src="${pup.image}" />
            <h2>${pup.name}</h2>
            <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
          `;
        }
      });
  }
});

// Step 4: Toggle good dog
dogInfo.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    const pupName = event.target.previousElementSibling.textContent;
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(data => {
        const pup = data.find(p => p.name === pupName);
        if (pup) {
          const updatedStatus = !pup.isGoodDog;
          fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isGoodDog: updatedStatus })
          })
            .then(response => response.json())
            .then(updatedPup => {
              event.target.textContent = updatedPup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
            });
        }
      });
  }
});

// Bonus Step 5: Filter good dogs
filterButton.addEventListener('click', () => {
  isFilterOn = !isFilterOn;
  filterButton.textContent = `Filter good dogs: ${isFilterOn ? 'ON' : 'OFF'}`;
  fetch('http://localhost:3000/pups')
    .then(response => response.json())
    .then(data => {
        const filteredPups = isFilterOn ? data.filter(p => p.isGoodDog) : data;
        dogBar.innerHTML = '';
        filteredPups.forEach(pup => {
          const span = document.createElement('span');
          span.textContent = pup.name;
          dogBar.appendChild(span);
        });
      });
  });