import { Box, Typography, Avatar, Rating, Paper, Stack } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EmptyState from '../common/EmptyState';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
        <EmptyState 
            title="No reviews yet" 
            subtitle="Be the first to share your experience with this service!"
            icon={<RateReviewIcon sx={{ fontSize: 40, color: '#9ca3af' }} />}
            sx={{ py: 2 }} 
        />
    );
  }

  return (
    <Stack spacing={3}>
        {reviews.map((review) => (
            <Paper key={review.id} elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eaecf0' }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={2}>
                        <Avatar src={review.user?.avatarUrl} alt={review.user?.fullName}>
                            {review.user?.fullName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">{review.user?.fullName}</Typography>
                            <Rating value={review.rating} readOnly size="small" />
                        </Box>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(review.date).toLocaleDateString()}
                    </Typography>
                </Stack>
                <Typography variant="body2" mt={2} color="text.secondary">
                    {review.comment}
                </Typography>
            </Paper>
        ))}
    </Stack>
  );
};

export default ReviewList;