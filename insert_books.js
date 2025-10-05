// insert_books.js - Script to populate MongoDB with sample book data

// Import MongoDB client
const { MongoClient } = require('mongodb');

// Connection URI (replace with your MongoDB connection string if using Atlas)
const uri = 'mongodb://localhost:27017/plp_bookstore';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Sample book data
const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    published_year: 1949,
    price: 10.99,
    in_stock: true,
    pages: 328,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    published_year: 1925,
    price: 9.99,
    in_stock: true,
    pages: 180,
    publisher: 'Charles Scribner\'s Sons'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    published_year: 1932,
    price: 11.50,
    in_stock: false,
    pages: 311,
    publisher: 'Chatto & Windus'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1937,
    price: 14.99,
    in_stock: true,
    pages: 310,
    publisher: 'George Allen & Unwin'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    published_year: 1951,
    price: 8.99,
    in_stock: true,
    pages: 224,
    publisher: 'Little, Brown and Company'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    published_year: 1813,
    price: 7.99,
    in_stock: true,
    pages: 432,
    publisher: 'T. Egerton, Whitehall'
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1954,
    price: 19.99,
    in_stock: true,
    pages: 1178,
    publisher: 'Allen & Unwin'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    published_year: 1945,
    price: 8.50,
    in_stock: false,
    pages: 112,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    published_year: 1988,
    price: 10.99,
    in_stock: true,
    pages: 197,
    publisher: 'HarperOne'
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    published_year: 1851,
    price: 12.50,
    in_stock: false,
    pages: 635,
    publisher: 'Harper & Brothers'
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    published_year: 1847,
    price: 9.99,
    in_stock: true,
    pages: 342,
    publisher: 'Thomas Cautley Newby'
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    genre: 'Philosophical Fiction',
    published_year: 1890,
    price: 11.99,
    in_stock: true,
    pages: 254,
    publisher: "Lippincott's Monthly Magazine"
  },
  {
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    genre: 'Philosophical Fiction',
    published_year: 1880,
    price: 14.99,
    in_stock: true,
    pages: 796,
    publisher: 'The Russian Messenger'
  } ,
  {
    title: 'The Idiot',
    author: 'Fyodor Dostoevsky',
    genre: 'Philosophical Fiction',
    published_year: 1869,
    price: 13.99,
    in_stock: true,
    pages: 656,
    publisher: 'The Russian Messenger'
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    genre: 'Philosophical Fiction',
    published_year: 1866,
    price: 15.99,
    in_stock: true,
    pages: 671,
    publisher: 'The Russian Messenger'
  },
  {
    title: 'Les Misérables',
    author: 'Victor Hugo',
    genre: 'Historical Fiction',
    published_year: 1862,
    price: 18.99,
    in_stock: true,
    pages: 1232,
    publisher: 'A. Lacroix, Verboeckhoven & Cie'
  },
  {
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    genre: 'Historical Fiction',
    published_year: 1869,
    price: 19.99,
    in_stock: true,
    pages: 1225,
    publisher: 'The Russian Messenger'
  },
  {
    title: 'Anna Karenina',
    author: 'Leo Tolstoy',
    genre: 'Historical Fiction',
    published_year: 1877,
    price: 18.99,
    in_stock: true,
    pages: 864,
    publisher: 'The Russian Messenger'
  },
  {
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    genre: 'Adventure',
    published_year: 1605,
    price: 16.99, 
    in_stock: true,
    pages: 863,
    publisher: 'Francisco de Robles'
  }
];

// Function to insert books into MongoDB
async function insertBooks() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if collection already has documents
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Collection already contains ${count} documents. Dropping collection...`);
      await collection.drop();
      console.log('Collection dropped successfully');
    }

    // Insert the books
    const result = await collection.insertMany(books);
    console.log(`${result.insertedCount} books were successfully inserted into the database`);

    // Display the inserted books
    console.log('\nInserted books:');
    const insertedBooks = await collection.find({}).toArray();
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the function
insertBooks().catch(console.error);
