const mongoose = require('mongoose');
const {Schema,model} = mongoose;

// Define el esquema del modelo Post
const postSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  localidad: String,
  profilePicture: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // Esto agrega automáticamente campos de fecha createdAt y updatedAt
});

// Crea y exporta el modelo Post
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
