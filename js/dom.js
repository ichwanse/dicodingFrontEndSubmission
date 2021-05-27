const BOOK_SHELF_ID = 'book-shelf';
const BOOK_ITEM_ID = 'itemId';

function makeShelf(title, author, year, isCompleted) {
	const titleBook = document.createElement('h3');
	titleBook.innerHTML = title;

	const bookAuthor = document.createElement('p');
	bookAuthor.innerHTML = author;

	const yearPublish = document.createElement('span');
	yearPublish.innerHTML = year;

	const library = document.createElement('div');
	library.classList.add('inner');

	const fieldSet = document.createElement('fieldset');
	const legend = document.createElement('legend');

	fieldSet.append(legend, library);

	const container = document.createElement('div');
	container.classList.add('book');
	container.append(fieldSet);

	if (isCompleted) {
		legend.innerHTML = 'Sudah dibaca';
		library.append(titleBook, createRemoveButton(), createUndoButton(), bookAuthor, yearPublish);
	} else {
		legend.innerHTML = 'Belum selesai dibaca';
		fieldSet.style.borderTopColor = '#999';
		library.append(titleBook, createCheckButton(), bookAuthor, yearPublish);
	}

	return container;
}

function createCheckButton() {
	return createButton('check-button', function(event) {
		addBookToHasBeenRead(event.target.parentElement.parentElement.parentElement);
	});
}

function createUndoButton() {
	return createButton('undo-button', function(event) {
		undoBookFromHasBeenRead(event.target.parentElement.parentElement.parentElement);
	});
}

function createRemoveButton() {
	return createButton('remove-button', function(event) {
		processDelete(event.target.parentElement);
	});
}

function createButton(buttonTypeClass, eventListener) {
	let label = '';
	const button = document.createElement('button');

	if (buttonTypeClass == 'check-button') {
		label = 'Tandai sudah dibaca';
	} else if (buttonTypeClass == 'undo-button') {
		label = 'Tandai belum dibaca';
	} else {
		label = 'hapus';
	}
	button.setAttribute('title', label);
	button.classList.add(buttonTypeClass);
	button.addEventListener('click', function(event) {
		eventListener(event);
	});

	return button;
}

function addBook() {
	const bookShelf = document.getElementById(BOOK_SHELF_ID);
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const year = document.getElementById('yearpicker').value;

	const check = document.getElementById('check');

	let makeBook = check.checked ? makeShelf(title, author, year, true) : makeShelf(title, author, year, false);

	const bookToObj = check.checked
		? dataToObject(title, author, year, true)
		: dataToObject(title, author, year, false);

	//validate
	if (title == '' || author == '' || year == '') {
		document.querySelector('span').style.display = 'block';
		setTimeout(function() {
			document.querySelector('span').style.display = 'none';
		}, 5000);
	} else {
		makeBook[BOOK_ITEM_ID] = bookToObj.id;
		books.push(bookToObj);

		bookShelf.append(makeBook);
		updateBookToStorage();
	}
}

function removeBookFromShelf(el) {
	el.parentElement.remove();
	const bookPosition = findBookIndex(el[BOOK_ITEM_ID]);
	books.splice(bookPosition, 1);
	updateBookToStorage();
}

function undoBookFromHasBeenRead(el) {
	const bookShelf = document.getElementById(BOOK_SHELF_ID);
	const title = el.querySelector('.inner > h3').innerText;
	const author = el.querySelector('.inner > p').innerText;
	const year = el.querySelector('.inner > span').innerText;

	const makeBook = makeShelf(title, author, year, false);
	const book = findBook(el[BOOK_ITEM_ID]);

	book.isComplete = false;
	makeBook[BOOK_ITEM_ID] = book.id;

	bookShelf.append(makeBook);
	el.remove();
	updateBookToStorage();
}

function addBookToHasBeenRead(el) {
	const bookShelf = document.getElementById(BOOK_SHELF_ID);
	const title = el.querySelector('.inner > h3').innerText;
	const author = el.querySelector('.inner > p').innerText;
	const year = el.querySelector('.inner > span').innerText;

	const makeBook = makeShelf(title, author, year, true);
	const book = findBook(el[BOOK_ITEM_ID]);

	el.remove();
	book.isComplete = true;
	makeBook[BOOK_ITEM_ID] = book.id;

	bookShelf.append(makeBook);
	updateBookToStorage();
}

function searchBook() {
	const findTitle = document.getElementById('cari').value.toUpperCase();

	const elems = document.getElementById('book-shelf');
	const elem = elems.getElementsByClassName('book');

	for (let i = 0; i < elem.length; i++) {
		let title = elem[i].getElementsByTagName('h3')[0];

		if (title) {
			let textValue = title.textContent || title.innerHTML;
			if (textValue.toUpperCase().indexOf(findTitle) > -1) {
				elem[i].style.display = '';
			} else {
				elem[i].style.display = 'none';
			}
		}
	}
}

function processDelete(el) {
	const modal = document.getElementById('my-modal');
	modal.style.display = 'block';

	const deleteBtn = document.getElementById('but');

	deleteBtn.onclick = function() {
		removeBookFromShelf(el);
		modal.style.display = 'none';
	};

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
}
