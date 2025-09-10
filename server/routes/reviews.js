const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const rateLimit = require('express-rate-limit');

// Лимитер для защиты от спама
const createReviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 3, // максимум 3 запроса за период
  message: 'Слишком много отзывов создано с этого IP, попробуйте позже'
});

// Получить все одобренные отзывы
router.get('/', async (req, res) => {
  try {
    const { sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const reviews = await Review.find({ isApproved: true })
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ isApproved: true });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Создать новый отзыв
router.post('/', createReviewLimiter, async (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;

    // Валидация данных
    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Рейтинг должен быть от 1 до 5' });
    }

    const review = new Review({
      name: name.trim(),
      email: email.trim(),
      rating: parseInt(rating),
      comment: comment.trim()
    });

    const savedReview = await review.save();
    res.status(201).json({ 
      message: 'Отзыв успешно добавлен и ожидает модерации', 
      review: savedReview 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Админские роуты (в реальном приложении нужно добавить аутентификацию)

// Получить все отзывы (включая неодобренные)
router.get('/admin/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Одобрить отзыв
router.patch('/admin/approve/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    res.json({ message: 'Отзыв одобрен', review });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Удалить отзыв
router.delete('/admin/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    res.json({ message: 'Отзыв удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

module.exports = router;