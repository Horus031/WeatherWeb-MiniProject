const tab1Elem = document.querySelector('.tab1');
const tab2Elem = document.querySelector('.tab2');
const searchBtn = document.querySelector('.search-icon');
const backBtn = document.querySelector('.back-icon')

searchBtn.onclick = function() {
    tab1Elem.style.display = 'none';
    tab2Elem.style.display = 'flex';
}

backBtn.onclick = function() {
    tab2Elem.style.display = 'none';
    tab1Elem.style.display = 'flex';
}