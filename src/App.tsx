import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coffee, 
  Utensils, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronLeft, 
  CheckCircle2, 
  LayoutGrid,
  Search,
  ShoppingCart,
  X,
  User,
  Clock
} from "lucide-react";

// --- MENU DATA (EXACT) ---
const menu = [
  {
    category: "Boissons chaudes",
    items: [
      { name: "Café Espresso", price: 15 },
      { name: "Café américain", price: 18 },
      { name: "Espresso machiato", price: 17 },
      { name: "Café crème", price: 17 },
      { name: "Verveine au lait", price: 17 },
      { name: "Capsule Nespresso", price: 20 },
      { name: "Séparé", price: 17 },
      { name: "Cappuccino italiano", price: 17 },
      { name: "Cappuccino viennois", price: 19 },
      { name: "Thé marocain", price: 15 },
      { name: "Thé noir", price: 15 },
      { name: "Chocolat chaud", price: 18 },
      { name: "Chocolat fondu", price: 30 }
    ]
  },
  {
    category: "Jus",
    items: [
      { name: "Jus d’orange", price: 23 },
      { name: "Jus de banane", price: 23 },
      { name: "Jus de pomme", price: 23 },
      { name: "Jus de citron", price: 23 },
      { name: "Jus de mangue", price: 27 },
      { name: "Jus de fraise", price: 27 },
      { name: "Jus d’ananas", price: 27 },
      { name: "Jus d’avocat", price: 27 },
      { name: "Jus d’avocat orange", price: 29 },
      { name: "Jus de pomme orange", price: 25 },
      { name: "Jus de banane orange", price: 25 },
      { name: "Jus panaché", price: 31 },
      { name: "Cocktail Adam", price: 36 }
    ]
  },
  {
    category: "Sodas",
    items: [
      { name: "Limonade", price: 17 },
      { name: "Oulmès", price: 17 },
      { name: "Red Bull", price: 27 }
    ]
  },
  {
    category: "Crêpes",
    items: [
      { name: "Crêpe nature", price: 17 },
      { name: "Crêpe miel", price: 22 },
      { name: "Crêpe chocolat", price: 24 },
      { name: "Crêpe caramel", price: 24 },
      { name: "Crêpe Nutella", price: 27 },
      { name: "Crêpe Nutella banane", price: 32 },
      { name: "Crêpe Adam (boule de glace)", price: 42 }
    ]
  },
  {
    category: "Gâteaux & Viennoiseries",
    items: [
      { name: "Toast", price: 11 },
      { name: "Petit pain", price: 12 },
      { name: "Croissant fourré", price: 13 },
      { name: "Pain grillé", price: 13 },
      { name: "Meloui", price: 12 },
      { name: "Harcha", price: 12 },
      { name: "Mille feuilles", price: 22 },
      { name: "Gâteau glacé", price: 25 },
      { name: "Fourré noir", price: 25 },
      { name: "Cheese cake", price: 30 }
    ]
  },
  {
    category: "Glaces",
    items: [
      { name: "Coupe enfant (2 boules)", price: 28 },
      { name: "Coupe melba (3 boules)", price: 40 },
      { name: "Coupe Royal (4 boules)", price: 60 },
      { name: "Banane split", price: 70 },
      { name: "Coupe Adam (5 boules)", price: 55 },
      { name: "Milk shake", price: 30 },
      { name: "Orange shake", price: 33 }
    ]
  },
  {
    category: "Petit déjeuner",
    items: [
      { name: "Classique", price: 28 },
      { name: "Oriental", price: 30 },
      { name: "Beldi", price: 32 },
      { name: "Fassi", price: 36 },
      { name: "Adam", price: 34 }
    ]
  },
  {
    category: "Suppléments",
    items: [
      { name: "Crème Chantilly", price: 6 },
      { name: "Eau minérale 33cl", price: 5 },
      { name: "Eau minérale 50cl", price: 10 }
    ]
  }
];

