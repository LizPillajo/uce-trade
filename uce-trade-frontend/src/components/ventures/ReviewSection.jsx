import { useState } from 'react';
import { Box, Typography, Avatar, TextField, Rating, Paper, Stack, Divider, Alert } from '@mui/material';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReviews, postReview } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ReviewSection = ({ ventureId }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // 1. Obtener Reviews
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', ventureId],
    queryFn: () => fetchReviews(ventureId)
  });

  // 2. Mutación para enviar review
  const mutation = useMutation({
    mutationFn: (newReview) => postReview(ventureId, newReview),
    onSuccess: () => {
      // Recargar reviews y también la info del venture (estrellas promedio)
      queryClient.invalidateQueries(['reviews', ventureId]);
      queryClient.invalidateQueries(['venture', ventureId]); 
      setComment('');
      setRating(5);
    }
  });

  const handleSubmit = () => {
    if(!comment.trim()) return;
    mutation.mutate({ rating, comment });
  };

  return (
    <Box mt={6} id="reviews-section">
      <Typography variant="h5" fontWeight="bold" color="#0d2149" mb={3}>
        Reviews & Comments
      </Typography>

      {isAuthenticated ? (
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e5e7eb', borderRadius: '16px', bgcolor: '#f9fafb' }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: '#efb034' }}>{user.name.charAt(0)}</Avatar>
            <Box>
                <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                <Typography variant="caption" color="text.secondary">Share your experience</Typography>
            </Box>
          </Stack>
          
          <Box mb={2}>
            <Typography component="legend" variant="caption">Rating</Typography>
            <Rating value={rating} onChange={(e, val) => setRating(val)} />
          </Box>

          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            placeholder="Write a comment..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ bgcolor: 'white', mb: 2 }}
          />
          
          <Box textAlign="right">
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending ? 'Posting...' : 'Post Review'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }} action={
            <Button color="inherit" size="small" onClick={() => navigate('/login')}>Login</Button>
        }>
            You must be logged in to rate and comment.
        </Alert>
      )}

      {/* --- LISTA DE COMENTARIOS --- */}
      <Stack spacing={3}>
        {reviews?.map((review) => (
            <Paper key={review.id} elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eaecf0' }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={2}>
                        <Avatar src={review.user?.avatarUrl} alt={review.user?.fullName}>{review.user?.fullName?.charAt(0)}</Avatar>
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
        {reviews?.length === 0 && <Typography color="text.secondary">No reviews yet. Be the first!</Typography>}
      </Stack>
    </Box>
  );
};

export default ReviewSection;