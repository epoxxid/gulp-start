document.addEventListener('click', (e) => {
	if (e.target.tagName === 'BUTTON') {
		const h1 = document.getElementsByTagName('h1')[0];
		const oldText = h1.textContent;
		h1.textContent = 'Ты самая лучшая жена!';
		setTimeout(() => {
			h1.textContent = oldText;
		}, 2000)
	}
});