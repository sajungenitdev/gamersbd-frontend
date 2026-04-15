"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Star,
    ChevronLeft,
    Loader2,
    Upload,
    X,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useUserAuth } from '../../../contexts/UserAuthContext';

interface Product {
    _id: string;
    name: string;
    images: string[];
    price: number;
    description: string;
}

const page = () => {
    const params = useParams();
    const router = useRouter();
    const { user, token } = useUserAuth();
    const productId = params?.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gamersbd-server.onrender.com";

    useEffect(() => {
        if (!user && !loading) {
            toast.error('Please login to submit a review');
            router.push(`/auth?redirect=/product/${productId}/review`);
        }
    }, [user, router, productId, loading]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products/${productId}`);
                if (response.data.success) {
                    setProduct(response.data.data);
                } else {
                    toast.error('Product not found');
                    router.push('/shop');
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Failed to load product');
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, API_URL, router]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 5) {
            toast.error('You can upload up to 5 images');
            return;
        }

        const validFiles: File[] = [];

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max 5MB`);
            } else if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image`);
            } else {
                validFiles.push(file);
            }
        });

        if (validFiles.length > 0) {
            setImages([...images, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !token) {
            toast.error('Please login to submit a review');
            router.push(`/auth?redirect=/product/${productId}/review`);
            return;
        }

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review comment');
            return;
        }

        if (comment.length < 10) {
            toast.error('Review must be at least 10 characters');
            return;
        }

        setSubmitting(true);

        try {
            // Convert images to base64
            let imageBase64Strings: string[] = [];
            if (images.length > 0) {
                toast.loading('Processing images...', { id: 'processing' });
                for (const image of images) {
                    const base64 = await convertToBase64(image);
                    imageBase64Strings.push(base64);
                }
                toast.dismiss('processing');
            }

            // Send data as JSON
            const reviewData = {
                rating: rating,
                comment: comment.trim(),
                title: title.trim() || undefined,
                images: imageBase64Strings
            };

            console.log('Sending review data:', {
                rating: reviewData.rating,
                commentLength: reviewData.comment.length,
                imagesCount: reviewData.images.length
            });

            const response = await axios.post(
                `${API_URL}/api/reviews/product/${productId}`,
                reviewData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 60000,
                }
            );

            if (response.data.success) {
                toast.success('Review submitted successfully!');
                imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
                router.push(`/product/${productId}`);
            } else {
                throw new Error(response.data.message || 'Failed to submit review');
            }
        } catch (error: any) {
            console.error('Submit error:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to submit review';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (ratingValue: number, interactive: boolean = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && setRating(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
                        disabled={!interactive}
                    >
                        <Star
                            className={`w-8 h-8 ${
                                star <= (hoverRating || rating)
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-600'
                            } transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-400">Product not found</p>
                    <Link href="/shop" className="mt-4 inline-block text-purple-400 hover:underline">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
            
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={`/product/${productId}`}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Product
                    </Link>
                </div>

                <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6">
                    <div className="flex gap-4">
                        <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                            <h1 className="text-xl font-bold text-white mb-1">
                                Write a Review for {product.name}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Share your experience with this product
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#2A2A2A] rounded-xl p-6">
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2">
                            Your Rating <span className="text-red-500">*</span>
                        </label>
                        {renderStars(rating, true)}
                        <p className="text-sm text-gray-500 mt-2">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="title" className="block text-white font-medium mb-2">
                            Review Title (Optional)
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Summarize your experience"
                            maxLength={100}
                            className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none transition"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="comment" className="block text-white font-medium mb-2">
                            Your Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={6}
                            placeholder="What did you like or dislike about this product? Share your honest opinion..."
                            maxLength={1000}
                            className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none transition resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {comment.length}/1000 characters (minimum 10)
                        </p>
                    </div>

                    {/* Image Upload Section */}
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2">
                            Add Photos (Optional)
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                            Upload up to 5 images to show your product. Max 5MB each.
                        </p>
                        
                        {imagePreviews.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-20 h-20 rounded-lg object-cover border border-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {images.length < 5 && (
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition">
                                <Upload className="w-4 h-4" />
                                Upload Photos
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                        <h3 className="text-white font-medium mb-2">Review Tips:</h3>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Be specific about what you liked or disliked</li>
                            <li>• Mention product quality, performance, and value</li>
                            <li>• Share photos to help other buyers</li>
                            <li>• Keep your review respectful and constructive</li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting || rating === 0 || !comment.trim() || comment.length < 10}
                            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Submit Review
                                </>
                            )}
                        </button>
                        
                        <Link
                            href={`/product/${productId}`}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default page;