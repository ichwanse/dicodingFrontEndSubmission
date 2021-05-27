document.addEventListener('DOMContentLoaded', function() {
	const submitForm = document.getElementById('form-input-book');

	submitForm.addEventListener('submit', function(event) {
		event.preventDefault();
		addBook();
	});

	if (isStorageAvailable()) {
		loadDataStorage();
	}
});

document.addEventListener('ondatasaved', () => {
	console.log('Data berhasil disimpan.');
});
document.addEventListener('ondataloaded', () => {
	refreshDataFromShelf();
});
