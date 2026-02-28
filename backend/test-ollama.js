// test-ollama.js
require('dotenv').config();
const OllamaService = require('./src/services/ollamaService');

async function testOllamaIntegration() {
  console.log('🚀 Testing Ollama Integration\n');
  
  // Test 1: Check Ollama health
  console.log('1. Checking Ollama health...');
  const health = await OllamaService.checkHealth();
  console.log('✅ Health Status:', health.available ? 'Available' : 'Unavailable');
  
  if (health.available) {
    console.log('📋 Available Models:', health.models.map(m => m.name).join(', '));
    console.log('🔧 Ollama Version:', health.version);
  } else {
    console.log('❌ Error:', health.error);
    console.log('\n💡 Make sure Ollama is running:');
    console.log('   ollama serve');
    console.log('   curl http://192.168.1.30:11434/api/tags');
    return;
  }

  // Test 2: List models
  console.log('\n2. Listing available models...');
  const models = await OllamaService.listModels();
  console.log('📋 Models:', models.map(m => m.name).join(', '));

  // Test 3: Test a simple prompt
  console.log('\n3. Testing simple prompt...');
  try {
    const testPrompt = 'Hello, how are you?';
    const response = await OllamaService.generateCompletion(testPrompt, {
      model: process.env.OLLAMA_MODEL || 'llama2',
      options: {
        temperature: 0.7,
        num_predict: 50
      }
    });
    console.log('✅ Prompt:', testPrompt);
    console.log('🤖 Response:', response.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Simple prompt failed:', error.message);
  }

  // Test 4: Test summary generation
  console.log('\n4. Testing summary generation...');
  try {
    const testTranscript = [
      { text: 'Welcome to this tutorial about machine learning.' },
      { text: 'Today we will cover the basics of neural networks and how they work.' },
      { text: 'Neural networks are inspired by the human brain and consist of layers of neurons.' },
      { text: 'We will also discuss backpropagation and gradient descent algorithms.' },
      { text: 'These algorithms help the neural network learn from data and improve over time.' }
    ];

    const summary = await OllamaService.generateSummary(testTranscript, {
      length: 'short',
      language: 'english',
      includeKeyPoints: true,
      includeChapters: false
    });

    console.log('✅ Summary generated successfully');
    console.log('📝 Summary:', summary.summary.substring(0, 150) + '...');
    console.log('🔑 Key Points:', summary.keyPoints.length);
    summary.keyPoints.forEach((point, i) => {
      console.log(`   ${i + 1}. ${point.substring(0, 60)}...`);
    });
    console.log('🏷️  Tags:', summary.tags.join(', '));
    console.log('😊 Sentiment:', summary.sentiment);
    console.log('⚡ Complexity:', summary.complexity);
    console.log('⏱️  Processing Time:', summary.processingTime + 'ms');
    console.log('🤖 Model Provider:', summary.modelProvider);
  } catch (error) {
    console.log('❌ Summary generation failed:', error.message);
    console.log('💡 Error details:', error);
  }

  // Test 5: Test sentiment analysis
  console.log('\n5. Testing sentiment analysis...');
  try {
    const positiveText = 'This is absolutely amazing! I love how everything works perfectly.';
    const negativeText = 'This is terrible and completely broken. Nothing works as expected.';
    const neutralText = 'This is a standard implementation that follows the requirements.';

    const [positive, negative, neutral] = await Promise.all([
      OllamaService.analyzeSentiment(positiveText),
      OllamaService.analyzeSentiment(negativeText),
      OllamaService.analyzeSentiment(neutralText)
    ]);

    console.log('✅ Sentiment analysis:');
    console.log('   Positive text:', positive);
    console.log('   Negative text:', negative);
    console.log('   Neutral text:', neutral);
  } catch (error) {
    console.log('❌ Sentiment analysis failed:', error.message);
  }

  // Test 6: Test batch processing
  console.log('\n6. Testing batch processing...');
  try {
    const texts = [
      'Artificial intelligence is transforming industries.',
      'Machine learning algorithms analyze data patterns.',
      'Deep learning uses neural networks for complex tasks.'
    ];

    const batchResults = await OllamaService.batchSummarize(
      texts.map(text => [{ text }]),
      { length: 'short', includeKeyPoints: false }
    );

    console.log('✅ Batch processing complete:');
    batchResults.forEach((result, i) => {
      console.log(`   Item ${i + 1}: ${result.success ? '✓' : '✗'}`, 
        result.success ? result.data.summary.substring(0, 50) + '...' : result.error);
    });
  } catch (error) {
    console.log('❌ Batch processing failed:', error.message);
  }

  console.log('\n🎉 Ollama integration test complete!');
}

// Run the test
testOllamaIntegration().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});