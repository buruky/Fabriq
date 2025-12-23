import React, { useState } from 'react';
import { uploadToCloudinary } from '../../services/cloudinary';
import { getCategoryNames } from '../../config/categories';

const clothingTypes = getCategoryNames();

const EditClothingModal = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.alt);
  const [type, setType] = useState(item.type);
  const [file, setFile] = useState(null); // New file to upload (optional)
  const [filePreview, setFilePreview] = useState(null); // Preview of new file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(uploaded);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      let imageUrl = item.src; // Keep existing image by default

      // If user selected a new image, upload it
      if (file) {
        setUploadProgress('Uploading new image...');
        imageUrl = await uploadToCloudinary(file);
      }

      setUploadProgress('Saving changes...');

      const updated = {
        ...item,
        alt: name.trim(),
        type,
        src: imageUrl,
      };

      await onSave(updated);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update item. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-neutral-card border border-neutral-border rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-border">
          <h2 className="text-2xl font-bold text-neutral-text">Edit Clothing Item</h2>
          <p className="text-sm text-neutral-text-muted mt-1">Update item details or change image</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current/New Image */}
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Current Image
            </label>
            <img
              src={filePreview || item.src}
              alt="preview"
              className="w-full h-48 object-contain bg-neutral-background/30 border border-neutral-border rounded-xl p-4"
            />
          </div>

          {/* Change Image Option */}
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Change Image (optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-edit"
              />
              <label
                htmlFor="file-upload-edit"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-neutral-border rounded-xl cursor-pointer hover:border-primary transition-colors bg-neutral-background/50"
              >
                <svg className="w-5 h-5 text-neutral-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-neutral-text">
                  {file ? 'New Image Selected' : 'Upload New Image'}
                </span>
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-xl text-sm flex items-center gap-3">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{uploadProgress}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-950/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label htmlFor="item-name-edit" className="block text-sm font-semibold text-neutral-text mb-2">
              Item Name
            </label>
            <input
              id="item-name-edit"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Item Name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="clothing-type-edit" className="block text-sm font-semibold text-neutral-text mb-2">
              Category
            </label>
            <select
              id="clothing-type-edit"
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {clothingTypes.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-xl border border-neutral-border text-neutral-text hover:bg-neutral-background/50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClothingModal;
