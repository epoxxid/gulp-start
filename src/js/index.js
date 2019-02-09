document.addEventListener('click', (e) => {
	if (e.target.tagName === 'BUTTON') {
		const h1 = document.getElementsByTagName('h1')[0];
		const oldText = h1.textContent;
		h1.textContent = 'JavaScript works too!';
		setTimeout(() => {
			h1.textContent = oldText;
		}, 2000)
	}
});