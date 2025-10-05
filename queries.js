
// Import MongoDB client
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/plp_bookstore';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const books = db.collection(collectionName);

    
    // TASK 2: BASIC CRUD OPERATIONS
    

    // 1️Find all books in a specific genre (e.g., Fiction)
    const fictionBooks = await books.find({ genre: 'Fiction' }).toArray();
    console.log('Books in the "Fiction" genre:');
    console.log(fictionBooks);

    // 2️ Find books published after a certain year (e.g., after 1950)
    const booksAfter1950 = await books.find({ published_year: { $gt: 1950 } }).toArray();
    console.log('Books published after 1950:');
    console.log(booksAfter1950);

    // 3️ Find books by a specific author (e.g., George Orwell)
    const orwellBooks = await books.find({ author: 'George Orwell' }).toArray();
    console.log('Books by George Orwell:');
    console.log(orwellBooks);

    // 4️ Update the price of a specific book (e.g., "1984")
    const updateResult = await books.updateOne(
      { title: '1984' },
      { $set: { price: 12.99 } }
    );
    console.log(` Updated price for "1984": ${updateResult.modifiedCount} document(s) updated`);

    // 5️ Delete a book by its title (e.g., "Moby Dick")
    const deleteResult = await books.deleteOne({ title: 'Moby Dick' });
    console.log(` Deleted "Moby Dick": ${deleteResult.deletedCount} document(s) removed`);

    
    // TASK 3: ADVANCED QUERIES
    

    //  Find books that are both in stock and published after 2010
    const inStockRecent = await books.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log('Books in stock and published after 2010:');
    console.log(inStockRecent);

    //  return only title, author, and price
    const projectedBooks = await books.find(
      {},
      { projection: { _id: 0, title: 1, author: 1, price: 1 } }
    ).toArray();
    console.log('Books with only title, author, and price:');
    console.log(projectedBooks);

    //  Sort books by price ascending
    const sortedAsc = await books.find({}).sort({ price: 1 }).toArray();
    console.log('Books sorted by price (ascending):');
    console.log(sortedAsc);

    //  Sort books by price descending
    const sortedDesc = await books.find({}).sort({ price: -1 }).toArray();
    console.log('Books sorted by price (descending):');
    console.log(sortedDesc);

    //  limit 5 books per page 
    const page = 1;
    const limit = 5;
    const paginatedBooks = await books.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    console.log(`\n Page ${page} of books (5 per page):`);
    console.log(paginatedBooks);

   
    // TASK 4: AGGREGATION PIPELINES
 

    // Average price of books by genre
    const avgPriceByGenre = await books.aggregate([
      { $group: { _id: '$genre', avgPrice: { $avg: '$price' } } },
      { $sort: { avgPrice: -1 } }
    ]).toArray();
    console.log('Average book price by genre:');
    console.log(avgPriceByGenre);

    // 2Author with the most books
    const topAuthor = await books.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log('\n Author with the most books:');
    console.log(topAuthor);

    // 3Group books by publication decade and count them
    const booksByDecade = await books.aggregate([
      {
        $project: {
          decade: {
            $concat: [
              { $toString: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } },
              's'
            ]
          }
        }
      },
      { $group: { _id: '$decade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log('\n Books grouped by publication decade:');
    console.log(booksByDecade);

    // TASK 5: INDEXING
  

    //  Create an index on 'title'
    await books.createIndex({ title: 1 });
    console.log('\n⚡ Index created on "title"');

    // Create a compound index on 'author' and 'published_year'
    await books.createIndex({ author: 1, published_year: 1 });
    console.log('⚡ Compound index created on "author" and "published_year"');

    // Explain query performance for a title search
    const explainPlan = await books.find({ title: '1984' }).explain('executionStats');
    console.log('\n🧠 Query execution stats for title search:');
    console.log(JSON.stringify(explainPlan.executionStats, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed.');
  }
}

runQueries();
