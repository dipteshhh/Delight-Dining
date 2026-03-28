import { Link } from 'react-router-dom'

interface MenuItem {
  emoji: string
  name: string
  price: string
  description: string
  tags?: string[]
}

interface MenuCategory {
  icon: string
  title: string
  items: MenuItem[]
}

const categories: MenuCategory[] = [
  {
    icon: '🍴',
    title: 'Starters & Small Plates',
    items: [
      { emoji: '🥗', name: 'Bruschetta al Pomodoro', price: '$9.99', description: 'Toasted sourdough topped with vine-ripened tomatoes, garlic, fresh basil, and extra virgin olive oil.', tags: ['Vegetarian'] },
      { emoji: '🦑', name: 'Crispy Calamari', price: '$12.99', description: 'Lightly battered squid rings served golden and crisp, with lemon aioli and marinara dip.', tags: ['Seafood', 'Crispy'] },
      { emoji: '🧀', name: 'Burrata & Prosciutto', price: '$14.99', description: 'Creamy burrata cheese paired with aged prosciutto, arugula, and a balsamic honey drizzle.', tags: ["Chef's Pick"] },
      { emoji: '🍄', name: 'Stuffed Mushrooms', price: '$10.99', description: 'Button mushrooms filled with herbed cream cheese, roasted garlic, and toasted breadcrumbs.', tags: ['Vegetarian'] },
    ],
  },
  {
    icon: '🍝',
    title: 'Main Courses',
    items: [
      { emoji: '🍕', name: 'Margherita Pizza', price: '$12.99', description: 'Hand-stretched dough, San Marzano tomato sauce, fresh mozzarella, and aromatic basil leaves.', tags: ['Popular', 'Vegetarian'] },
      { emoji: '🍝', name: 'Spaghetti Carbonara', price: '$14.99', description: 'Al dente spaghetti with crispy guanciale, pecorino romano, cracked pepper, and a silky egg yolk sauce.', tags: ["Chef's Pick"] },
      { emoji: '🐟', name: 'Grilled Atlantic Salmon', price: '$22.99', description: 'Pan-seared salmon fillet with lemon-dill butter, served on a bed of roasted vegetables and quinoa.', tags: ['Seafood', 'Healthy'] },
      { emoji: '🥩', name: 'Osso Buco', price: '$26.99', description: 'Slow-braised veal shanks in a rich tomato and wine sauce, topped with gremolata. Served with saffron risotto.', tags: ['Signature'] },
      { emoji: '🍚', name: 'Truffle Mushroom Risotto', price: '$18.99', description: 'Creamy Arborio rice slow-cooked with wild mushrooms, finished with truffle oil and shaved Parmigiano.', tags: ['Vegetarian', 'Rich'] },
      { emoji: '🥩', name: '8oz Filet Mignon', price: '$34.99', description: 'Prime beef tenderloin, char-grilled to your preference, with red wine reduction and roasted garlic mash.', tags: ['Premium'] },
    ],
  },
  {
    icon: '🍰',
    title: 'Desserts',
    items: [
      { emoji: '🍫', name: 'Chocolate Lava Cake', price: '$8.99', description: 'Warm, rich Valrhona chocolate cake with a molten center, paired with vanilla bean gelato.', tags: ['Popular'] },
      { emoji: '🍰', name: 'Tiramisu', price: '$9.99', description: 'Layers of espresso-soaked ladyfingers and mascarpone cream, dusted with Dutch cocoa powder.', tags: ['Classic'] },
      { emoji: '🍮', name: 'Panna Cotta', price: '$7.99', description: 'Silky vanilla bean custard with a vibrant seasonal berry compote and fresh mint.', tags: ['Light', 'Gluten-free'] },
      { emoji: '🍨', name: 'Affogato', price: '$6.99', description: 'A scoop of house-made vanilla gelato drowned in a shot of freshly pulled espresso.', tags: ['Quick Bite'] },
    ],
  },
  {
    icon: '🍷',
    title: 'Beverages',
    items: [
      { emoji: '🍷', name: 'House Red Wine', price: '$10.99', description: 'A smooth, full-bodied Chianti with notes of cherry and subtle oak. By the glass.' },
      { emoji: '🍸', name: 'Craft Cocktails', price: '$13.99', description: "Seasonal craft cocktails mixed by our expert bartender. Ask your server for today's specials." },
      { emoji: '☕', name: 'Espresso / Cappuccino', price: '$4.99', description: 'Premium single-origin espresso served straight, or as a perfectly frothed cappuccino.' },
      { emoji: '🍓', name: 'Fresh Pressed Juice', price: '$5.99', description: 'Daily fresh-pressed juices — orange, apple, or seasonal berry blend. No added sugar.', tags: ['Healthy'] },
    ],
  },
]

export default function Menu() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label animate-fade-up">What We Serve</span>
          <h1 className="section-title animate-fade-up delay-1">Our Menu</h1>
          <p className="section-subtitle mx-auto animate-fade-up delay-2">
            Explore our curated selection of dishes, crafted daily with the freshest
            seasonal ingredients and bold, inspired flavors.
          </p>
        </div>
      </section>

      <section className="menu-section">
        <div className="container">
          {categories.map((cat) => (
            <div className="menu-category animate-fade-up" key={cat.title}>
              <h2 className="menu-category-title">
                <span className="cat-icon">{cat.icon}</span> {cat.title}
              </h2>
              <div className="menu-list">
                {cat.items.map((item) => (
                  <div className="menu-item-card" key={item.name}>
                    <div className="menu-item-emoji">{item.emoji}</div>
                    <div className="menu-item-info">
                      <div className="menu-item-header">
                        <h3>{item.name}</h3>
                        <span className="menu-item-price">{item.price}</span>
                      </div>
                      <p>{item.description}</p>
                      {item.tags && (
                        <div className="menu-item-tags">
                          {item.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Hungry Yet?</span>
          <h2>Ready to Order?</h2>
          <p>Book your table or order for pickup — your feast awaits.</p>
          <Link to="/reservations" className="btn btn-primary">Reserve a Table</Link>
        </div>
      </section>
    </>
  )
}
