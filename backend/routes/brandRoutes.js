const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    stories: [],
    events: [],
    values: [],
  });
});

module.exports = router;
/*const express = require("express");
const router = express.Router();

// 🔥 Static brand content (you can later move to DB)
router.get("/", (req, res) => {
  res.json({
    stories: [
      {
        title: "The Art of Craftsmanship",
        desc: "Step inside our ateliers...",
        img: "https://images.unsplash.com/photo-1",
        link: "/",
      },
      {
        title: "Our Heritage",
        desc: "Founded in 1886...",
        img: "https://images.unsplash.com/photo-2",
        link: "/",
      },
    ],

    events: [
      {
        title: "Diamond Masterclass",
        date: "Dec 18, 2024",
        location: "Lahore",
        img: "https://images.unsplash.com/photo-3",
      },
    ],

    values: [
      {
        title: "Exceptional Craft",
        desc: "Every piece is handcrafted...",
      },
      {
        title: "Responsible Luxury",
        desc: "Ethically sourced materials...",
      },
      {
        title: "Timeless Design",
        desc: "Built for generations...",
      },
    ],
  });
});

module.exports = router;
*/
