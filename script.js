document.addEventListener('DOMContentLoaded', () => {
    const addingBookForm = document.getElementById('addingbookform');
    const bookGrid = document.getElementById('bookgrid');
    const historyList = document.getElementById('historylist');
    const clearLogButton = document.getElementById('clearlog');
    const toggleHistoryButton = document.getElementById('togglehistory');
    const historyContainer = document.querySelector('.historycontainer');
    const searchBar = document.getElementById('searchbar');
    const categoryLists = document.querySelectorAll('.categorylist');
    const allSection = document.getElementById('ALL');

    // Default books
    const defaultBooks = [
        { title: 'Let us C', author: 'Kanetkar Yashwant', category: 'Programming Languages' },
        { title: 'Introduction to Computers', author: 'Norton Peter', category: 'Web' },
        { title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming Languages' },
        { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming Languages' },
        { title: 'The Design of Everyday Things', author: 'Don Norman', category: 'UI UX' },
        { title: 'Design Patterns', author: 'Erich Gamma', category: 'Programming Languages' },
        { title: 'Code Complete', author: 'Steve McConnell', category: 'Programming Languages' },
        { title: "Don't Make Me Think", author: 'Steve Krug', category: 'UI UX' },
        { title: 'Refactoring', author: 'Martin Fowler', category: 'Programming Languages' },
        { title: 'The Pragmatic Programmer', author: 'Andrew Hunt and David Thomas', category: 'App Development' },
        { title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', category: 'Web' },
        { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Programming Languages' },
        { title: 'Applied Cryptography', author: 'Bruce Schneier', category: 'CyberSecurity' },
        { title: 'Hacking: The Art of Exploitation', author: 'Jon Erickson', category: 'CyberSecurity' },
        { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Programming Languages' },
        { title: 'Lean UX', author: 'Jeff Gothelf and Josh Seiden', category: 'UI UX' },
        { title: "The Web Application Hacker's Handbook", author: 'Dafydd Stuttard and Marcus Pinto', category: 'CyberSecurity' },
        { title: 'Flutter for Beginners', author: 'Alessandro Biessek', category: 'App Development' },
        { title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper', category: 'UI UX' },
        { title: 'Android Programming: The Big Nerd Ranch Guide', author: 'Bill Phillips and Chris Stewart', category: 'App Development' },
        { title: '100 Things Every Designer Needs to Know About People', author: 'Susan Weinschenk', category: 'UI UX' },
        { title: 'iOS Programming: The Big Nerd Ranch Guide', author: 'Christian Keur and Aaron Hillegass', category: 'App Development' },
        { title: "Metasploit: The Penetration Tester's Guide", author: 'David Kennedy, Jim O\'Gorman, Devon Kearns, and Mati Aharoni', category: 'CyberSecurity' },
        { title: 'Learning React Native', author: 'Bonnie Eisenman', category: 'App Development' },
        { title: 'Cybersecurity Essentials', author: 'Charles J. Brooks, Christopher Grow, Philip Craig, and Donald Short', category: 'CyberSecurity' }
    ];

    // Initialize books and history from localStorage or use defaults
    let books = JSON.parse(localStorage.getItem('books')) || defaultBooks;
    let history = JSON.parse(localStorage.getItem('history')) || [];

    // Render books
    function renderBooks(filteredBooks = books) {
        bookGrid.innerHTML = filteredBooks.map((book, index) => `
            <div class="bookitem">
                <img src="bookCover.jpg" alt="${book.title}">
                <div class="bookdetails">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <h6><i class="fa-solid fa-tag"></i> ${book.category || 'Uncategorized'}</h6>
                </div>
                <button class="borrowbtn" data-index="${index}">Borrow</button>
                <button class="deletebtn" data-index="${index}">Delete</button>
            </div>
        `).join('');
        attachBookEvents();
    }

    // Render history
    function renderHistory() {
        historyList.innerHTML = history.map(record => `
            <li><b>${record.title}</b> by <b>${record.author}</b> was borrowed on <b>${record.date}, ${record.time}</b></li>
        `).join('');
    }

    // Add a new book
    function addBook(title, author, category) {
        books.unshift({ title, author, category });
        updateLocalStorage('books', books);
        renderBooks();
    }

    // Delete a book
    function deleteBook(index) {
        books.splice(index, 1);
        updateLocalStorage('books', books);
        renderBooks();
    }

    // Borrow a book
    function borrowBook(index) {
        const book = books[index];
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        history.unshift({ ...book, date, time });
        updateLocalStorage('history', history);
        renderHistory();
    }

    // Clear history log
    function clearLog() {
        history = [];
        updateLocalStorage('history', history);
        renderHistory();
    }

    // Update localStorage
    function updateLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Attach events for books
    function attachBookEvents() {
        bookGrid.querySelectorAll('.deletebtn').forEach(button => {
            button.addEventListener('click', () => {
                deleteBook(button.dataset.index);
            });
        });

        bookGrid.querySelectorAll('.borrowbtn').forEach(button => {
            button.addEventListener('click', () => {
                borrowBook(button.dataset.index);
            });
        });
    }

    // Attach general events
    function attachGeneralEvents() {
        clearLogButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the borrowing history?')) {
                clearLog();
            }
        });

        toggleHistoryButton.addEventListener('click', () => {
            historyContainer.classList.toggle('active');
        });

        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
            );
            renderBooks(filteredBooks);
        });

        categoryLists.forEach(category => {
            category.addEventListener('click', () => {
                const categoryName = category.id.replace('_', ' ').replace('/', ' ');
                const filteredBooks = books.filter(book => book.category === categoryName);
                renderBooks(filteredBooks);
            });
        });

        allSection.addEventListener('click', renderBooks);
    }

    addingBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('booktitle').value;
        const author = document.getElementById('bookauthor').value;
        const category = document.getElementById('bookcategory').value;
        addBook(title, author, category);
        addingBookForm.reset();
    });

    // Initial render
    renderBooks();
    renderHistory();
    attachGeneralEvents();
});
