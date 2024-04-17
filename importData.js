const mongoose = require('mongoose');
const Data = require('./models/data.model');
const sampleData = require('./sample-data.json'); 
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected...');

    try {
      await Data.deleteMany({}); // Clear existing data
      await Data.insertMany(sampleData); // Insert sample data
      console.log('Sample data imported successfully');
    } catch (err) {
      console.error('Error importing sample data:', err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));