const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    maxlength: [100, 'Имя не может быть длиннее 100 символов']
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    validate: [validator.isEmail, 'Некорректный email']
  },
  rating: {
    type: Number,
    required: [true, 'Рейтинг обязателен'],
    min: [1, 'Рейтинг не может быть меньше 1'],
    max: [5, 'Рейтинг не может быть больше 5']
  },
  comment: {
    type: String,
    required: [true, 'Комментарий обязателен'],
    trim: true,
    maxlength: [1000, 'Комментарий не может быть длиннее 1000 символов']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Индекс для оптимизации запросов
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);