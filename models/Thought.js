const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      validate: [({ length }) => length <= 280, 'Must be less than 280 characters.']
    },
    username: {
      type: String,
      required: 'Username is Required'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);


const ThoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: 'thoughtText is Required',
    validate: [({ length }) => length >= 1 && length <= 280, 'Must be between 1 and 280 characters.']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
  username: {
    type: String,
    required: 'Username is Required'
  },
  reactions: [ReactionSchema]
},
{
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
}
);

ThoughtSchema.virtual('reactionCount').get(function(){
  return this.reactions.length;
})

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
