const express = require('express');
const bodyParses = require('body-parser');
const path = require('path');
const githubRoutes = require('./routes/github');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/github', githubRoutes);

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
