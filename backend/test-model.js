// test-models.js
const db = require('./models');

async function testModels() {
  try {
    console.log('Testing Sequelize models...\n');
    
    // Test User model
    console.log('1. Testing User model:');
    const userCount = await db.User.count();
    console.log(`   Total users: ${userCount}`);
    
    // Test if findOne works
    const testUser = await db.User.findOne();
    console.log(`   FindOne test: ${testUser ? '✓ Works' : '✗ No users found'}`);
    
    // Test Summary model
    console.log('\n2. Testing Summary model:');
    const summaryCount = await db.Summary.count();
    console.log(`   Total summaries: ${summaryCount}`);
    
    // Test association
    console.log('\n3. Testing associations:');
    if (testUser) {
      const userSummaries = await testUser.getSummaries();
      console.log(`   User has ${userSummaries.length} summaries`);
    }
    
    // Test raw query
    console.log('\n4. Testing raw query:');
    const [results] = await db.sequelize.query('SELECT 1+1 as result');
    console.log(`   Raw query result: ${results[0].result}`);
    
    console.log('\n✅ All model tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Model test failed:', error);
    console.error('\nPossible issues:');
    console.error('1. Database connection failed');
    console.error('2. Models not properly defined');
    console.error('3. Sequelize not properly initialized');
    console.error('\nError details:', error.message);
    process.exit(1);
  }
}

// Run test
testModels();