// --- TYPES ---
type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type TablesState = {
  [tableNumber: number]: OrderItem[];
};

export default function App() {
  const [tables, setTables] = useState<TablesState>(() => {
    const initial: TablesState = {};
    for (let i = 1; i <= 50; i++) initial[i] = [];
    return initial;
  });
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [activeCategory, setActiveCategory] = useState(menu[0].category);

  const currentOrder = tables[selectedTable] || [];

  const totalAmount = useMemo(() => {
    return currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [currentOrder]);

  const addToOrder = (itemName: string, price: number) => {
    setTables(prev => {
      const tableOrder = [...(prev[selectedTable] || [])];
      const existingItemIndex = tableOrder.findIndex(i => i.name === itemName);

      if (existingItemIndex > -1) {
        tableOrder[existingItemIndex] = {
          ...tableOrder[existingItemIndex],
          quantity: tableOrder[existingItemIndex].quantity + 1
        };
      } else {
        tableOrder.push({ name: itemName, price, quantity: 1 });
      }

      return { ...prev, [selectedTable]: tableOrder };
    });
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setTables(prev => {
      const tableOrder = (prev[selectedTable] || []).map(item => {
        if (item.name === itemName) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);

      return { ...prev, [selectedTable]: tableOrder };
    });
  };

  const removeItem = (itemName: string) => {
    setTables(prev => ({
      ...prev,
      [selectedTable]: (prev[selectedTable] || []).filter(i => i.name !== itemName)
    }));
  };

  const checkout = () => {
    if (currentOrder.length === 0) return;
    setShowCheckoutConfirm(true);
  };

  const confirmCheckout = () => {
    setTables(prev => ({ ...prev, [selectedTable]: [] }));
    setShowCheckoutConfirm(false);
  };

  const filteredMenu = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return menu;
    return menu.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.name.toLowerCase().includes(query)
      )
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const scrollToCategory = (catName: string) => {
    setActiveCategory(catName);
    const element = document.getElementById(`cat-${catName}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Intersection Observer to update active category on scroll
  useEffect(() => {
    const observerOptions = {
      root: document.getElementById('menu-container'),
      rootMargin: '-150px 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id.replace('cat-', ''));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    menu.forEach(cat => {
      const el = document.getElementById(`cat-${cat.category}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredMenu]);

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
            <Coffee size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Espace Adam</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Système POS Mobile</p>
          </div>
        </div>

        <button 
          onClick={() => setShowTablePicker(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all active:scale-95 shadow-md"
        >
          <LayoutGrid size={18} />
          <span className="font-bold">Table {selectedTable}</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT/TOP: Order Summary */}
        <div className="h-[35%] md:h-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20 relative">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-orange-500" />
              <h3 className="font-bold text-slate-700">Commande Actuelle</h3>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
              {currentOrder.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 no-scrollbar">
            {currentOrder.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-60">
                <div className="p-10 rounded-full bg-white shadow-inner border border-slate-100">
                  <ShoppingCart size={64} strokeWidth={1} className="text-slate-200" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-slate-400 uppercase tracking-widest">Panier vide</p>
                  <p className="text-xs text-slate-400 mt-1">Sélectionnez des articles pour commencer</p>
                </div>
              </div>
            ) : (
              currentOrder.map((item) => (
                <motion.div 
                  layout
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-base leading-tight uppercase tracking-tight">{item.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Prix Unitaire: {item.price} DH</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-orange-600 text-lg">
                        {(item.price * item.quantity).toFixed(2)} <span className="text-[10px]">DH</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.name, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-600 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-90 border border-slate-100"
                      >
                        <Minus size={18} />
                      </button>
                      <div className="w-12 text-center">
                        <span className="font-black text-slate-800 text-lg">x{item.quantity}</span>
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.name, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-slate-600 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-90 border border-slate-100"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.name)}
                      className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-90 shadow-sm border border-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="p-6 bg-slate-900 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.1)] rounded-t-[2.5rem]">
            <div className="flex justify-between items-end mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Commande</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-orange-400">{totalAmount.toFixed(2)}</span>
                  <span className="text-sm font-bold text-slate-500">DH</span>
                </div>
              </div>
              <div className="text-right bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700/50">
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] block mb-1">Table</span>
                <p className="text-2xl font-black text-white leading-none">{selectedTable}</p>
              </div>
            </div>
            <button 
              disabled={currentOrder.length === 0}
              onClick={checkout}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-orange-900/20 text-sm"
            >
              <CheckCircle2 size={20} />
              Encaisser la commande
            </button>
          </div>
        </div>

        {/* RIGHT/BOTTOM: Menu Selection */}
        <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
          {/* Search and Category Tabs */}
          <div className="p-4 space-y-4 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un article (ex: Café, Jus...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {menu.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => scrollToCategory(cat.category)}
                  className={`
                    whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm border
                    ${activeCategory === cat.category 
                      ? 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-500/20' 
                      : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 border-slate-200 hover:border-orange-200'}
                  `}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Menu Items */}
          <div id="menu-container" className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth">
            {filteredMenu.map((cat) => (
              <div key={cat.category} id={`cat-${cat.category}`} className="scroll-mt-36">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-md border border-slate-100 shadow-sm">
                    {cat.category}
                  </h3>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cat.items.map((item) => (
                    <motion.button
                      key={item.name}
                      whileHover={{ y: -4, shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToOrder(item.name, item.price)}
                      className="bg-white p-4 rounded-3xl border border-slate-200 text-left flex flex-col justify-between gap-4 hover:border-orange-400 transition-all group shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                          {cat.category.includes("Boissons") ? <Coffee size={20} /> : <Utensils size={20} />}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                          <Plus size={16} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-orange-700 transition-colors">{item.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-orange-600 font-mono font-black text-base">{item.price} <span className="text-[10px]">DH</span></span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            {filteredMenu.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20">
                <div className="p-8 rounded-full bg-white shadow-inner">
                  <Search size={64} strokeWidth={1} className="text-slate-200" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-600">Aucun résultat</p>
                  <p className="text-sm">Essayez une autre recherche pour "{searchQuery}"</p>
                </div>
              </div>
            )}
            
            {/* Bottom Spacer */}
            <div className="h-20" />
          </div>
        </div>
      </div>

      {/* Table Picker Modal */}
      <AnimatePresence>
        {showTablePicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 p-2 rounded-xl text-white">
                    <LayoutGrid size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Plan de Salle</h2>
                </div>
                <button 
                  onClick={() => setShowTablePicker(false)}
                  className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => {
                    const isActive = (tables[num] || []).length > 0;
                    return (
                      <button
                        key={num}
                        onClick={() => {
                          setSelectedTable(num);
                          setShowTablePicker(false);
                        }}
                        className={`
                          aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 font-bold
                          ${num === selectedTable 
                            ? 'bg-slate-900 border-slate-900 text-white ring-4 ring-slate-900/10' 
                            : isActive 
                              ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-200' 
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'}
                        `}
                      >
                        <span className="text-lg">{num}</span>
                        {isActive && <span className="text-[8px] uppercase tracking-tighter opacity-80">Occupée</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
                  <span>Libre</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
                  <span>Occupée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-900" />
                  <span>Sélectionnée</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {showCheckoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Confirmer l'encaissement</h2>
              <p className="text-slate-500 mb-8">
                Voulez-vous clôturer la commande de la <span className="font-bold text-slate-800">Table {selectedTable}</span> pour un montant de <span className="font-bold text-orange-600">{totalAmount.toFixed(2)} DH</span> ?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCheckoutConfirm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmCheckout}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-200"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <User size={10} className="text-orange-500" />
            <span>Serveur: mcromeyox</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={10} className="text-orange-500" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span>Système Actif</span>
        </div>
      </footer>
    </div>
  );
}
