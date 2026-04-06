import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomButton from "./components/CustomButton";
import { motion, AnimatePresence } from "framer-motion";
import TypingText from "./components/TypingText"

const CloudinaryLibrary = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Для модального окна просмотра
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async (nextCursor = null) => {
    setLoading(true);
    try {
      const url = `/api/cloudinary-images${nextCursor ? `?next_cursor=${nextCursor}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setImages(prev => nextCursor ? [...prev, ...data.resources] : data.resources);
        setCursor(data.next_cursor);
      } else {
        toast.error(data.error || "Ошибка загрузки библиотеки");
      }
    } catch (err) {
      toast.error("Не удалось подключиться к Cloudinary");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (publicId) => {
    if (!confirm("Вы уверены, что хотите удалить это изображение?")) return;

    setDeletingId(publicId);
    try {
      const res = await fetch('/api/cloudinary-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId }),
      });

      const data = await res.json();

      if (res.ok) {
        setImages(prev => prev.filter(img => img.public_id !== publicId));
        toast.success("Изображение успешно удалено");
        if (selectedImage?.public_id === publicId) setSelectedImage(null);
      } else {
        toast.error(data.error || "Не удалось удалить изображение");
      }
    } catch (err) {
      toast.error("Ошибка при удалении");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredImages = images.filter(img =>
    img.public_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="space-y-8">
      {/* Заголовок + поиск */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Библиотека изображений</h2>
          <p className="text-gray-400 mt-1">
            {filteredImages.length} из {images.length} изображений
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 rounded-2xl bg-white/10 border border-white/20 px-5 py-3 text-white placeholder-gray-400 focus:border-violet-400 focus:outline-none"
          />
          <CustomButton onClick={() => fetchImages()} disabled={loading}>
            Обновить
          </CustomButton>
        </div>
      </div>

      {/* Галерея */}
      <AnimatePresence mode="wait">
        {loading && images.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
              <p className="mt-4 text-xl text-gray-400">Загружаем библиотеку...</p>
            </div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <div className="text-7xl mb-6 opacity-50">🖼️</div>
            <p className="text-2xl text-gray-300">Ничего не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.public_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.015 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl cursor-pointer transition-all hover:-translate-y-2 hover:border-violet-400 hover:shadow-2xl"
                onClick={() => setSelectedImage(img)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={img.secure_url}
                    alt={img.public_id}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                <div className="p-4">
                  <div className="line-clamp-1 text-sm font-medium text-white">
                    {img.public_id.split('/').pop()}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {(img.bytes / 1024).toFixed(1)} KB • {new Date(img.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>

                {/* Кнопка удаления */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // чтобы не открывалось большое фото
                    deleteImage(img.public_id);
                  }}
                  disabled={deletingId === img.public_id}
                  className="absolute top-4 right-4 rounded-full bg-red-600/90 p-2.5 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                >
                  {deletingId === img.public_id ? "⋯" : "🗑"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Кнопка "Загрузить ещё" */}
      {cursor && (
        <div className="flex justify-center mt-12">
          <CustomButton 
            onClick={() => fetchImages(cursor)} 
            disabled={loading}
            size="lg"
          >
            {loading ? "Загрузка..." : "Загрузить ещё изображения"}
          </CustomButton>
        </div>
      )}

            {/* ====================== МОДАЛЬНОЕ ОКНО ПРОСМОТРА ====================== */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закрытия */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-4 text-5xl text-white/70 hover:text-white transition z-20"
              >
                ×
              </button>

              {/* Само изображение */}
              <div className="relative rounded-3xl overflow-hidden bg-black/40 flex items-center justify-center max-h-[78vh]">
                <img
                  src={selectedImage.secure_url}
                  alt={selectedImage.public_id}
                  className="max-h-[78vh] max-w-full object-contain"
                />
              </div>

              {/* Фиксированная панель снизу — всегда видна и не перекрывает фото */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-[17px] break-all">
                        {selectedImage.public_id.split('/').pop()}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {(selectedImage.bytes / 1024).toFixed(1)} KB • 
                        {new Date(selectedImage.created_at).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteImage(selectedImage.public_id)}
                      disabled={deletingId === selectedImage.public_id}
                      className="flex-shrink-0 flex items-center gap-3 rounded-2xl bg-red-600 hover:bg-red-700 px-7 py-3.5 text-white font-medium transition disabled:opacity-60"
                    >
                      {deletingId === selectedImage.public_id ? "Удаляем..." : "🗑 Удалить изображение"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      
      </AnimatePresence>
    </div>
  );
};

export default CloudinaryLibrary;