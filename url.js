const BASE_URL = "http://localhost:3000/api/bookmarks";
let editingId = null;

function resetForm() {
	document.getElementById("title").value = "";
	document.getElementById("url").value = "";
	editingId = null;

	const submitButton = document.querySelector("button[type='submit']");
	if (submitButton) {
		submitButton.textContent = "Add";
	}
}

function loadBookmarks() {
	const list = document.getElementById("bookmarkList");
	if (!list) return;

	list.innerHTML = "";

	axios
		.get(BASE_URL)
		.then((response) => {
			response.data.forEach((bookmark) => showBookmarkOnScreen(bookmark));
		})
		.catch((error) => {
			console.log(error);
		});
}

function handleFormSubmit(event) {
	event.preventDefault();

	const bookmark = {
		title: document.getElementById("title").value.trim(),
		url: document.getElementById("url").value.trim(),
	};

	if (!bookmark.title || !bookmark.url) {
		return;
	}

	const request = editingId
		? axios.put(BASE_URL + "/" + editingId, bookmark)
		: axios.post(BASE_URL, bookmark);

	request
		.then(() => {
			resetForm();
			loadBookmarks();
		})
		.catch((error) => {
			console.log(error);
		});
}

window.addEventListener("DOMContentLoaded", () => {
	loadBookmarks();
});

function showBookmarkOnScreen(bookmark) {
	const list = document.getElementById("bookmarkList");
	if (!list) return;

	const bookmarkId = bookmark._id ?? bookmark.id;
	const li = document.createElement("li");
	li.textContent = bookmark.title + " - ";

	const link = document.createElement("a");
	link.href = bookmark.url;
	link.target = "_blank";
	link.rel = "noopener noreferrer";
	link.textContent = bookmark.url;
	li.appendChild(link);
	li.appendChild(document.createTextNode(" "));

	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => {
		axios
			.delete(BASE_URL + "/" + bookmarkId)
			.then(() => {
				loadBookmarks();
			})
			.catch((error) => {
				console.log(error);
			});
	});

	const editBtn = document.createElement("button");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () => {
		document.getElementById("title").value = bookmark.title;
		document.getElementById("url").value = bookmark.url;
		editingId = bookmarkId;

		const submitButton = document.querySelector("button[type='submit']");
		if (submitButton) {
			submitButton.textContent = "Update";
		}
	});

	li.appendChild(deleteBtn);
	li.appendChild(editBtn);
	list.appendChild(li);
}

if (typeof module !== "undefined") {
	module.exports = handleFormSubmit;
}