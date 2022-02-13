const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/socialnetworkdb', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

// /api/users
// Retrieve all users
app.get('/api/users', (req, res) => {
  db.User.find({})
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/api/users/:id', (req, res) => {
  db.User.findOne({ _id: req.params.id })
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post('/api/users', (req, res) => {
  db.User.create(req.body)
  .then(dbUserData => res.json(dbUserData))
  .catch(err => res.json(err));
});

app.put('/api/users/:id', (req, res) => {
  db.User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => res.json(err));
});

app.delete('/api/users/:id', (req, res) => {
  db.User.findOneAndDelete({ _id: req.params.id })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => res.json(err));
});

// /api/users/:userId/friends/:friendId
// Create a new friend for a user
app.post('/api/users/:userId/friends/:friendId', (req, res) => {
  db.User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId }},
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
  db.User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId }},
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

// /api/thoughts
// Retrieve all thoughts
app.get('/api/thoughts', (req, res) => {
  db.Thought.find({})
    .then(dbThought => {
      res.json(dbThought);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/api/thoughts/:id', (req, res) => {
  db.Thought.findOne({ _id: req.params.id })
    .then(dbThought => {
      res.json(dbThought);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post('/api/thoughts', (req, res) => {
  db.Thought.create(req.body)
  .then(({_id}) => {
    return db.User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: _id }},
      { runValidators: true, new: true }
    );
  })
  .then (dbUserData => {
    if(!dbUserData){
      return res.status(404).json({message: "No user for this id!"});
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
  })
  /*
  db.Thought.create(req.body)
  .then(dbThoughtData => {
    res.json(dbThoughtData);
    db.User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: dbThoughtData._id }},
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
  })
  .catch(err => res.json(err));
  */

});

app.put('/api/thoughts/:id', (req, res) => {
  db.Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.json(err));
});

app.delete('/api/thoughts/:id', (req, res) => {
  db.Thought.findOneAndDelete({ _id: req.params.id })
  .then(dbThoughtData => res.json(dbThoughtData))
  .catch(err => res.json(err));
});

// /api/thoughts/:thoughtId/reactions
// Create a new friend for a user
app.post('/api/thoughts/:thoughtId/reactions', (req, res) => {
  db.Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body }},
    { runValidators: true, new: true }
  )
  .then (dbThoughtData => {
    if(!dbThoughtData){
      return res.status(404).json({message: "No thought for this id!"});
    }
    res.json(dbThoughtData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', (req, res) => {
  db.Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: {reactionId: req.params.reactionId }}},
    { runValidators: true, new: true }
  )
  .then (dbThoughtData => {
    if(!dbThoughtData){
      return res.status(404).json({message: "No thought for this id!"});
    }
    res.json(dbThoughtData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
