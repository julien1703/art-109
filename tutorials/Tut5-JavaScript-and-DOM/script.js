const jsStatusBadge = document.querySelector('#js-status .badge');
const timerBox       = document.querySelector('#timer-box');
const clickBtn       = document.querySelector('#click-btn');
const clickTarget    = document.querySelector('#click-target');

const toggleImageBtn = document.querySelector('#toggle-image-btn');
const photo          = document.querySelector('#photo');

const grid           = document.querySelector('#grid');
const cells          = grid.querySelectorAll('.cell');
const revealAllBtn   = document.querySelector('#reveal-all-btn');
const resetGridBtn   = document.querySelector('#reset-grid-btn');

jsStatusBadge.textContent = 'ready';
jsStatusBadge.style.background = '#10b981';
jsStatusBadge.style.color = '#062a21';

setInterval(() => {
  timerBox.classList.toggle('highlight');
  console.log('[setInterval] Box toggled');
}, 5000);

clickBtn.addEventListener('click', () => {
  clickTarget.classList.toggle('is-active');
  clickTarget.textContent = clickTarget.classList.contains('is-active')
    ? 'Active! (Click again to reset)'
    : 'I will change when you click';
});

function togglePhoto() {
  photo.classList.toggle('hidden');
  console.log('[photo] hidden?', photo.classList.contains('hidden'));
}
toggleImageBtn.addEventListener('click', togglePhoto);
photo.addEventListener('click', togglePhoto);

photo.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    togglePhoto();
  }
});

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    cell.classList.toggle('hidden');
  });
});

revealAllBtn.addEventListener('click', () => {
  const anyVisible = Array.from(cells).some(c => !c.classList.contains('hidden'));
  cells.forEach(c => c.classList.toggle('hidden', anyVisible));
});

resetGridBtn.addEventListener('click', () => {
  cells.forEach(c => c.classList.remove('hidden'));
});
