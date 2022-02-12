const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/populatedb', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

// /api/users
// Retrieve all users
app.get('/users', (req, res) => {
  db.User.find({})
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/users/:id', (req, res) => {
  db.User.findOne({ _id: req.params.id })
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post('/users/:id', (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => res.json(err));
});

app.delete('/users/:id', (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => res.json(err));
});

// /api/users/:userId/friends/:friendId
// Create a new friend for a user
app.post('/api/users/:userId/friends/:friendId', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: {friendId: req.params.userId } }},
    { runValidators: true, new: true }
  )
  .then (dbUserData => {
    if(!dbUserData){
      return res.status(404).json({message: "No user for this id!"});
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

app.delete('/api/users/:userId/friends/:friendId', (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { notes: {friendId: req.params.friendId }}},
    { runValidators: true, new: true }
  )
  .then (dbUserData => {
    if(!dbUserData){
      return res.status(404).json({message: "No notebook for this id!"});
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// /api/thoughts
// Retrieve all thoughts
app.get('/thoughts', (req, res) => {
  db.Thought.find({})
    .then(dbThought => {
      res.json(dbThought);
    })
    .catch(err => {
      res.json(err);
    });
});

// Create a new thought and associate it with user
app.post('/submit', ({ body }, res) => {
  db.Thought.create(body)
    .then(({ _id }) =>
      db.User.findOneAndUpdate({}, { $push: { thoughts: _id } }, { new: true })
    )
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/populate', (req, res) => {
  db.User.find({})
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
