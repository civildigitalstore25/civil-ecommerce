import axios from 'axios';

interface GoogleReview {
    author_name: string;
    profile_photo_url: string;
    rating: number;
    text: string;
    relative_time_description: string;
    time: number;
}

interface GooglePlaceDetailsResponse {
    result: {
        name: string;
        rating: number;
        reviews: GoogleReview[];
        user_ratings_total: number;
    };
    status: string;
}

interface ReviewResponse {
    name: string;
    rating: number;
    total: number;
    reviews: GoogleReview[];
    lastUpdated: string;
    nextUpdate: string;
    stale?: boolean;
    message?: string;
}

class GoogleReviewsService {
    private readonly apiKey: string;
    private readonly placeId: string;
    private readonly baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    private cache: ReviewResponse | null = null;
    private lastFetch: number = 0;
    private readonly cacheDuration = 30 * 60 * 1000; // 30 minutes
    private disabled: boolean = false;

    constructor() {
        this.apiKey = process.env.REVIEW_API_KEY || '';
        this.placeId = process.env.REVIEW_PLACE_ID || '';

        if (!this.apiKey || !this.placeId) {
            // Don't throw here — allow the app to start but mark the service as disabled.
            console.warn('Google Reviews not configured: REVIEW_API_KEY and/or REVIEW_PLACE_ID missing. The service will return empty reviews.');
            this.disabled = true;
        }
    }

    async getReviews(): Promise<ReviewResponse> {
        if (this.disabled) {
            // Return a safe empty response when the service is not configured
            const now = Date.now();
            return {
                name: '',
                rating: 0,
                total: 0,
                reviews: [],
                lastUpdated: new Date(now).toISOString(),
                nextUpdate: new Date(now + this.cacheDuration).toISOString(),
                message: 'Google Reviews not configured',
            };
        }
        const now = Date.now();

        // Return cached data if still fresh
        if (this.cache && (now - this.lastFetch) < this.cacheDuration) {
            console.log('Returning cached Google Reviews data');
            return this.cache;
        }

        try {
            console.log('Fetching Google Reviews from API...');
            console.log('API Key configured:', !!this.apiKey);
            console.log('Place ID configured:', !!this.placeId);

            const response = await axios.get<GooglePlaceDetailsResponse>(this.baseUrl, {
                params: {
                    place_id: this.placeId,
                    fields: 'name,rating,reviews,user_ratings_total',
                    key: this.apiKey,
                    reviews_sort: 'most_relevant'
                }
            });

            console.log('Google API Response Status:', response.data.status);
            console.log('Google API Response:', JSON.stringify(response.data, null, 2));

            if (response.data.status !== 'OK') {
                throw new Error(`Google Places API error: ${response.data.status}`);
            }

            const { result } = response.data;

            // Transform reviews to include only necessary fields
            const transformedReviews = result.reviews?.slice(0, 10).map(review => ({
                author_name: review.author_name,
                profile_photo_url: review.profile_photo_url || '',
                rating: review.rating,
                text: review.text || '',
                relative_time_description: review.relative_time_description,
                time: review.time
            })) || [];

            console.log(`Found ${transformedReviews.length} reviews for place: ${result.name}`);

            const reviewData: ReviewResponse = {
                name: result.name,
                rating: result.rating,
                total: result.user_ratings_total,
                reviews: transformedReviews,
                lastUpdated: new Date().toISOString(),
                nextUpdate: new Date(now + this.cacheDuration).toISOString()
            };

            // Cache the result
            this.cache = reviewData;
            this.lastFetch = now;

            return reviewData;

        } catch (error) {
            console.error('Error fetching Google Reviews:', error);

            // Return stale cache if available
            if (this.cache) {
                return {
                    ...this.cache,
                    stale: true,
                    message: 'Showing cached data due to API error'
                };
            }

            throw new Error('Failed to fetch reviews from Google Places API');
        }
    }    // Method to clear cache (useful for testing or manual refresh)
    clearCache(): void {
        this.cache = null;
        this.lastFetch = 0;
    }
}

export default new GoogleReviewsService();