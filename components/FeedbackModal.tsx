import React, { useState } from 'react';
import { View, Modal, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Star, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/services/apiClient';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    try {
      await apiClient.request('/feedback', {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setRating(0);
        setComment('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback', error);
      // Fallback close
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={[styles.modalContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>

          {success ? (
            <View style={styles.successContainer}>
              <ThemedText type="subtitle" style={styles.successText}>Thank you for your feedback!</ThemedText>
            </View>
          ) : (
            <>
              <ThemedText type="subtitle" style={styles.title}>How are we doing?</ThemedText>
              <ThemedText style={styles.subtitle}>Your feedback helps us improve.</ThemedText>

              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Star 
                      size={40} 
                      color={star <= rating ? '#FFD700' : (isDark ? '#444' : '#E0E0E0')} 
                      fill={star <= rating ? '#FFD700' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDark ? '#333' : '#F5F5F5',
                  color: isDark ? '#fff' : '#000'
                }]}
                placeholder="Tell us more (optional)"
                placeholderTextColor={isDark ? '#888' : '#aaa'}
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity 
                style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]} 
                disabled={rating === 0 || loading}
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.submitBtnText}>Submit Feedback</ThemedText>
                )}
              </TouchableOpacity>
            </>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginTop: 8,
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    textAlign: 'center',
  }
});
