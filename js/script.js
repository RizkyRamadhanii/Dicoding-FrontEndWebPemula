const buku = [];
const RENDER = 'buat-buku';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      tambahBuku();
    });
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function () {
      const searchInput = document.getElementById('searchInput').value;
      cariBukuByTitle(searchInput);
    });
    if (isStorageExist()) {
        loadDataFromStorage();
      }
  });

  function cariBukuByTitle(title) {
    const result = buku.filter(function (buku) {
      return buku.title.toLowerCase().includes(title.toLowerCase());
    });
  
    const belumDibaca = document.getElementById('data-buku');
    belumDibaca.innerHTML = '';
  
    for (const todo of result) {
      const todoElement = addBook(todo);
      if (!todo.isCompleted)
        belumDibaca.append(todoElement);
    }
  }
function tambahBuku () {
    const judulBuku = document.getElementById('inputBuku').value;
    const penulisBuku = document.getElementById('inputPenulis').value;
    const tahunBuku = document.getElementById('inputTahun').value;

    const generatedID = generateId();
    const objectBuku = masukkanObject(generatedID, judulBuku, penulisBuku, tahunBuku, false);
    buku.push(objectBuku);

    document.dispatchEvent(new Event(RENDER));
    saveData();

    document.getElementById("inputBuku").value="";
    document.getElementById("inputPenulis").value="";
    document.getElementById("inputTahun").value="";

}


function generateId() {
    return +new Date();
}

function masukkanObject (id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER, function () {
    const  belumDibaca = document.getElementById('data-buku');
    belumDibaca.innerHTML = '';

    const selesaiDibaca = document.getElementById('selesai');
    selesaiDibaca.innerHTML = '';

    for (const todo of buku) {
        const todoElement = addBook(todo);
        if(!todo.isCompleted)
            belumDibaca.append(todoElement);
        else
            selesaiDibaca.append(todoElement);
    }
});

function cariIndexBuku (todoId) {
    for (const index in buku) {
        if (buku[index].id === todoId) {
            return index;
        }
    }
    return -1;
}

function addBook (objectBuku) {
   const textTitle = document.createElement('div');
   textTitle.innerHTML = `
   <h1 class = 'judul'>${objectBuku.title}</h1>
   <p class = 'penulisBuku'>Buku ini ditulis oleh <strong> ${objectBuku.author}</strong> dan di terbitkan pada Tahun <strong> ${objectBuku.year}</strong></p>
   `
    const textContainer = document.createElement('div');
    textContainer.classList.add('content');
    textContainer.append(textTitle);


    if (objectBuku.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('fa');
        undoButton.classList.add('fa-undo');
        
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(objectBuku.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('fa');
        trashButton.classList.add('fa-trash');

        trashButton.addEventListener('click', function(){
            if(confirm('Ingin menghapus buku ini dari  ? ')== true){
                removeTaskFromCompleted(objectBuku.id);
            }
        });
        
        const opsi = document.createElement('div');
        opsi.classList.add('opsi')
        opsi.append(undoButton, trashButton);
        textContainer.append(opsi);

    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('fa')
        checkButton.classList.add('fa-check')

        checkButton.addEventListener('click', function() {
            addTaskToComplete(objectBuku.id)
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('fa');
        trashButton.classList.add('fa-trash');

        trashButton.addEventListener('click', function(){
            if(confirm('Ingin menghapus buku ini dari  ? ')== true){
                removeTaskFromCompleted(objectBuku.id);
            }
        });

        const check = document.createElement('div');
        check.classList.add('check');
        check.append(checkButton, trashButton);
        textContainer.append(check);
    }

    return textContainer;
    
}

function addTaskToComplete (todoId) {
    const targetBuku = cariBuku(todoId);
    if(targetBuku == null) return;

    targetBuku.isCompleted = true;
    document.dispatchEvent(new Event(RENDER));
    
    saveData();
}

function cariBuku (todoId) {
    for (const todoItem of buku) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function removeTaskFromCompleted(todoId) {
    const targetBuku = cariIndexBuku(todoId);

    if (targetBuku === -1) return;

    buku.splice(targetBuku,1);
    document.dispatchEvent(new Event (RENDER));
    saveData();
}

function undoTaskFromCompleted(todoId) {
    const targetBuku = cariBuku(todoId);

    if (targetBuku == null) return;

    targetBuku.isCompleted = false;
    document.dispatchEvent(new Event(RENDER));
    saveData();
}

const SAVED = 'saved-buku';
const STORAGE = 'BUKU_APPS';

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(buku);
      localStorage.setItem(STORAGE, parsed);
      document.dispatchEvent(new Event(SAVED));
    }
  }

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

document.addEventListener(SAVED, function(){
    console.log(localStorage.getItem(STORAGE));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const todo of data) {
        buku.push(todo);
      }
    }
   
    document.dispatchEvent(new Event(RENDER));
  }

