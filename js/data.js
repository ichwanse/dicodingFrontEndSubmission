const STORAGE_KEY = 'shelf_apps';
let books = [];

function isStorageAvailable() {
	if (typeof Storage === undefined) {
		alert('Browser kamu tidak mendukung local storage');
		return false;
	}
	return true;
}

function loadDataStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) books = data;
	document.dispatchEvent(new Event('ondataloaded'));
}

function findBook(bookId) {
	for (let book of books) {
		if (book.id === bookId) return book;
	}
	return null;
}

function findBookIndex(bookId) {
	let index = 0;
	for (let book of books) {
		if (book.id === bookId) return index;
		index++;
	}

	return -1;
}

function updateBookToStorage() {
	if (isStorageAvailable()) saveData();
}

function dataToObject(title, author, year, isComplete) {
	return {
		id: +new Date(),
		title,
		author,
		year,
		isComplete
	};
}

function saveData() {
	const parsed = JSON.stringify(books);
	localStorage.setItem(STORAGE_KEY, parsed);

	document.dispatchEvent(new Event('ondatasaved'));
}

function refreshDataFromShelf() {
	const hasRead = document.getElementById(HAS_READ_BOOK);
	const unRead = document.getElementById(UNREAD_BOOK);

	for (item of books) {
		const newBook = makeShelf(item.title, item.author, item.year, item.isComplete);
		newBook[BOOK_ITEM_ID] = item.id;
		item.isComplete ? hasRead.append(newBook) : unRead.append(newBook);
	}
}

for (item of books) {
	const newBook = makeShelf(item.title, item.author, item.year, item.isComplete);
	newBook[BOOK_ITEM_ID] = item.id;
	book.append(newBook);
}
