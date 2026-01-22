
import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { getProducts, addProduct } from '../services/mockBackend';
import * as ai from '../services/aiService';

interface ProductsPageProps {
  user: User;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'Cotton',
    description: '',
    imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`
  });

  useEffect(() => {
    setProducts(getProducts().filter(p => p.sellerId === user.id));
  }, [user.id]);

  const handleMagicDescription = async () => {
    if (!newProduct.name) return;
    setLoadingAI(true);
    try {
      const desc = await ai.fastChat(`Write a professional 2-sentence description for a textile product named "${newProduct.name}" in the category "${newProduct.category}". Focus on quality and B2B appeal.`);
      setNewProduct(prev => ({ ...prev, description: desc || prev.description }));
    } catch (e) { console.error(e); }
    setLoadingAI(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ ...newProduct, sellerId: user.id });
    setProducts(getProducts().filter(p => p.sellerId === user.id));
    setShowAddModal(false);
    setNewProduct({
      name: '',
      price: 0,
      category: 'Cotton',
      description: '',
      imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900">My Inventory</h2>
          <p className="text-slate-500">Manage your textile listings and track availability.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span>List New Fabric</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="h-48 relative overflow-hidden">
               <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase">
                  {product.category}
               </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-2xl font-black text-slate-900">₹{product.price}<span className="text-xs text-slate-400 font-normal"> /m</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
               <h3 className="text-xl font-black text-indigo-900">List New Fabric</h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2">Fabric Name</label>
                <input
                  required
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2">Price (₹/m)</label>
                  <input
                    required
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full p-4 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white"
                  >
                    <option>Cotton</option>
                    <option>Silk</option>
                    <option>Linen</option>
                    <option>Synthetic</option>
                    <option>Wool</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <button
                    type="button"
                    onClick={handleMagicDescription}
                    disabled={loadingAI || !newProduct.name}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter flex items-center space-x-1"
                  >
                    {loadingAI ? 'Generating...' : '✨ Magic Write'}
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 resize-none"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">
                Create Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
