function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', getPhoneBook);
    document.getElementById('btnCreate').addEventListener('click', createContact);

    getPhoneBook();
}

attachEvents();

async function createContact() {
    const person = document.getElementById('person').value;
    const phone = document.getElementById('phone').value;

    await addContact({ 'person': person, 'phone': phone });

    document.getElementById('person').value = '';
    document.getElementById('phone').value = '';
}

async function getPhoneBook() {

    const response = await fetch('http://localhost:3030/jsonstore/phonebook');
    const data = await response.json();

    document.getElementById('phonebook').innerHTML = '';
    Object.values(data).map(appendPhoneBook);

}

async function addContact(person) {

    await fetch('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person)
    });
}

async function deleteContact(id) {
    await fetch('http://localhost:3030/jsonstore/phonebook/' + id, {
        method: 'delete'
    });
}

function appendPhoneBook(person) {
    const phoneBook = document.getElementById('phonebook');

    const liElement = document.createElement('li');
    liElement.id = 'phonebook';
    liElement.textContent = `${person.person}:${person.phone}`;
    const btn = document.createElement('button');
    btn.id = person._id;
    btn.textContent = 'Delete';
    liElement.appendChild(btn);

    btn.addEventListener('click', e => {
        deleteContact(e.target.id);
        e.target.parentElement.remove();
    });

    phoneBook.appendChild(liElement);
}