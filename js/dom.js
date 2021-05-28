const UNREAD_BOOK = 'unread';
const HAS_READ_BOOK = 'has-read';
const BOOK_ITEM_ID = 'itemId';
document.getElementById(UNREAD_BOOK).style.display = 'none';
document.getElementById(HAS_READ_BOOK).style.display = 'none';

function makeShelf(title, author, year, isCompleted) {
	const titleBook = document.createElement('h3');
	titleBook.innerHTML = title;

	const bookAuthor = document.createElement('p');
	bookAuthor.innerHTML = author;

	const yearPublish = document.createElement('span');
	yearPublish.innerHTML = year;

	const library = document.createElement('div');
	library.classList.add('inner');

	const container = document.createElement('div');
	container.classList.add('book');
	container.append(library);

	if (isCompleted) {
		document.getElementById(HAS_READ_BOOK).style.display = 'block';
		library.append(titleBook, createRemoveButton(), createUndoButton(), bookAuthor, yearPublish);
	} else {
		document.getElementById(UNREAD_BOOK).style.cssText = 'display:block; border-color:#555; margin-top:20px';
		library.append(titleBook, createRemoveButton(), createCheckButton(), bookAuthor, yearPublish);
	}

	return container;
}

function createCheckButton() {
	return createButton('check-button', function(event) {
		addBookToHasBeenRead(event.target.parentElement.parentElement);
	});
}

function createUndoButton() {
	return createButton('undo-button', function(event) {
		undoBookFromHasBeenRead(event.target.parentElement.parentElement);
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
	const unRead = document.getElementById(UNREAD_BOOK);
	const hasRead = document.getElementById(HAS_READ_BOOK);
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const year = document.getElementById('yearpicker').value;

	const check = document.getElementById('check');

	let makeBook = makeShelf(title, author, year, check.checked ? true : false);

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

		check.checked ? console.log(hasRead) : console.log(unRead);

		check.checked ? hasRead.append(makeBook) : unRead.append(makeBook);
		updateBookToStorage();
	}
}

function removeBookFromShelf(el) {
	console.log(el[BOOK_ITEM_ID]);
	el.parentElement.remove();
	const bookPosition = findBookIndex(el[BOOK_ITEM_ID]);
	books.splice(bookPosition, 1);
	updateBookToStorage();
}

function undoBookFromHasBeenRead(el) {
	const unReadBook = document.getElementById(UNREAD_BOOK);
	const title = el.querySelector('.inner > h3').innerText;
	const author = el.querySelector('.inner > p').innerText;
	const year = el.querySelector('.inner > span').innerText;

	const makeBook = makeShelf(title, author, year, false);
	const book = findBook(el[BOOK_ITEM_ID]);

	book.isComplete = false;
	makeBook[BOOK_ITEM_ID] = book.id;

	unReadBook.append(makeBook);
	el.remove();
	updateBookToStorage();
}

function addBookToHasBeenRead(el) {
	console.log(el);
	const hasRead = document.getElementById(HAS_READ_BOOK);
	const title = el.querySelector('.inner > h3').innerText;
	const author = el.querySelector('.inner > p').innerText;
	const year = el.querySelector('.inner > span').innerText;

	const makeBook = makeShelf(title, author, year, true);
	const book = findBook(el[BOOK_ITEM_ID]);

	el.remove();
	book.isComplete = true;
	makeBook[BOOK_ITEM_ID] = book.id;

	hasRead.append(makeBook);
	updateBookToStorage();
}

function searchBook() {
	const findTitle = document.getElementById('cari').value.toUpperCase();

	const hasRead = document.getElementById('has-read');
	const elemOne = hasRead.getElementsByClassName('book');
	console.log(elemOne);

	for (let i = 0; i < elemOne.length; i++) {
		let title = elemOne[i].getElementsByTagName('h3')[0];

		if (title) {
			let textValue = title.textContent || title.innerHTML;
			if (textValue.toUpperCase().indexOf(findTitle) > -1) {
				elemOne[i].style.display = '';
			} else {
				elemOne[i].style.display = 'none';
			}
		}
	}

	const unRead = document.getElementById('unread');
	const elemTwo = unRead.getElementsByClassName('book');
	console.log(elemTwo);

	for (let i = 0; i < elemTwo.length; i++) {
		let title = elemTwo[i].getElementsByTagName('h3')[0];

		if (title) {
			let textValue = title.textContent || title.innerHTML;
			if (textValue.toUpperCase().indexOf(findTitle) > -1) {
				elemTwo[i].style.display = '';
			} else {
				elemTwo[i].style.display = 'none';
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
