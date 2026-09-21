const BASE_URL = "https://crudcrud.com/api/0cf2a45c5ab34117b98cdc569a0d8a08/users";

// Save a bookmark when the form is submitted
function handleFormSubmit(event) {
	event.preventDefault();

	const bookmark = {
		title: document.getElementById("title").value,
		url: document.getElementById("url").value,
	};

	axios
		.post(BASE_URL, bookmark)
		.then((response) => {
			showBookmarkOnScreen(response.data);
		})
		.catch((error) => {
			console.log(error);
		});

	event.target.reset();
}

// Show all saved bookmarks when the page loads
window.addEventListener("DOMContentLoaded", () => {
	axios
		.get(BASE_URL)
		.then((response) => {
			for (var i = 0; i < response.data.length; i++) {
				showBookmarkOnScreen(response.data[i]);
			}
		})
		.catch((error) => {
			console.log(error);
		});
});

function showBookmarkOnScreen(bookmark) {
	const list = document.getElementById("bookmarkList");
	const li = document.createElement("li");
	li.textContent = bookmark.title + " - ";

	// Make the saved URL clickable so it redirects to the website after POST.
	const link = document.createElement("a");
	link.href = bookmark.url;
	link.target = "_blank";
	link.rel = "noopener noreferrer";
	link.textContent = bookmark.url;
	li.appendChild(link);
	li.appendChild(document.createTextNode(" "));

	// Delete button
	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => {
		axios
			.delete(BASE_URL + "/" + bookmark._id)
			.then(() => {
				list.removeChild(li);
			})
			.catch((error) => {
				console.log(error);
			});
	});

	// Edit button: put the details back in the form and delete the old one
	const editBtn = document.createElement("button");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () => {
		document.getElementById("title").value = bookmark.title;
		document.getElementById("url").value = bookmark.url;

		axios
			.delete(BASE_URL + "/" + bookmark._id)
			.then(() => {
				list.removeChild(li);
			})
			.catch((error) => {
				console.log(error);
			});
	});

	li.appendChild(deleteBtn);
	li.appendChild(editBtn);
	list.appendChild(li);
}

if (typeof module !== "undefined") {
	module.exports = handleFormSubmit;
}